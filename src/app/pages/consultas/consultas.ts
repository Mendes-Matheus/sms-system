import { Component, NgModule, OnInit } from '@angular/core';
import { ConsultaModel, Estabelecimento, TipoConsulta, StatusConsulta } from './consulta.model';
import { ConsultaService } from '../../core/services/consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { PacienteService } from '../../core/services/paciente.service';
import { PacienteModel } from '../modals/paciente/paciente.model';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

interface ConsultaView {
  nome: string;
  cpf?: string;
  cns?: string;
  consulta: ConsultaModel;
}

@Component({
  selector: 'app-consultas',
  imports: [
    CommonModule,
    NgxMaskPipe,
    FormsModule
  ],
  templateUrl: './consultas.html',
  styleUrl: './consultas.scss',
  providers: [provideNgxMask()]
})
export class Consultas implements OnInit {

  consultasVM: ConsultaView[] = [];
  TipoConsulta = TipoConsulta;
  StatusConsulta = StatusConsulta;
  Estabelecimento = Estabelecimento;
  
  // Propriedades para o modal de edição
  modalAberto = false;
  consultaEditada: ConsultaModel = ConsultaModel.newConsultaModel();
  consultaOriginal: ConsultaModel | null = null;
  pacienteSelecionado: PacienteModel | null = null;
  mostrarCampoData = false;
  mostrarCampoObservacao = false;
  dataMinima: Date = new Date(); // Data mínima para agendamento (hoje)

  // Opções para os selects
  statusOptions = Object.values(StatusConsulta);

  consulta: ConsultaModel = ConsultaModel.newConsultaModel();

  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.carregarConsultas();
  }

  carregarConsultas(): void {
    const todas = this.consultaService.buscarTodasConsultas();
    this.consultasVM = todas.map(c => {
      const p: PacienteModel | undefined = this.pacienteService.buscarPacientePorId(c.pacienteId!);
      return {
        consulta: c,
        nome: p?.nome ?? '–––',
        cpf: p?.cpf,
        cns: p?.cns
      };
    });
  }

  visualizarConsulta(consulta: ConsultaModel): void {
    // Navegar para a página de detalhes da consulta
    this.router.navigate(['/consultas/detalhes', consulta.id]);
  }

  abrirModalEdicao(item: ConsultaView): void {
    this.consultaOriginal = item.consulta;
    
    // Buscar informações completas do paciente
    this.pacienteSelecionado = this.pacienteService.buscarPacientePorId(item.consulta.pacienteId!) || null;
    
    // Criar uma cópia para edição
    this.consultaEditada = {...item.consulta};
    
    // Verificar se deve mostrar os campos condicionais
    this.mostrarCampoData = this.consultaEditada.status === StatusConsulta.AGENDADA || 
                           this.consultaEditada.status === StatusConsulta.REAGENDADA;
    
    this.mostrarCampoObservacao = this.consultaEditada.status === StatusConsulta.CANCELADA;
    
    this.modalAberto = true;
  }

  onStatusChange(): void {
    // Mostrar campo de data apenas para status Agendada ou Reagendada
    this.mostrarCampoData = this.consultaEditada.status === StatusConsulta.AGENDADA || 
                           this.consultaEditada.status === StatusConsulta.REAGENDADA ||
                           this.consultaEditada.status === StatusConsulta.REALIZADA ||
                           this.consultaEditada.status === StatusConsulta.CANCELADA;
    
    // Mostrar campo de observação apenas para status Cancelada
    this.mostrarCampoObservacao = this.consultaEditada.status === StatusConsulta.CANCELADA;
    
    // Se o status não for Agendada/Reagendada, limpar a data de agendamento
    if (!this.mostrarCampoData) {
      this.consultaEditada.dataAgendamento = undefined;
    } else if (!this.consultaEditada.dataAgendamento) {
      // Se for Agendada/Reagendada e não tiver data, definir uma data padrão (amanhã)
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      this.consultaEditada.dataAgendamento = amanha;
    }
    
    // Se o status não for Cancelada, limpar a observação
    if (!this.mostrarCampoObservacao) {
      this.consultaEditada.observacao = '';
    }
  }

  formularioValido(): boolean {
    // Validação básica do formulário
    if (!this.consultaEditada.status) {
      return false;
    }
    
    // Se for Agendada/Reagendada, a data é obrigatória
    if ((this.consultaEditada.status === StatusConsulta.AGENDADA || 
         this.consultaEditada.status === StatusConsulta.REAGENDADA) &&
        !this.consultaEditada.dataAgendamento) {
      return false;
    }
    
    // Se for Cancelada, a observação é obrigatória
    if (this.consultaEditada.status === StatusConsulta.CANCELADA && 
        (!this.consultaEditada.observacao || this.consultaEditada.observacao.trim() === '')) {
      return false;
    }
    
    return true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.consultaOriginal = null;
    this.pacienteSelecionado = null;
    this.consultaEditada = ConsultaModel.newConsultaModel();
    this.mostrarCampoData = false;
    this.mostrarCampoObservacao = false;
  }

  salvarEdicao(): void {
    if (this.consultaOriginal && this.formularioValido()) {
      // Atualizar apenas os campos editáveis
      this.consultaOriginal.status = this.consultaEditada.status;
      this.consultaOriginal.dataAgendamento = this.consultaEditada.dataAgendamento;
      this.consultaOriginal.observacao = this.consultaEditada.observacao;
      
      // Se o status foi alterado para Agendada/Reagendada sem data, definir data padrão
      if ((this.consultaOriginal.status === StatusConsulta.AGENDADA || 
           this.consultaOriginal.status === StatusConsulta.REAGENDADA) &&
          !this.consultaOriginal.dataAgendamento) {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        this.consultaOriginal.dataAgendamento = amanha;
      }
      
      // Salvar no serviço
      this.consultaService.atualizarConsulta(this.consultaOriginal);
      
      // Recarregar a lista
      this.carregarConsultas();
      
      // Fechar o modal
      this.fecharModal();
    }
  }

  deletarConsulta(consulta: ConsultaModel): void {
    if (confirm('Tem certeza que deseja excluir esta consulta?')) {
      this.consultaService.excluirConsulta(consulta.id!);
      this.carregarConsultas();
    }
  }

  onSubmitConsulta(form: NgForm) {
    if (form.valid) {
      const novaConsulta = ConsultaModel.newConsultaModel();
      novaConsulta.pacienteId = this.consulta.pacienteId; // paciente previamente selecionado
      novaConsulta.tipoConsulta = form.value.tipoConsulta;
      novaConsulta.status = StatusConsulta.PENDENTE;
      novaConsulta.dataSolicitacao = new Date();
      novaConsulta.estabelecimento = form.value.estabelecimento;
      novaConsulta.observacao = form.value.observacao;

      this.consultaService.salvarConsulta(novaConsulta);
      this.carregarConsultas();

      alert('Consulta associada ao paciente com sucesso!');
    } else {
      console.warn('Formulário de consulta inválido!');
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { ConsultaModel, Estabelecimento, TipoConsulta, StatusConsulta } from '../../core/models/consulta.model';
import { ConsultaService } from '../../core/services/consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { PacienteService } from '../../core/services/paciente.service';
import { PacienteModel } from '../modals/paciente/paciente.model';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { EditarConsultaModal } from '../editar-consulta-modal/editar-consulta-modal';
import { VisualizarConsultaModal } from "../visualizar-consulta-modal/visualizar-consulta-modal";

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
    EditarConsultaModal,
    VisualizarConsultaModal
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
  visualizaConsulta: ConsultaModel = ConsultaModel.newConsultaModel();
  consultaOriginal: ConsultaModel | null = null;
  pacienteSelecionado: PacienteModel | null = null;

  // Opções para os selects
  statusOptions = Object.values(StatusConsulta);

    // Propriedades para os modais
  modalVisualizacaoAberto = false;
  modalEdicaoAberto = false;
  consultaSelecionada: ConsultaModel = {} as ConsultaModel;

  // Opções para os selects

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

  visualizarConsulta(item: ConsultaView): void {
    this.consultaSelecionada = item.consulta;
    this.pacienteSelecionado = this.pacienteService.buscarPacientePorId(item.consulta.pacienteId!) || null;
    this.modalVisualizacaoAberto = true;
  }

  abrirModalEdicao(item: ConsultaView): void {
    this.consultaOriginal = item.consulta;
    
    // Buscar informações completas do paciente
    this.pacienteSelecionado = this.pacienteService.buscarPacientePorId(item.consulta.pacienteId!) || null;
    
    // Criar uma cópia para edição
    this.visualizaConsulta = {...item.consulta};
    
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.consultaOriginal = null;
    this.pacienteSelecionado = null;
    this.consultaEditada = ConsultaModel.newConsultaModel();
  }

  salvarEdicao(consultaAtualizada: ConsultaModel): void {
    if (this.consultaOriginal) {
      // Atualizar apenas os campos editáveis
      this.consultaOriginal.status = consultaAtualizada.status;
      this.consultaOriginal.dataAgendamento = consultaAtualizada.dataAgendamento;
      this.consultaOriginal.observacao = consultaAtualizada.observacao;
      
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

  abrirModalEdicaoFromVisualizacao(consulta: ConsultaModel): void {
    this.fecharModalVisualizacao();
    
    // Encontrar o item completo para abrir o modal de edição
    const consultaView = this.consultasVM.find(vm => vm.consulta.id === consulta.id);
    if (consultaView) {
      this.abrirModalEdicao(consultaView);
    }
  }

  fecharModalVisualizacao(): void {
    this.modalVisualizacaoAberto = false;
    this.consultaSelecionada = {} as ConsultaModel;
    this.pacienteSelecionado = null;
  }


  onSubmitConsulta(form: NgForm) {
    if (form.valid) {
      const novaConsulta = ConsultaModel.newConsultaModel();
      novaConsulta.pacienteId = this.consulta.pacienteId;
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
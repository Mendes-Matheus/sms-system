import { Component, OnInit } from '@angular/core';
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

  // Opções para os selects
  statusOptions = Object.values(StatusConsulta);
  tipoOptions = Object.values(TipoConsulta);
  estabelecimentoOptions = Object.values(Estabelecimento);

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

  abrirModalEdicao(consulta: ConsultaModel): void {
    this.consultaOriginal = consulta;
    // Criar uma cópia para edição
    this.consultaEditada = {...consulta};
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.consultaOriginal = null;
    this.consultaEditada = ConsultaModel.newConsultaModel();
  }

  salvarEdicao(): void {
    if (this.consultaOriginal) {
      // Atualizar a consulta original com os valores editados
      this.consultaOriginal.status = this.consultaEditada.status;
      this.consultaOriginal.tipoConsulta = this.consultaEditada.tipoConsulta;
      this.consultaOriginal.estabelecimento = this.consultaEditada.estabelecimento;
      
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
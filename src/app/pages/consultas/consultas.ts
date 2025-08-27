import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConsultaModel, Estabelecimento, TipoConsulta, StatusConsulta } from '../../core/models/consulta.model';
import { ConsultaService } from '../../core/services/consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { PacienteService } from '../../core/services/paciente.service';
import { PacienteModel } from '../../core/models/paciente.model';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { EditarConsultaModal } from './modals/editar-consulta-modal/editar-consulta-modal';
import { VisualizarConsultaModal } from "./modals/visualizar-consulta-modal/visualizar-consulta-modal";
import { FiltrosConsulta } from '../../core/interfaces/filtros-consulta';
import { OrdenacaoConfig } from '../../core/interfaces/ordenacao-config';
import { FilterUtils } from '../../core/utils/filter-utils';

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
    FormsModule,
    EditarConsultaModal,
    VisualizarConsultaModal
],
  templateUrl: './consultas.html',
  styleUrl: './consultas.scss',
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  ordenacao: OrdenacaoConfig = {
    campo: '',
    direcao: 'asc'
  };
  
  // Propriedades para filtros
  filtros: FiltrosConsulta = {
    especialidade: '',
    dataSolicitacao: '',
    dataAtendimento: '',
    dataConsulta: '',
    dataAgendamento: '',
    status: '',
    estabelecimento: ''
  };

  // enums para uso no template
  tiposConsulta: string[] = [];
  statusConsulta: string[] = [];
  estabelecimentos: string[] = [];

  // Propriedade para busca
  termoBusca: string = '';
  
  // Cópia dos dados originais para manipulação
  consultasOriginais: ConsultaView[] = [];
  consultasFiltradas: ConsultaView[] = [];

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
    this.carregarValoresEnum();
  }

  carregarValoresEnum(): void {
    this.tiposConsulta = Object.values(TipoConsulta);
    this.statusConsulta = Object.values(StatusConsulta);
    this.estabelecimentos = Object.values(Estabelecimento);
  }

  carregarConsultas(): void {
    const todas = this.consultaService.buscarTodasConsultas();
    this.consultasOriginais = todas.map(c => {
      const p: PacienteModel | undefined = this.pacienteService.buscarPacientePorId(c.pacienteId!);
      return {
        consulta: c,
        nome: p?.nome ?? '–––',
        cpf: p?.cpf,
        cns: p?.cns
      };
    });
    
    this.consultasFiltradas = [...this.consultasOriginais];
    this.consultasVM = [...this.consultasFiltradas];
  }

  visualizarConsulta(item: ConsultaView): void {
    this.consultaSelecionada = item.consulta;
    this.pacienteSelecionado = this.pacienteService.buscarPacientePorId(item.consulta.pacienteId!) || null;
    this.modalVisualizacaoAberto = true;
  }

  /* ------------------------------------------------------------------ */
  /* ----------------------- ORDENACAO --------------------------------*/
  /* ------------------------------------------------------------------ */
  ordenarPor(campo: string): void {
    if (this.ordenacao.campo === campo) {
      this.ordenacao.direcao = this.ordenacao.direcao === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenacao.campo = campo;
      this.ordenacao.direcao = 'asc';
    }
    
    this.aplicarOrdenacao();
  }

  aplicarOrdenacao(): void {
    this.consultasFiltradas.sort((a, b) => {
      let valorA: any;
      let valorB: any;
      
      switch (this.ordenacao.campo) {
        case 'especialidade':
          valorA = a.consulta.tipoConsulta || '';
          valorB = b.consulta.tipoConsulta || '';
          break;
        case 'dataSolicitacao':
          valorA = a.consulta.dataSolicitacao ? new Date(a.consulta.dataSolicitacao) : new Date(0);
          valorB = b.consulta.dataSolicitacao ? new Date(b.consulta.dataSolicitacao) : new Date(0);
          break;
        case 'dataAtendimento':
          // Ajuste conforme seu modelo - se não existir, use dataAgendamento
          valorA = a.consulta.dataAgendamento ? new Date(a.consulta.dataAgendamento) : new Date(0);
          valorB = b.consulta.dataAgendamento ? new Date(b.consulta.dataAgendamento) : new Date(0);
          break;
        case 'dataConsulta':
          valorA = a.consulta.dataAgendamento ? new Date(a.consulta.dataAgendamento) : new Date(0);
          valorB = b.consulta.dataAgendamento ? new Date(b.consulta.dataAgendamento) : new Date(0);
          break;
        case 'dataAgendamento':
          valorA = a.consulta.dataAgendamento ? new Date(a.consulta.dataAgendamento) : new Date(0);
          valorB = b.consulta.dataAgendamento ? new Date(b.consulta.dataAgendamento) : new Date(0);
          break;
        case 'status':
          valorA = a.consulta.status || '';
          valorB = b.consulta.status || '';
          break;
        case 'estabelecimento':
          valorA = a.consulta.estabelecimento || '';
          valorB = b.consulta.estabelecimento || '';
          break;
        default:
          return 0;
      }
      
      // Comparação para ordenação
      if (valorA < valorB) {
        return this.ordenacao.direcao === 'asc' ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.ordenacao.direcao === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    this.consultasVM = [...this.consultasFiltradas];
  }

  /* ------------------------------------------------------------------ */
  /* -------------------- FILTROS ------------------------------*/
  /* ------------------------------------------------------------------ */

  aplicarFiltros(): void {
    this.consultasFiltradas = this.consultasOriginais.filter(consulta => 
      this.aplicarTodosFiltros(consulta)
    );
    
    this.aplicarBusca();
    this.aplicarOrdenacao();
  }

  private aplicarTodosFiltros(consulta: ConsultaView): boolean {
    return FilterUtils.filtrarPorCampo(consulta.consulta.tipoConsulta, this.filtros.especialidade) &&
          FilterUtils.filtrarPorData(consulta.consulta.dataSolicitacao, this.filtros.dataSolicitacao) &&
          FilterUtils.filtrarPorData(consulta.consulta.dataAgendamento, this.filtros.dataAtendimento) &&
          FilterUtils.filtrarPorData(consulta.consulta.dataAgendamento, this.filtros.dataConsulta) &&
          FilterUtils.filtrarPorData(consulta.consulta.dataAgendamento, this.filtros.dataAgendamento) &&
          FilterUtils.filtrarPorCampo(consulta.consulta.status, this.filtros.status) &&
          FilterUtils.filtrarPorCampo(consulta.consulta.estabelecimento, this.filtros.estabelecimento);
  }


  limparFiltros(): void {
    this.filtros = {
      especialidade: '',
      dataSolicitacao: '',
      dataAtendimento: '',
      dataConsulta: '',
      dataAgendamento: '',
      status: '',
      estabelecimento: ''
    };
    
    this.aplicarFiltros();
  }

  /* ------------------------------------------------------------------ */
  /* --------------------------- BUSCA ---------------------------------*/
  /* ------------------------------------------------------------------ */

  aplicarBusca(): void {
    if (!this.termoBusca) {
      this.consultasVM = [...this.consultasFiltradas];
      return;
    }
    
    const termo = this.termoBusca.toLowerCase();
    this.consultasVM = this.consultasFiltradas.filter(consulta => {
      return consulta.nome.toLowerCase().includes(termo) ||
            (consulta.cns || '').toLowerCase().includes(termo) ||
            (consulta.consulta.status || '').toLowerCase().includes(termo) ||
            (consulta.consulta.tipoConsulta || '').toLowerCase().includes(termo) ||
            (consulta.consulta.estabelecimento || '').toLowerCase().includes(termo);
    });
  }

  onBuscar(): void {
    this.aplicarBusca();
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

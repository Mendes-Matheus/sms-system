import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms'
import { RouterModule} from '@angular/router';
import {PacienteEdicaoModalComponent} from './modals/paciente-edicao-modal/paciente-edicao-modal';
import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';
import {PacienteModel} from '../../core/models/paciente.model';
import {PacienteService} from '../../core/services/paciente.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConsultaModel} from '../../core/models/consulta.model';
import {AssociarConsultaModal} from '../consultas/modals/associar-consulta-modal/associar-consulta-modal';
import {ConsultaService} from '../../core/services/consulta.service';

@Component({
  selector: 'app-pacientes',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe,
    PacienteEdicaoModalComponent
  ],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss'
})
export class Pacientes {

  // Propriedades de busca
  nomeBusca: string = '';
  cpfBusca: string = '';
  cnsBusca: string = '';
  pacienteEmEdicao: PacienteModel | null = null;

  paciente: PacienteModel = PacienteModel.newPacienteModel();
  listaPacientes: PacienteModel[] = [];
  colunasTable: string[] = ["nome", "cpf", "dataNascimento", "email", "acoes"];

  constructor(
    private service: PacienteService,
    private consultaService: ConsultaService,
    private modalService: NgbModal
  ){

  }

  ngOnInit(){
    this.listaPacientes = this.service.pesquisarPacientes(this.nomeBusca)
      .map(c => Object.assign(new PacienteModel(), c));
  }

  pesquisar(){
    this.listaPacientes = this.service.pesquisarPacientes(this.nomeBusca)

    // Exemplo de como poderia ser uma busca mais completa:
    // this.listaPacientes = this.service.pesquisarPacientesAvancada({
    //   nome: this.nomeBusca,
    //   cpf: this.cpfBusca,
    //   cns: this.cnsBusca
    // });
  }

  // preparaEditar(id: string){
  //   this.router.navigate(['/cadastro'], { queryParams: { "id": id } } )
  // }

  preparaEditar(id: string) {
    const paciente = this.service.buscarPacientePorId(id);
    if (paciente) {
      this.pacienteEmEdicao = Object.assign(new PacienteModel(), paciente);
    }
  }

  fecharModal() {
    this.pacienteEmEdicao = null;
  }

  salvarPaciente(pacienteAtualizado: PacienteModel) {
    this.service.atualizarPaciente(pacienteAtualizado);
    this.listaPacientes = this.service.pesquisarPacientes(this.nomeBusca);
    this.fecharModal();
  }

  preparaDeletar(paciente: PacienteModel) {
    // const dialogRef = this.dialog.open(ConfirmDialogComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.deletarPaciente(paciente);
    //   }
    // });
  }

  visualizar(id: string){
    // Implementar visualização detalhada do paciente
    // Pode ser um modal ou navegação para página de detalhes
    // this.router.navigate(['/paciente-detalhes', id]);

    // Ou abrir um modal:
    // const dialogRef = this.dialog.open(VisualizarPacienteComponent, {
    //   data: { pacienteId: id },
    //   width: '800px'
    // });
  }

  deletarPaciente(paciente: PacienteModel){
    this.service.deletarPaciente(paciente);
    this.listaPacientes = this.service.pesquisarPacientes('');
  }

  // abrirAssociarConsultaModal(paciente: PacienteModel) {
  //   const modalRef = this.modalService.open(ConsultaModel, { size: 'lg' });
  //   modalRef.componentInstance.paciente = paciente;
  // }

  abrirAssociarConsultaModal(paciente: PacienteModel) {
    const modalRef = this.modalService.open(AssociarConsultaModal, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Passa o paciente selecionado para o modal
    modalRef.componentInstance.paciente = paciente;

    // Escuta o evento de salvar emitido pelo modal
    modalRef.componentInstance.salvar.subscribe((novaConsulta: ConsultaModel) => {
      this.consultaService.salvarConsulta(novaConsulta);
      modalRef.close();
      alert('Consulta associada ao paciente com sucesso!');
    });

    // Fecha o modal sem salvar
    modalRef.componentInstance.fechar.subscribe(() => modalRef.dismiss());
  }

}

import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { ConsultaModel, Estabelecimento, TipoConsulta, StatusConsulta } from '../../../../core/models/consulta.model';
import { FormsModule, NgForm } from '@angular/forms';
import { PacienteModel } from '../../../../core/models/paciente.model';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-visualizar-consulta-modal',
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskPipe
  ],
  templateUrl: './visualizar-consulta-modal.html',
  styleUrl: './visualizar-consulta-modal.scss',
  providers: [provideNgxMask()]
})
export class VisualizarConsultaModal {

  @Input() consulta: ConsultaModel = {} as ConsultaModel;
  @Input() paciente: PacienteModel | null = null;

  @Output() fechar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<ConsultaModel>();

  // Expor enum para template
  StatusConsulta = StatusConsulta;

  fecharModal(): void {
    this.fechar.emit();
  }

  editarConsulta(): void {
    this.editar.emit(this.consulta);
  }


}

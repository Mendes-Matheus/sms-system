import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsultaModel, Estabelecimento, TipoConsulta, StatusConsulta } from '../../core/models/consulta.model';
import { FormsModule, NgForm } from '@angular/forms';
import { PacienteModel } from '../modals/paciente/paciente.model';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';



@Component({
  selector: 'app-editar-consulta-modal',
  imports: [
    CommonModule,
    NgxMaskPipe,
    FormsModule
  ],
  templateUrl: './editar-consulta-modal.html',
  styleUrl: './editar-consulta-modal.scss',
  providers: [provideNgxMask()]
})

export class EditarConsultaModal {

  @Input() consulta: ConsultaModel = {} as ConsultaModel;
  @Input() paciente: PacienteModel | null = null;
  @Input() statusOptions: string[] = [];
  
  @Output() salvar = new EventEmitter<ConsultaModel>();
  @Output() fechar = new EventEmitter<void>();

  mostrarCampoData = false;
  mostrarCampoObservacao = false;
  dataInvalida = false;
  dataMinima: Date = new Date();

  ngOnInit(): void {
    this.mostrarCampoData = this.consulta.status === StatusConsulta.AGENDADA || 
                           this.consulta.status === StatusConsulta.REAGENDADA;
    
    this.mostrarCampoObservacao = this.consulta.status === StatusConsulta.CANCELADA;
  }

  onStatusChange(): void {
    this.mostrarCampoData = this.consulta.status === StatusConsulta.AGENDADA || 
                           this.consulta.status === StatusConsulta.REAGENDADA;
    
    this.mostrarCampoObservacao = this.consulta.status === StatusConsulta.CANCELADA;
    
    if (!this.mostrarCampoData) {
      this.consulta.dataAgendamento = undefined;
    } else if (!this.consulta.dataAgendamento) {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      this.consulta.dataAgendamento = amanha;
    }
    
    if (!this.mostrarCampoObservacao) {
      this.consulta.observacao = '';
    }
  }

  validarDataAgendamento(): void {
    if (this.consulta.dataAgendamento) {
      const dataSelecionada = new Date(this.consulta.dataAgendamento);
      this.dataInvalida = dataSelecionada < this.dataMinima;
    } else {
      this.dataInvalida = false;
    }
  }

  formularioValido(): boolean {
    if (!this.consulta.status) {
      return false;
    }
    
    if ((this.consulta.status === StatusConsulta.AGENDADA || 
         this.consulta.status === StatusConsulta.REAGENDADA) &&
        !this.consulta.dataAgendamento) {
      return false;
    }
    
    if (this.consulta.status === StatusConsulta.CANCELADA && 
        (!this.consulta.observacao || this.consulta.observacao.trim() === '')) {
      return false;
    }
    
    return true;
  }

  fecharModal(): void {
    this.fechar.emit();
  }

  salvarEdicao(): void {
    this.validarDataAgendamento();
    
    if (this.dataInvalida) {
      return;
    }
    
    if (this.formularioValido()) {
      this.salvar.emit(this.consulta);
    }
  }

}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { trigger, transition, style, animate } from '@angular/animations';
import { PacienteModel } from '../paciente/paciente.model';
import { ConsultaModel, StatusConsulta, TipoConsulta, Estabelecimento } from '../../consultas/consulta.model';

@Component({
  selector: 'app-modal-consulta',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-consulta.html',
  styleUrls: ['./modal-consulta.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ModalConsulta {
  @Input() paciente!: PacienteModel;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<ConsultaModel>();

  consulta: ConsultaModel = ConsultaModel.newConsultaModel();

  tipoConsulta: TipoConsulta[] = [
    TipoConsulta.NEUROCIRURGIAO,
    TipoConsulta.ORTOPEDISTA,
    TipoConsulta.CLINICO_GERAL,
    TipoConsulta.PEDIATRA,
    TipoConsulta.GINECOLOGISTA,
    TipoConsulta.OFTALMOLOGISTA,
    TipoConsulta.OTORRINOLARINGOLOGISTA,
    TipoConsulta.UROLOGISTA,
    TipoConsulta.CARDIOLOGISTA
  ];


  tipoConsultaOptions = Object.values(TipoConsulta).filter(value => typeof value === 'string');
  estabelecimentoOptions = Object.values(Estabelecimento).filter(value => typeof value === 'string');

  ngOnInit() {
    this.consulta.pacienteId = this.paciente.id;
    this.consulta.status = StatusConsulta.PENDENTE;
    this.consulta.dataSolicitacao = new Date();
  }

  salvarConsulta(form: NgForm) {
    if (form.valid) {
      this.salvar.emit(this.consulta);
    }
  }
}

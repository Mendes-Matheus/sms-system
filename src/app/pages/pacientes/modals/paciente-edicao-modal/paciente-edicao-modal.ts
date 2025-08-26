import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { PacienteModel } from '../../../../core/models/paciente.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-paciente-edicao-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './paciente-edicao-modal.html',
  styleUrls: ['./paciente-edicao-modal.scss'],
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
export class PacienteEdicaoModalComponent {
  @Input() paciente: PacienteModel = PacienteModel.newPacienteModel();
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<PacienteModel>();

  atualizando = false;

  salvarPaciente() {
    this.salvar.emit(this.paciente);
  }

  limpar() {
    // Implemente a lógica de limpar se necessário
  }
}

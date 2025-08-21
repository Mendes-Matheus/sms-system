import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'
import { Router } from '@angular/router';



import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { RouterModule } from '@angular/router';
import { PacienteModel } from './paciente.model';

@Component({
  selector: 'app-paciente',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
    // NgxMaskPipe,
  ],
  templateUrl: './paciente.html',
  styleUrl: './paciente.scss'
})

export class Paciente implements OnInit {

  paciente: PacienteModel = PacienteModel.newPacienteModel();
  PacienteModel: any;

  constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Salva o formulário
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Paciente salvo:', this.paciente);
      // aqui você pode chamar um service para enviar ao backend
      // ex: this.pacienteService.salvar(this.paciente).subscribe(...)
      alert('Paciente salvo com sucesso!');
    } else {
      console.warn('Formulário inválido!');
    }
  }

  // Reseta para um novo paciente
  onCancelar() {
    if (confirm('Deseja cancelar e limpar os dados?')) {
      this.paciente = PacienteModel.newPacienteModel();
    }
  }

}

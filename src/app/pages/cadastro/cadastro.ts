import { Component, ChangeDetectionStrategy, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Paciente } from '../modals/paciente/paciente';
import { PacienteService } from '../../core/services/paciente.service';
import { PacienteModel } from '../modals/paciente/paciente.model';
import { NgbDate, NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxMaskDirective,
    NgbDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule
  ],
  providers: [
    provideNgxMask(),
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cadastro implements OnInit {

  @ViewChild('pacientesFrm') pacientesForm!: NgForm;

  paciente: PacienteModel = PacienteModel.newPacienteModel();
  atualizando: boolean = false;
  mostrarModal = false;
  maxDate: Date = new Date();
  minDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 100));

  abrirModal() {
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  constructor(
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParamMap) => {
      const id = queryParamMap.get('id');
      if (id) {
        let pacienteEncontrado = this.pacienteService.buscarPacientePorId(id);
        if (pacienteEncontrado) {
          this.atualizando = true;
          this.paciente = pacienteEncontrado;
        }
      }
    })
  }

  salvar(){
    if(!this.atualizando){
      this.pacienteService.salvarPaciente(this.paciente);
      this.paciente = PacienteModel.newPacienteModel();
    } else {
      this.pacienteService.atualizarPaciente(this.paciente);
      this.router.navigate(['/consulta'])
    }
  }

  limpar() {
    this.pacientesForm.resetForm();
    this.paciente = PacienteModel.newPacienteModel();
    this.atualizando = false;
  }

  onDateSelect(date: NgbDate | null) {
    if (date) {
      // Converter NgbDate para Date JavaScript
      const jsDate = new Date(date.year, date.month - 1, date.day);
      console.log('Data selecionada:', jsDate);

      // Atualizar o modelo do paciente
      this.paciente.dataNascimento = jsDate; // atribui diretamente o objeto Date
    }
  }

  // Método para definir data máxima (hoje)
  // get maxDate(): NgbDateStruct {
  //   const today = this.calendar.getToday();
  //   return today;
  // }

  // // Método para definir data mínima (100 anos atrás)
  // get minDate(): NgbDateStruct {
  //   const today = this.calendar.getToday();
  //   return {
  //     year: today.year - 100,
  //     month: 1,
  //     day: 1
  //   };
  // }

  // Método para definir data inicial (opcional)
  get startDate(): NgbDateStruct {
    const today = this.calendar.getToday();
    return {
      year: today.year - 30, // 30 anos atrás como padrão
      month: today.month,
      day: today.day
    };
  }
}

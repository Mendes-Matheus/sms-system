import { Injectable } from '@angular/core';
import { ConsultaService } from './consulta.service';
import { PacienteService } from './paciente.service';
import { ConsultaModel } from '../models/consulta.model';
import { PacienteModel } from '../models/paciente.model';
import { ConsultaView } from '../interfaces/consulta-view';

@Injectable({
  providedIn: 'root'
})

export class ConsultaDataService {
  constructor(
    private consultaService: ConsultaService,
    private pacienteService: PacienteService
  ) {}

  carregarConsultasComPacientes(): ConsultaView[] {
    return this.consultaService.buscarTodasConsultas().map(c => {
      const paciente = this.pacienteService.buscarPacientePorId(c.pacienteId!);
      return this.criarConsultaView(c, paciente);
    });
  }

  private criarConsultaView(consulta: ConsultaModel, paciente?: PacienteModel): ConsultaView {
    return {
      consulta,
      nome: paciente?.nome ?? '–––',
      cpf: paciente?.cpf,
      cns: paciente?.cns
    };
  }
}

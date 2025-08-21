import { Injectable } from '@angular/core';
import { ConsultaModel } from '../../pages/consultas/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  static REPO_CONSULTAS = "_CONSULTAS";

  salvarConsulta(consulta: ConsultaModel): void {
    const storage = this.obterStorage();
    storage.push(consulta);
    localStorage.setItem(ConsultaService.REPO_CONSULTAS, JSON.stringify(storage));
  }

  atualizarConsulta(consulta: ConsultaModel): void {
    const storage = this.obterStorage();
    const index = storage.findIndex(c => c.id === consulta.id);
    if (index !== -1) {
      storage[index] = consulta;
      localStorage.setItem(ConsultaService.REPO_CONSULTAS, JSON.stringify(storage));
    }
  }

  buscarConsultasPorPaciente(pacienteId: string): ConsultaModel[] {
    const consultas = this.obterStorage();
    return consultas.filter(c => c.pacienteId === pacienteId);
  }

  excluirConsulta(id: string): void {
    const storage = this.obterStorage().filter(c => c.id !== id);
    localStorage.setItem(ConsultaService.REPO_CONSULTAS, JSON.stringify(storage));
  }

  private obterStorage(): ConsultaModel[] {
    const repo = localStorage.getItem(ConsultaService.REPO_CONSULTAS);
    return repo ? JSON.parse(repo) : [];
  }

  buscarTodasConsultas(): ConsultaModel[] {
    return this.obterStorage();
  }

}


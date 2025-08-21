import { Injectable } from '@angular/core';
import { PacienteModel } from '../../pages/modals/paciente/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  static REPO_PACIENTES = "_PACIENTES";
  pacientes: PacienteModel = PacienteModel.newPacienteModel();


  salvarPaciente(paciente: PacienteModel): void {
    const storage = this.obterStorage();
    storage.push(paciente);
    localStorage.setItem(PacienteService.REPO_PACIENTES, JSON.stringify(storage));
  }

  atualizarPaciente(paciente: PacienteModel){
    const storage = this.obterStorage();
    storage.forEach(c => {
      if(c.id === paciente.id){
        Object.assign(c, paciente);
      }
    })
    localStorage.setItem(PacienteService.REPO_PACIENTES, JSON.stringify(storage));
  }

  // buscarPacientePorId(id: string) {
  //   throw new Error('Method not implemented.');
  // }

  buscarPacientePorId(id: string) : PacienteModel | undefined {
    const pacientes = this.obterStorage();
    return pacientes.find(paciente => paciente.id === id)
  }

  pesquisarPacientes(nomeBusca: string): PacienteModel[] {
    const pacientes = this.obterStorage();

    if (!nomeBusca) {
      return pacientes;
    }

    // Função para normalizar: minúsculas + sem acento
    const normalizar = (texto: string) =>
      texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const termo = normalizar(nomeBusca);

    return pacientes.filter(paciente =>
      paciente.nome ? normalizar(paciente.nome).includes(termo) : false
    );
  }


  deletarPaciente(paciente: PacienteModel) {
    const storage = this.obterStorage();

    const novaLista = storage.filter(c => c.id !== paciente.id);

    localStorage.setItem(PacienteService.REPO_PACIENTES, JSON.stringify(novaLista));
  }


  private obterStorage() : PacienteModel[] {
    const repositorioPacientes = localStorage.getItem(PacienteService.REPO_PACIENTES);
    if (repositorioPacientes) {
      const pacientes: PacienteModel[] = JSON.parse(repositorioPacientes);
      return pacientes;
    }

    const pacientes: PacienteModel[] = [];
    localStorage.setItem(PacienteService.REPO_PACIENTES, JSON.stringify(pacientes));
    return pacientes;
  }


}

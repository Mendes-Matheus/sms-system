import { Routes } from '@angular/router';
import { Cadastro } from './pages/cadastro/cadastro';
import { ListaPacientes } from './pages/lista-pacientes/lista-pacientes';
import { Consultas } from './pages/consultas/consultas';

export const routes: Routes = [
    { path: 'cadastro', component: Cadastro },
    { path: 'pacientes', component: ListaPacientes },
    { path: 'consultas', component: Consultas }
];

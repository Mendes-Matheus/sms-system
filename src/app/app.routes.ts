import { Routes } from '@angular/router';
import { Cadastro } from './pages/cadastro/cadastro';
import { Pacientes } from './pages/pacientes/pacientes';
import { Consultas } from './pages/consultas/consultas';

export const routes: Routes = [
    { path: 'cadastro', component: Cadastro },
    { path: 'pacientes', component: Pacientes },
    { path: 'consultas', component: Consultas }
];

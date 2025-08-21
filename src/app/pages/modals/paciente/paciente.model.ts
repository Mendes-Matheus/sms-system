import { v4 as uuid } from 'uuid'
import { Consultas } from '../../consultas/consultas';


export class PacienteModel {
    id?: string;
    nome?: string;
    cpf?: string;
    rg?: string;
    cns?: string;
    celular1?: string;
    celular2?: string;
    sexo?: string;
    endereco?: string;
    numero?: string;
    bairro?: string;
    dataCadastro?: Date;
    dataUltimaConsulta?: Date;
    observacao?: string;
    dataNascimento?: Date;
    email?: string;
    consultas?: Consultas[];
    ativo?: boolean = true
    deletando: boolean = false;

    static newPacienteModel(){
        const paciente = new PacienteModel();
        paciente.id = uuid();
        return paciente;
    }
}

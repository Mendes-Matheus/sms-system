import { v4 as uuid } from 'uuid'

enum TipoConsulta {
    NEUROCIRURGIAO = 'Neurocirurgião',
    ORTOPEDISTA = 'Ortopedista',
    CLINICO_GERAL = 'Clínico Geral',
    PEDIATRA = 'Pediatra',
    GINECOLOGISTA = 'Ginecologista',
    OFTALMOLOGISTA = 'Oftalmologista',
    OTORRINOLARINGOLOGISTA = 'Otorrrinolaringologista',
    UROLOGISTA = 'Urologista',
    CARDIOLOGISTA = 'Cardiologista'
}

enum StatusConsulta {
    PENDENTE = 'Pendente',
    AGENDADA = 'Agendada',
    CONFIRMADA = 'Confirmada',
    CANCELADA = 'Cancelada',
    REALIZADA = 'Realizada',
    NAO_COMPARECEU = 'Não Compareceu',
    REAGENDADA = 'Reagendada'
}

enum Estabelecimento {
    POLICLINICA = 'Policlínica',
    SARAH = 'Hospital Sarah',
    REDE_MUNICIPAL = 'Rede Municipal'
}

export class ConsultaModel {
    id?: string;
    pacienteId?: string;
    tipoConsulta?: TipoConsulta;
    status?: StatusConsulta;
    dataSolicitacao?: Date;
    dataAgendamento?: Date;
    estabelecimento?: Estabelecimento;
    observacao?: string;
    motivo?: string;
    ativo?: boolean = true
    deletando: boolean = false;

    static newConsultaModel(){
        const consulta = new ConsultaModel();
        consulta.id = uuid();
        return consulta;
    }
}

export { TipoConsulta, StatusConsulta, Estabelecimento };
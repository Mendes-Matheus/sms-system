import { ConsultaModel } from "../models/consulta.model";

export interface ConsultaView {
    nome: string;
    cpf?: string;
    cns?: string;
    consulta: ConsultaModel;
}
export type pacientes = {
    id: number;
    nomeClinica: string;
    nomeDoutor: string;
    nomePaciente: string;
    sexo: string;
    hora: string;
    email: string;
    dataInicio: string;
    dataFinal: string;
    previsaoDias: number;
    instrucoes: string;
    status: string;
}

// E então declare o array com a tipagem:
export type registro = {
    id: number;
    pacientes_id: number;
    tipo: string;
    data: string;
    hora: string;
    descricao: string;
    foto: string;
    pacientes_nome: string;
}

export type faturamentos = {
    mesReferente: string;
    anoReferente: string;
    total: string
}
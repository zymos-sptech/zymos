
// ======================================================
// MOCK DATA - ZYMOS MVP V4
// Estrutura alinhada ao banco de dados V4
// ======================================================

const DATA_REFERENCIA = "2026-09-28T15:00:00";


// ======================================================
// 1. TABELAS DE DOMINIO
// ======================================================

const planosData = [
    { id: 1, nome: "Basico", tanques_min: 1, tanques_max: 9 },
    { id: 2, nome: "Padrao", tanques_min: 10, tanques_max: 49 },
    { id: 3, nome: "Industrial", tanques_min: 50, tanques_max: null }
];

const cargosData = [
    { id: 1, nome: "Administrador", permisionamento: 1 },
    { id: 2, nome: "Mestre Cervejeiro", permisionamento: 2 },
    { id: 3, nome: "Operador", permisionamento: 3 },
    { id: 4, nome: "Qualidade", permisionamento: 4 }
];

const tiposCervejaData = [
    { id: 1, tipo: "Ale" },
    { id: 2, tipo: "Lager" }
];

const levedurasData = [
    { id: 1, nome: "Saccharomyces cerevisiae" },
    { id: 2, nome: "Saccharomyces pastorianus" },
    { id: 3, nome: "Saccharomyces carlsbergensis" }
];

const statusTanqueData = [
    { id: 1, nome: "Disponivel" },
    { id: 2, nome: "Em uso" },
    { id: 3, nome: "Em limpeza" },
    { id: 4, nome: "Manutencao" },
    { id: 5, nome: "Indisponivel" }
];

const statusLoteData = [
    { id: 1, nome: "Em andamento" },
    { id: 2, nome: "Finalizado" },
    { id: 3, nome: "Cancelado" }
];

const statusUnidadeData = [
    { id: 1, nome: "Solicitada / Em Analise" },
    { id: 2, nome: "Aguardando Setup Hardware" },
    { id: 3, nome: "Ativa" },
    { id: 4, nome: "Inativa" }
];

const statusSensorData = [
    { id: 1, nome: "Ativo" },
    { id: 2, nome: "Inativo" },
    { id: 3, nome: "Manutencao" }
];

const statusContatoData = [
    { id: 1, nome: "Recebido" },
    { id: 2, nome: "Em atendimento" },
    { id: 3, nome: "Concluido" }
];

const tiposAlertaData = [
    { id: 1, nome: "Temperatura abaixo do limite" },
    { id: 2, nome: "Temperatura acima do limite" }
];

const statusChamadoData = [
    { id: 1, nome: "Aberto" },
    { id: 2, nome: "Em atendimento" },
    { id: 3, nome: "Resolvido" },
    { id: 4, nome: "Fechado" }
];


// ======================================================
// 2. EMPRESA
// ======================================================

const empresaData = {
    id: 1,
    fk_plano: 2,
    statuss: 1,
    nome: "Cervejaria Horizonte",
    cnpj: "12345678000190",
    dt_inicio_contrato: "2026-01-10"
};


// ======================================================
// 3. CODIGOS DE ATIVACAO
// ======================================================

const codigosAtivacaoData = [
    {
        id: 1,
        fk_empresa: 1,
        statuss: 1,
        codigo: "ZYMOS-HORIZ-2026",
        dt_geracao: "2026-01-10T10:00:00",
        dt_expiracao: "2026-12-31T23:59:59"
    }
];


// ======================================================
// 4. USUARIOS
// ======================================================

const usuariosData = [
    {
        id: 1,
        fk_empresa: 1,
        fk_cargo: 1,
        statuss: 1,
        nome: "Carlos Silva",
        email: "carlos.silva@cervejariahorizonte.com"
    }
];


// ======================================================
// 5. CONTATOS INSTITUCIONAIS
// ======================================================

const contatosData = [
    {
        id: 1,
        fk_status_contato: 1,
        qtdtanques: 10,
        nome: "Joao Mendes",
        email: "joao@email.com",
        mensagem: "Tenho interesse na plataforma Zymos.",
        dt_contato: "2026-09-20T10:00:00"
    }
];


// ======================================================
// 6. UNIDADES
// ======================================================

const unidadesData = [
    {
        id: 1,
        fk_empresa: 1,
        fk_usuario_criador: 1,
        fk_status_unidade: 3,
        quantidade_tanques: 4,
        cnpj: "12345678000270",
        nome: "Matriz Ribeirao Preto",
        logradouro: "Avenida das Cervejarias",
        numero: "1000",
        complemento: null,
        bairro: "Centro",
        cidade: "Ribeirao Preto",
        uf: "SP",
        cep: "14000000"
    },
    {
        id: 2,
        fk_empresa: 1,
        fk_usuario_criador: 1,
        fk_status_unidade: 3,
        quantidade_tanques: 6,
        cnpj: "12345678000350",
        nome: "Unidade Campinas",
        logradouro: "Avenida Industrial",
        numero: "500",
        complemento: null,
        bairro: "Distrito Industrial",
        cidade: "Campinas",
        uf: "SP",
        cep: "13000000"
    }
];


// ======================================================
// 7. CERVEJAS
// ======================================================

const cervejasData = [
    {
        id: 1,
        fk_tipo_cerveja: 1,
        fk_levedura: 1,
        fk_usuario_criador: 1,
        nome: "IPA",
        temperatura_min: 15.0,
        temperatura_max: 24.0,
        tempo_fermentacao_dias: 14
    },
    {
        id: 2,
        fk_tipo_cerveja: 1,
        fk_levedura: 1,
        fk_usuario_criador: 1,
        nome: "Red Ale",
        temperatura_min: 15.0,
        temperatura_max: 24.0,
        tempo_fermentacao_dias: 14
    },
    {
        id: 3,
        fk_tipo_cerveja: 2,
        fk_levedura: 2,
        fk_usuario_criador: 1,
        nome: "Pilsen",
        temperatura_min: 8.0,
        temperatura_max: 14.0,
        tempo_fermentacao_dias: 21
    }
];


// ======================================================
// 8. TANQUES
// ======================================================

const tanquesData = [

    // MATRIZ RIBEIRAO PRETO

    {
        id: 1,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-01",
        capacidade: 10000
    },
    {
        id: 2,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-02",
        capacidade: 10000
    },
    {
        id: 3,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-03",
        capacidade: 10000
    },
    {
        id: 4,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-04",
        capacidade: 10000
    },

    // UNIDADE CAMPINAS

    {
        id: 5,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-05",
        capacidade: 10000
    },
    {
        id: 6,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-06",
        capacidade: 10000
    },
    {
        id: 7,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-07",
        capacidade: 10000
    },
    {
        id: 8,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_tanque: 2,
        nome: "TQ-08",
        capacidade: 10000
    },
    {
        id: 9,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_tanque: 1,
        nome: "TQ-09",
        capacidade: 10000
    },
    {
        id: 10,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_tanque: 1,
        nome: "TQ-10",
        capacidade: 10000
    }
];


// ======================================================
// 9. SENSORES
// Sensor pertence a unidade, nao diretamente ao tanque.
// ======================================================

const sensoresData = [];

for (let i = 0; i < unidadesData.length; i++) {

    let quantidadeSensores = unidadesData[i].quantidade_tanques;

    for (let j = 0; j < quantidadeSensores; j++) {

        sensoresData.push({
            id: sensoresData.length + 1,
            fk_unidade: unidadesData[i].id,
            fk_status_sensor: 1,
            modelo: "LM35"
        });

    }
}


// ======================================================
// 10. LOTES
// ======================================================

const lotesData = [

    // MATRIZ RIBEIRAO PRETO

    {
        id: 100,
        codigo: "101-A",
        volume_litros: 8000,
        fk_cerveja: 1,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-23T08:00:00",
        dt_fim: null
    },
    {
        id: 101,
        codigo: "096",
        volume_litros: 7000,
        fk_cerveja: 2,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-23T08:00:00",
        dt_fim: null
    },
    {
        id: 102,
        codigo: "095",
        volume_litros: 6000,
        fk_cerveja: 3,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-25T08:00:00",
        dt_fim: null
    },
    {
        id: 103,
        codigo: "087",
        volume_litros: 7500,
        fk_cerveja: 1,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 2,
        dt_inicio: "2026-09-01T08:00:00",
        dt_fim: "2026-09-15T08:00:00"
    },

    // UNIDADE CAMPINAS

    {
        id: 104,
        codigo: "102",
        volume_litros: 9000,
        fk_cerveja: 3,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-20T08:00:00",
        dt_fim: null
    },
    {
        id: 105,
        codigo: "103",
        volume_litros: 8500,
        fk_cerveja: 1,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-22T08:00:00",
        dt_fim: null
    },
    {
        id: 106,
        codigo: "104",
        volume_litros: 6500,
        fk_cerveja: 2,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-24T08:00:00",
        dt_fim: null
    },
    {
        id: 107,
        codigo: "105",
        volume_litros: 7500,
        fk_cerveja: 3,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-26T08:00:00",
        dt_fim: null
    },
    {
        id: 108,
        codigo: "089",
        volume_litros: 7000,
        fk_cerveja: 1,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 2,
        dt_inicio: "2026-09-01T08:00:00",
        dt_fim: "2026-09-15T08:00:00"
    },
    {
        id: 109,
        codigo: "090",
        volume_litros: 5000,
        fk_cerveja: 2,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 2,
        dt_inicio: "2026-08-25T08:00:00",
        dt_fim: "2026-09-08T08:00:00"
    }
];


// ======================================================
// 11. PRODUCOES
// PK composta: fk_lote + fk_tanque
// O sensor e associado durante a producao.
// ======================================================

const producoesData = [

    // MATRIZ RIBEIRAO PRETO

    {
        fk_lote: 100,
        fk_tanque: 1,
        fk_sensor: 1,
        dt_entrada: "2026-09-23T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 101,
        fk_tanque: 2,
        fk_sensor: 2,
        dt_entrada: "2026-09-23T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 102,
        fk_tanque: 3,
        fk_sensor: 3,
        dt_entrada: "2026-09-25T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 103,
        fk_tanque: 4,
        fk_sensor: 4,
        dt_entrada: "2026-09-01T08:00:00",
        dt_saida: "2026-09-15T08:00:00"
    },

    // UNIDADE CAMPINAS

    {
        fk_lote: 104,
        fk_tanque: 5,
        fk_sensor: 5,
        dt_entrada: "2026-09-20T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 105,
        fk_tanque: 6,
        fk_sensor: 6,
        dt_entrada: "2026-09-22T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 106,
        fk_tanque: 7,
        fk_sensor: 7,
        dt_entrada: "2026-09-24T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 107,
        fk_tanque: 8,
        fk_sensor: 8,
        dt_entrada: "2026-09-26T08:00:00",
        dt_saida: null
    },
    {
        fk_lote: 108,
        fk_tanque: 9,
        fk_sensor: 9,
        dt_entrada: "2026-09-01T08:00:00",
        dt_saida: "2026-09-15T08:00:00"
    },
    {
        fk_lote: 109,
        fk_tanque: 10,
        fk_sensor: 10,
        dt_entrada: "2026-08-25T08:00:00",
        dt_saida: "2026-09-08T08:00:00"
    }
];


// ======================================================
// 12. LEITURAS DOS SENSORES
// Agora referenciam a producao por fk_lote + fk_tanque.
// Nao possuem mais fk_sensor.
// ======================================================

const leiturasSensoresData = [

    // TQ-01
    { id: 1, fk_lote: 100, fk_tanque: 1, temperatura: 25.2, dt_medicao: "2026-09-28T14:32:10" },
    { id: 2, fk_lote: 100, fk_tanque: 1, temperatura: 25.2, dt_medicao: "2026-09-28T15:00:00" },

    // TQ-02
    { id: 3, fk_lote: 101, fk_tanque: 2, temperatura: 25.0, dt_medicao: "2026-09-27T10:15:00" },
    { id: 4, fk_lote: 101, fk_tanque: 2, temperatura: 22.8, dt_medicao: "2026-09-28T15:00:00" },

    // TQ-03
    { id: 5, fk_lote: 102, fk_tanque: 3, temperatura: 7.0, dt_medicao: "2026-09-26T16:00:00" },
    { id: 6, fk_lote: 102, fk_tanque: 3, temperatura: 6.8, dt_medicao: "2026-09-28T15:00:00" },

    // TQ-04
    { id: 7, fk_lote: 103, fk_tanque: 4, temperatura: 20.1, dt_medicao: "2026-09-14T14:30:00" },
    { id: 8, fk_lote: 103, fk_tanque: 4, temperatura: 20.4, dt_medicao: "2026-09-14T15:00:00" },

    // TQ-05
    { id: 9, fk_lote: 104, fk_tanque: 5, temperatura: 14.5, dt_medicao: "2026-09-28T14:30:00" },
    { id: 10, fk_lote: 104, fk_tanque: 5, temperatura: 15.4, dt_medicao: "2026-09-28T15:00:00" },

    // TQ-06
    { id: 11, fk_lote: 105, fk_tanque: 6, temperatura: 23.5, dt_medicao: "2026-09-28T14:30:00" },
    { id: 12, fk_lote: 105, fk_tanque: 6, temperatura: 24.8, dt_medicao: "2026-09-28T15:00:00" },
    { id: 13, fk_lote: 105, fk_tanque: 6, temperatura: 24.8, dt_medicao: "2026-09-28T14:45:00" },

    // TQ-07
    { id: 14, fk_lote: 106, fk_tanque: 7, temperatura: 21.5, dt_medicao: "2026-09-28T14:30:00" },
    { id: 15, fk_lote: 106, fk_tanque: 7, temperatura: 13.5, dt_medicao: "2026-09-28T15:00:00" },

    // TQ-08
    { id: 16, fk_lote: 107, fk_tanque: 8, temperatura: 15.2, dt_medicao: "2026-09-28T09:10:00" },
    { id: 17, fk_lote: 107, fk_tanque: 8, temperatura: 7.5, dt_medicao: "2026-09-28T15:00:00" },

    // TQ-09
    { id: 18, fk_lote: 108, fk_tanque: 9, temperatura: 10.5, dt_medicao: "2026-09-14T14:30:00" },

    // TQ-10
    { id: 19, fk_lote: 109, fk_tanque: 10, temperatura: 19.5, dt_medicao: "2026-09-07T14:30:00" }
];


// ======================================================
// 13. ALERTAS
// O status e derivado de dt_resolucao.
// O tipo e identificado por fk_tipo_alerta.
// ======================================================

const alertasData = [

    {
        id: 1,
        fk_leitura: 1,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-28T14:32:10",
        dt_resolucao: null
    },
    {
        id: 2,
        fk_leitura: 3,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-27T10:15:00",
        dt_resolucao: "2026-09-27T10:42:00"
    },
    {
        id: 3,
        fk_leitura: 5,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (8.0 graus C)",
        dt_alerta: "2026-09-26T16:00:00",
        dt_resolucao: "2026-09-26T16:30:00"
    },
    {
        id: 4,
        fk_leitura: 13,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-28T14:45:00",
        dt_resolucao: null
    },
    {
        id: 5,
        fk_leitura: 16,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (14.0 graus C)",
        dt_alerta: "2026-09-28T09:10:00",
        dt_resolucao: "2026-09-28T09:35:00"
    },
    {
        id: 6,
        fk_leitura: 6,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (8.0 graus C)",
        dt_alerta: "2026-09-28T15:00:00",
        dt_resolucao: null
    },
    {
        id: 7,
        fk_leitura: 10,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (14.0 graus C)",
        dt_alerta: "2026-09-28T15:00:00",
        dt_resolucao: null
    },
    {
        id: 8,
        fk_leitura: 15,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (15.0 graus C)",
        dt_alerta: "2026-09-28T15:00:00",
        dt_resolucao: null
    },
    {
        id: 9,
        fk_leitura: 17,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (8.0 graus C)",
        dt_alerta: "2026-09-28T15:00:00",
        dt_resolucao: null
    }
];


// ======================================================
// 14. CHAMADOS DE SUPORTE
// ======================================================

const chamadosData = [
    {
        id: 1,
        fk_usuario: 1,
        fk_status_chamado: 1,
        assunto: "Duvida sobre monitoramento",
        descricao: "Gostaria de entender melhor o funcionamento dos alertas.",
        dt_abertura: "2026-09-27T10:00:00",
        dt_atualizacao: "2026-09-27T10:00:00"
    }
];


// ======================================================
// EXPORTACAO
// ======================================================

export {
    DATA_REFERENCIA,

    planosData,
    cargosData,
    tiposCervejaData,
    levedurasData,
    statusTanqueData,
    statusLoteData,
    statusUnidadeData,
    statusSensorData,
    statusContatoData,
    tiposAlertaData,
    statusChamadoData,

    empresaData,
    codigosAtivacaoData,
    usuariosData,
    contatosData,
    unidadesData,
    cervejasData,
    tanquesData,
    sensoresData,
    lotesData,
    producoesData,
    leiturasSensoresData,
    alertasData,
    chamadosData
};

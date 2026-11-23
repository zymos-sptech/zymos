
/*
  MOCK DATA - ZYMOS

  Arquivo centralizado para simulação do banco de dados
  no frontend.

  Entidades:
  1. Empresa
  2. Unidades
  3. Tanques
  4. Sensores
  5. Cervejas
  6. Lotes
  7. Produções
  8. Leituras dos sensores
  9. Alertas
  10. Histórico de temperatura

  Relacionamentos realizados por IDs.
*/

const DATA_REFERENCIA = "2026-09-28T15:00:00";


// ======================================================
// 1. EMPRESA
// ======================================================

const empresaData = {
    id: 1,
    nome: "Cervejaria Horizonte",
    plano: "Padrão"
};


// ======================================================
// 2. UNIDADES
// ======================================================

const unidadesData = [
    {
        id: 1,
        fk_empresa: 1,
        nome: "Matriz Ribeirão Preto",
        status: "Ativa",
        quantidadeTanques: 4
    },
    {
        id: 2,
        fk_empresa: 1,
        nome: "Campinas",
        status: "Ativa",
        quantidadeTanques: 6
    }
];


// ======================================================
// 3. TANQUES
// ======================================================

const tanquesData = [

    // MATRIZ RIBEIRÃO PRETO

    {
        id: 1,
        fk_unidade: 1,
        nome: "TQ-01",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 2,
        fk_unidade: 1,
        nome: "TQ-02",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 3,
        fk_unidade: 1,
        nome: "TQ-03",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 4,
        fk_unidade: 1,
        nome: "TQ-04",
        capacidadeLitros: 10000,
        status: "Em uso"
    },

    // UNIDADE CAMPINAS

    {
        id: 5,
        fk_unidade: 2,
        nome: "TQ-05",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 6,
        fk_unidade: 2,
        nome: "TQ-06",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 7,
        fk_unidade: 2,
        nome: "TQ-07",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 8,
        fk_unidade: 2,
        nome: "TQ-08",
        capacidadeLitros: 10000,
        status: "Em uso"
    },
    {
        id: 9,
        fk_unidade: 2,
        nome: "TQ-09",
        capacidadeLitros: 10000,
        status: "Disponível"
    },
    {
        id: 10,
        fk_unidade: 2,
        nome: "TQ-10",
        capacidadeLitros: 10000,
        status: "Disponível"
    }
];


// ======================================================
// 4. SENSORES
// ======================================================

const sensoresData = [];

for (let i = 0; i < tanquesData.length; i++) {
    sensoresData.push({
        id: i + 1,
        fk_tanque: tanquesData[i].id,
        modelo: "LM35",
        status: "Ativo"
    });
}


// ======================================================
// 5. CERVEJAS
// ======================================================

const cervejasData = [
    {
        id: 1,
        nome: "IPA",
        estilo: "Ale",
        levedura: "Saccharomyces cerevisiae",
        temperaturaMinima: 15,
        temperaturaMaxima: 24,
        diasFermentacao: 14
    },
    {
        id: 2,
        nome: "Red Ale",
        estilo: "Ale",
        levedura: "Saccharomyces cerevisiae",
        temperaturaMinima: 15,
        temperaturaMaxima: 24,
        diasFermentacao: 14
    },
    {
        id: 3,
        nome: "Pilsen",
        estilo: "Lager",
        levedura: "Saccharomyces pastorianus",
        temperaturaMinima: 8,
        temperaturaMaxima: 14,
        diasFermentacao: 21
    }
];


// ======================================================
// 6. LOTES
// ======================================================

const lotesData = [

    // MATRIZ RIBEIRÃO PRETO

    {
        id: 100,
        codigo: "101-A",
        fk_cerveja: 1,
        volume: 8000,
        status: "Em andamento",
        dataInicio: "2026-09-23T00:00:00",
        dataFim: null
    },
    {
        id: 101,
        codigo: "096",
        fk_cerveja: 2,
        volume: 7000,
        status: "Em andamento",
        dataInicio: "2026-09-23T00:00:00",
        dataFim: null
    },
    {
        id: 102,
        codigo: "095",
        fk_cerveja: 3,
        volume: 6000,
        status: "Em andamento",
        dataInicio: "2026-09-25T00:00:00",
        dataFim: null
    },
    {
        id: 103,
        codigo: "087",
        fk_cerveja: 1,
        volume: 7500,
        status: "Finalizado",
        dataInicio: "2026-09-01T00:00:00",
        dataFim: "2026-09-15T00:00:00"
    },

    // UNIDADE CAMPINAS

    {
        id: 104,
        codigo: "102",
        fk_cerveja: 3,
        volume: 9000,
        status: "Em andamento",
        dataInicio: "2026-09-20T00:00:00",
        dataFim: null
    },
    {
        id: 105,
        codigo: "103",
        fk_cerveja: 1,
        volume: 8500,
        status: "Em andamento",
        dataInicio: "2026-09-22T00:00:00",
        dataFim: null
    },
    {
        id: 106,
        codigo: "104",
        fk_cerveja: 2,
        volume: 6500,
        status: "Em andamento",
        dataInicio: "2026-09-24T00:00:00",
        dataFim: null
    },
    {
        id: 107,
        codigo: "105",
        fk_cerveja: 3,
        volume: 7500,
        status: "Em andamento",
        dataInicio: "2026-09-26T00:00:00",
        dataFim: null
    },
    {
        id: 108,
        codigo: "089",
        fk_cerveja: 1,
        volume: 7000,
        status: "Finalizado",
        dataInicio: "2026-09-01T00:00:00",
        dataFim: "2026-09-15T00:00:00"
    },
    {
        id: 109,
        codigo: "090",
        fk_cerveja: 2,
        volume: 5000,
        status: "Finalizado",
        dataInicio: "2026-08-25T00:00:00",
        dataFim: "2026-09-08T00:00:00"
    }
];


// ======================================================
// 7. PRODUÇÕES
// ======================================================

const producoesData = [

    // MATRIZ RIBEIRÃO PRETO

    {
        id: 1,
        fk_lote: 100,
        fk_tanque: 1,
        status: "Em andamento",
        dataInicio: "2026-09-23T00:00:00",
        dataFim: null
    },
    {
        id: 2,
        fk_lote: 101,
        fk_tanque: 2,
        status: "Em andamento",
        dataInicio: "2026-09-23T00:00:00",
        dataFim: null
    },
    {
        id: 3,
        fk_lote: 102,
        fk_tanque: 3,
        status: "Em andamento",
        dataInicio: "2026-09-25T00:00:00",
        dataFim: null
    },
    {
        id: 4,
        fk_lote: 103,
        fk_tanque: 4,
        status: "Finalizado",
        dataInicio: "2026-09-01T00:00:00",
        dataFim: "2026-09-15T00:00:00"
    },

    // UNIDADE CAMPINAS

    {
        id: 5,
        fk_lote: 104,
        fk_tanque: 5,
        status: "Em andamento",
        dataInicio: "2026-09-20T00:00:00",
        dataFim: null
    },
    {
        id: 6,
        fk_lote: 105,
        fk_tanque: 6,
        status: "Em andamento",
        dataInicio: "2026-09-22T00:00:00",
        dataFim: null
    },
    {
        id: 7,
        fk_lote: 106,
        fk_tanque: 7,
        status: "Em andamento",
        dataInicio: "2026-09-24T00:00:00",
        dataFim: null
    },
    {
        id: 8,
        fk_lote: 107,
        fk_tanque: 8,
        status: "Em andamento",
        dataInicio: "2026-09-26T00:00:00",
        dataFim: null
    },
    {
        id: 9,
        fk_lote: 108,
        fk_tanque: 9,
        status: "Finalizado",
        dataInicio: "2026-09-01T00:00:00",
        dataFim: "2026-09-15T00:00:00"
    },
    {
        id: 10,
        fk_lote: 109,
        fk_tanque: 10,
        status: "Finalizado",
        dataInicio: "2026-08-25T00:00:00",
        dataFim: "2026-09-08T00:00:00"
    }
];


// ======================================================
// 8. LEITURAS DOS SENSORES
// ======================================================

const leiturasSensoresData = [

    // TQ-01 - MATRIZ
    { id: 1, fk_sensor: 1, temperatura: 25.2, dataHora: "2026-09-28T14:32:10" },
    { id: 2, fk_sensor: 1, temperatura: 25.2, dataHora: "2026-09-28T15:00:00" },

    // TQ-02 - MATRIZ
    { id: 3, fk_sensor: 2, temperatura: 25.0, dataHora: "2026-09-27T10:15:00" },
    { id: 4, fk_sensor: 2, temperatura: 22.8, dataHora: "2026-09-28T15:00:00" },

    // TQ-03 - MATRIZ
    { id: 5, fk_sensor: 3, temperatura: 7.0, dataHora: "2026-09-26T16:00:00" },
    { id: 6, fk_sensor: 3, temperatura: 6.8, dataHora: "2026-09-28T15:00:00" },

    // TQ-04 - MATRIZ
    { id: 7, fk_sensor: 4, temperatura: 20.1, dataHora: "2026-09-28T14:30:00" },
    { id: 8, fk_sensor: 4, temperatura: 20.4, dataHora: "2026-09-28T15:00:00" },

    // TQ-05 - CAMPINAS
    { id: 9, fk_sensor: 5, temperatura: 14.5, dataHora: "2026-09-28T14:30:00" },
    { id: 10, fk_sensor: 5, temperatura: 15.4, dataHora: "2026-09-28T15:00:00" },

    // TQ-06 - CAMPINAS
    { id: 11, fk_sensor: 6, temperatura: 23.5, dataHora: "2026-09-28T14:30:00" },
    { id: 12, fk_sensor: 6, temperatura: 24.8, dataHora: "2026-09-28T15:00:00" },
    { id: 19, fk_sensor: 6, temperatura: 24.8, dataHora: "2026-09-28T14:45:00" },

    // TQ-07 - CAMPINAS
    { id: 13, fk_sensor: 7, temperatura: 21.5, dataHora: "2026-09-28T14:30:00" },
    { id: 14, fk_sensor: 7, temperatura: 13.5, dataHora: "2026-09-28T15:00:00" },

    // TQ-08 - CAMPINAS
    { id: 15, fk_sensor: 8, temperatura: 15.2, dataHora: "2026-09-28T09:10:00" },
    { id: 16, fk_sensor: 8, temperatura: 7.5, dataHora: "2026-09-28T15:00:00" },

    // TQ-09 - CAMPINAS
    { id: 17, fk_sensor: 9, temperatura: 10.5, dataHora: "2026-09-28T14:30:00" },

    // TQ-10 - CAMPINAS
    { id: 18, fk_sensor: 10, temperatura: 19.5, dataHora: "2026-09-28T14:30:00" }
];


// ======================================================
// 9. ALERTAS
// ======================================================

const alertasData = [

    // MATRIZ RIBEIRÃO PRETO

    {
        id: 1,
        fk_leitura_sensor: 1,
        tipo: "acima",
        temperatura: 25.2,
        temperaturaMinima: 15,
        temperaturaMaxima: 24,
        temperaturaLimite: 24,
        dataInicio: "2026-09-28T14:32:10",
        dataResolucao: null,
        status: "Aberto"
    },
    {
        id: 2,
        fk_leitura_sensor: 3,
        tipo: "acima",
        temperatura: 25.0,
        temperaturaMinima: 15,
        temperaturaMaxima: 24,
        temperaturaLimite: 24,
        dataInicio: "2026-09-27T10:15:00",
        dataResolucao: "2026-09-27T10:42:00",
        status: "Resolvido"
    },
    {
        id: 3,
        fk_leitura_sensor: 5,
        tipo: "abaixo",
        temperatura: 7.0,
        temperaturaMinima: 8,
        temperaturaMaxima: 14,
        temperaturaLimite: 8,
        dataInicio: "2026-09-26T16:00:00",
        dataResolucao: "2026-09-26T16:30:00",
        status: "Resolvido"
    },
    {
        id: 6,
        fk_leitura_sensor: 6,
        tipo: "abaixo",
        temperatura: 6.8,
        temperaturaMinima: 8,
        temperaturaMaxima: 14,
        temperaturaLimite: 8,
        dataInicio: "2026-09-28T15:00:00",
        dataResolucao: null,
        status: "Aberto"
    },

    // UNIDADE CAMPINAS

    {
        id: 4,
        fk_leitura_sensor: 19,
        tipo: "acima",
        temperatura: 24.8,
        temperaturaMinima: 15,
        temperaturaMaxima: 24,
        temperaturaLimite: 24,
        dataInicio: "2026-09-28T14:45:00",
        dataResolucao: null,
        status: "Aberto"
    },
    {
        id: 5,
        fk_leitura_sensor: 15,
        tipo: "acima",
        temperatura: 15.2,
        temperaturaMinima: 8,
        temperaturaMaxima: 14,
        temperaturaLimite: 14,
        dataInicio: "2026-09-28T09:10:00",
        dataResolucao: "2026-09-28T09:35:00",
        status: "Resolvido"
    },
    {
        id: 7,
        fk_leitura_sensor: 10,
        tipo: "acima",
        temperatura: 15.4,
        temperaturaMinima: 8,
        temperaturaMaxima: 14,
        temperaturaLimite: 14,
        dataInicio: "2026-09-28T15:00:00",
        dataResolucao: null,
        status: "Aberto"
    },
    {
        id: 8,
        fk_leitura_sensor: 14,
        tipo: "abaixo",
        temperatura: 13.5,
        temperaturaMinima: 15,
        temperaturaMaxima: 24,
        temperaturaLimite: 15,
        dataInicio: "2026-09-28T15:00:00",
        dataResolucao: null,
        status: "Aberto"
    },
    {
        id: 9,
        fk_leitura_sensor: 16,
        tipo: "abaixo",
        temperatura: 7.5,
        temperaturaMinima: 8,
        temperaturaMaxima: 14,
        temperaturaLimite: 8,
        dataInicio: "2026-09-28T15:00:00",
        dataResolucao: null,
        status: "Aberto"
    }
];


// ======================================================
// 10. HISTÓRICO DE TEMPERATURA
// ======================================================

/*
  Cada registro representa um período do lote.

  situacao:
  - "Dentro": temperatura dentro da faixa ideal.
  - "Fora": temperatura fora da faixa ideal.

  dataFim:
  - Data preenchida: período encerrado.
  - null: período ainda em andamento.

  Para calcular a aderência:
  tempo dentro da faixa / tempo total monitorado * 100.

  Períodos abertos são calculados até DATA_REFERENCIA.
*/

const historicoTemperaturasData = [

    // TQ-01 - LOTE 101-A
    {
        id: 1,
        fk_lote: 100,
        situacao: "Dentro",
        dataInicio: "2026-09-23T00:00:00",
        dataFim: "2026-09-28T14:32:10"
    },
    {
        id: 2,
        fk_lote: 100,
        situacao: "Fora",
        dataInicio: "2026-09-28T14:32:10",
        dataFim: null
    },

    // TQ-02 - LOTE 096
    {
        id: 3,
        fk_lote: 101,
        situacao: "Dentro",
        dataInicio: "2026-09-23T00:00:00",
        dataFim: "2026-09-27T10:15:00"
    },
    {
        id: 4,
        fk_lote: 101,
        situacao: "Fora",
        dataInicio: "2026-09-27T10:15:00",
        dataFim: "2026-09-27T10:42:00"
    },
    {
        id: 5,
        fk_lote: 101,
        situacao: "Dentro",
        dataInicio: "2026-09-27T10:42:00",
        dataFim: null
    },

    // TQ-03 - LOTE 095
    {
        id: 6,
        fk_lote: 102,
        situacao: "Dentro",
        dataInicio: "2026-09-25T00:00:00",
        dataFim: "2026-09-28T15:00:00"
    },
    {
        id: 7,
        fk_lote: 102,
        situacao: "Fora",
        dataInicio: "2026-09-28T15:00:00",
        dataFim: null
    },

    // TQ-05 - LOTE 102
    {
        id: 9,
        fk_lote: 104,
        situacao: "Dentro",
        dataInicio: "2026-09-20T00:00:00",
        dataFim: "2026-09-28T15:00:00"
    },
    {
        id: 16,
        fk_lote: 104,
        situacao: "Fora",
        dataInicio: "2026-09-28T15:00:00",
        dataFim: null
    },

    // TQ-06 - LOTE 103
    {
        id: 10,
        fk_lote: 105,
        situacao: "Dentro",
        dataInicio: "2026-09-22T00:00:00",
        dataFim: "2026-09-28T14:45:00"
    },
    {
        id: 11,
        fk_lote: 105,
        situacao: "Fora",
        dataInicio: "2026-09-28T14:45:00",
        dataFim: null
    },

    // TQ-07 - LOTE 104
    {
        id: 12,
        fk_lote: 106,
        situacao: "Dentro",
        dataInicio: "2026-09-24T00:00:00",
        dataFim: "2026-09-28T15:00:00"
    },
    {
        id: 17,
        fk_lote: 106,
        situacao: "Fora",
        dataInicio: "2026-09-28T15:00:00",
        dataFim: null
    },

    // TQ-08 - LOTE 105
    {
        id: 13,
        fk_lote: 107,
        situacao: "Dentro",
        dataInicio: "2026-09-26T00:00:00",
        dataFim: "2026-09-28T09:10:00"
    },
    {
        id: 14,
        fk_lote: 107,
        situacao: "Fora",
        dataInicio: "2026-09-28T09:10:00",
        dataFim: "2026-09-28T09:35:00"
    },
    {
        id: 15,
        fk_lote: 107,
        situacao: "Dentro",
        dataInicio: "2026-09-28T09:35:00",
        dataFim: "2026-09-28T15:00:00"
    },
    {
        id: 18,
        fk_lote: 107,
        situacao: "Fora",
        dataInicio: "2026-09-28T15:00:00",
        dataFim: null
    }
];


// ======================================================
// EXPORTAÇÃO
// ======================================================

export {
    DATA_REFERENCIA,
    empresaData,
    unidadesData,
    tanquesData,
    sensoresData,
    cervejasData,
    lotesData,
    producoesData,
    leiturasSensoresData,
    alertasData,
    historicoTemperaturasData
};
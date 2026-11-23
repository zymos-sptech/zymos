
/*
  MOCK DO PANORAMA

  Dados organizados conforme o banco ZYMOS.

  Matriz Ribeirão Preto:
  - 4 tanques: TQ-01 até TQ-04

  Campinas:
  - 6 tanques: TQ-01 até TQ-06

  Os nomes dos tanques podem se repetir entre unidades,
  pois a identificação considera o ID da unidade e o nome do tanque.

  Status dos tanques:
  Disponível, Em uso, Em limpeza, Manutenção e Indisponível.

  Status dos lotes:
  Em andamento, Finalizado e Cancelado.
*/

// Data fixa para os testes do Panorama
const DATA_REFERENCIA = "2026-09-28T15:00:00";

const unidadesData = [
  {
    id: 1,
    nome: "Matriz Ribeirão Preto",
    tanques: [
      {
        nome: "TQ-01",
        status: "Em uso",
        temperatura: 23.8,
        faixa: { min: 15, max: 24 },
        lote: {
          codigo: "101-A",
          volume: 8000,
          tipo: "Ale",
          status: "Em andamento"
        }
      },
      {
        nome: "TQ-02",
        status: "Em uso",
        temperatura: 16,
        faixa: { min: 15, max: 24 },
        lote: {
          codigo: "096",
          volume: 7000,
          tipo: "Ale",
          status: "Em andamento"
        }
      },
      {
        nome: "TQ-03",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      },
      {
        nome: "TQ-04",
        status: "Em uso",
        temperatura: 14.8,
        faixa: { min: 15, max: 24 },
        lote: {
          codigo: "011",
          volume: 6000,
          tipo: "Ale",
          status: "Em andamento"
        }
      }
    ]
  },
  {
    id: 2,
    nome: "Campinas",
    tanques: [
      {
        nome: "TQ-01",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      },
      {
        nome: "TQ-02",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      },
      {
        nome: "TQ-03",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      },
      {
        nome: "TQ-04",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      },
      {
        nome: "TQ-05",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      },
      {
        nome: "TQ-06",
        status: "Disponível",
        temperatura: null,
        faixa: null,
        lote: null
      }
    ]
  }
];

// Alertas
// dt_resolucao NULL = aberto
// dt_resolucao preenchida = resolvido

const alertasData = [
  {
    id: 1,
    unidadeId: 1,
    tanque: "TQ-01",
    lote: "101-A",
    tipo: "acima",
    temperatura: 25.2,
    inicio: "2026-09-28T14:32:10",
    fim: null,
    status: "aberto"
  },
  {
    id: 2,
    unidadeId: 1,
    tanque: "TQ-04",
    lote: null,
    tipo: "abaixo",
    temperatura: 14.8,
    inicio: "2026-09-28T14:45:00",
    fim: null,
    status: "aberto"
  },
  {
    id: 3,
    unidadeId: 1,
    tanque: "TQ-02",
    lote: "096",
    tipo: "abaixo",
    temperatura: 14,
    inicio: "2026-09-28T13:00:00",
    fim: "2026-09-28T13:10:00",
    status: "resolvido"
  }
];

export { DATA_REFERENCIA, unidadesData, alertasData };

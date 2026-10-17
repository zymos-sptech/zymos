const tanqueData = [
  // Unidade 1 - São Paulo
  {
    id: 1,
    nome: "TQ-01",
    capacidade: 8000,
    unidadeId: 1,
    nomeUnidade: "São Paulo",
    lote: [{ id: 101, nome: "Lote 101-A", desvio: 3 }]
  },
  {
    id: 2,
    nome: "TQ-02",
    capacidade: 8000,
    unidadeId: 1,
    nomeUnidade: "São Paulo",
    lote: [{ id: 96, nome: "Lote 096", desvio: 0 }]
  },
  {
    id: 3,
    nome: "TQ-03",
    capacidade: 5000,
    unidadeId: 1,
    nomeUnidade: "São Paulo",
    lote: [{ id: 0, nome: "Disponível", desvio: 0 }]
  },
  // Unidade 2 - São Francisco
  {
    id: 4,
    nome: "TQ-01",
    capacidade: 10000,
    unidadeId: 2,
    nomeUnidade: "São Francisco",
    lote: [{ id: 104, nome: "Lote 104", desvio: 1 }]
  },
  {
    id: 5,
    nome: "TQ-02",
    capacidade: 6000,
    unidadeId: 2,
    nomeUnidade: "São Francisco",
    lote: [{ id: 102, nome: "Lote 102", desvio: 0 }]
  },
  // Unidade 3 - Belo Horizonte
  {
    id: 6,
    nome: "TQ-01",
    capacidade: 8000,
    unidadeId: 3,
    nomeUnidade: "Belo Horizonte",
    lote: [{ id: 99, nome: "Lote 099", desvio: 2 }]
  }
];

export { tanqueData };

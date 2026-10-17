const loteData = [
  {
    id: 1,
    nome_tanque: "TQ-01",
    nome_lote: "001",
    dt_inicio: "2026-08-01",
    dt_fim: "2026-08-10",
    temp_min: 18,
    temp_max: 24,
    estilo: "American IPA",
    nome_cerveja: "RED IPA",
    status: "Finalizado",
    levedura: "Ale",
    desvio: 2,
  },
  {
    id: 1,
    nome_tanque: "TQ-02",
    nome_lote: "001",
    dt_inicio: "2026-08-01",
    dt_fim: "2026-08-10",
    temp_min: 18,
    temp_max: 24,
    estilo: "American IPA",
    nome_cerveja: "RED IPA",
    status: "Finalizado",
    levedura: "Ale",
    desvio: 0,
  },
];

const medidaLote = {
  id: 1,
  medida: [],
  dt_medida: [],
};

export { loteData, medidaLote };

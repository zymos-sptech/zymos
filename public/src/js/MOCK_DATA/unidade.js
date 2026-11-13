/*
  MOCK DO PANORAMA (fonte única de dados)

  Regra: aqui só entram dados "crus". Nada calculado.
  Quem calcula (em desvio, ocupação, tempo de resposta, volume em risco...)
  é o JS da página. Assim, quando vier do banco, o formato é o mesmo.

  Reproduz o Figma: 2 unidades, 10 tanques, 7 em uso,
  4 ocorrências em 24h (1 resolvida, 3 em aberto: 1 acima e 2 abaixo do ideal).
*/

// "Agora" fixo para o "há X min" ser calculado e não inventado.
// Em produção troca por new Date().
const DATA_REFERENCIA = "2026-10-29T14:45:30";

// status do tanque: "ocupado" ou "disponivel"
// lote: null quando o tanque está disponível
const unidadesData = [
  {
    id: 1,
    nome: "Matriz Ribeirão Preto",
    tanques: [
      {
        nome: "TQ-01",
        status: "ocupado",
        temperatura: 25.2,
        faixa: { min: 18, max: 23 },
        lote: { codigo: "101-A", volume: 8000, tipo: "Ale" },
      },
      {
        nome: "TQ-02",
        status: "ocupado",
        temperatura: 19.8,
        faixa: { min: 18, max: 23 },
        lote: { codigo: "097", volume: 7000, tipo: "Ale" },
      },
      {
        nome: "TQ-03",
        status: "ocupado",
        temperatura: 20.5,
        faixa: { min: 18, max: 23 },
        lote: { codigo: "098", volume: 6000, tipo: "Ale" },
      },
      {
        nome: "TQ-04",
        status: "ocupado",
        temperatura: 7.2,
        faixa: { min: 8, max: 14 },
        lote: { codigo: "095", volume: 6000, tipo: "Lager" },
      },
    ],
  },
  {
    id: 2,
    nome: "Campinas",
    tanques: [
      {
        nome: "TQ-01",
        status: "ocupado",
        temperatura: 20.9,
        faixa: { min: 18, max: 23 },
        lote: { codigo: "201", volume: 5000, tipo: "Ale" },
      },
      {
        nome: "TQ-02",
        status: "ocupado",
        temperatura: 14.6,
        faixa: { min: 18, max: 23 },
        lote: { codigo: "202", volume: 6000, tipo: "Ale" },
      },
      {
        nome: "TQ-03",
        status: "ocupado",
        temperatura: 21.3,
        faixa: { min: 18, max: 23 },
        lote: { codigo: "203", volume: 5000, tipo: "Ale" },
      },
      { nome: "TQ-04", status: "disponivel", temperatura: null, faixa: null, lote: null },
      { nome: "TQ-05", status: "disponivel", temperatura: null, faixa: null, lote: null },
      { nome: "TQ-06", status: "disponivel", temperatura: null, faixa: null, lote: null },
    ],
  },
];

// Ocorrências das últimas 24h.
// status: "aberto" ou "resolvido"; fim é null enquanto aberto.
// tipo: "acima" ou "abaixo" (do ideal)
const alertasData = [
  {
    id: 1,
    unidadeId: 2,
    tanque: "TQ-02",
    lote: "202",
    tipo: "abaixo",
    temperatura: 14.6,
    inicio: "2026-10-29T14:19:44",
    fim: null,
    status: "aberto",
  },
  {
    id: 2,
    unidadeId: 1,
    tanque: "TQ-04",
    lote: "095",
    tipo: "abaixo",
    temperatura: 7.2,
    inicio: "2026-10-29T14:31:10",
    fim: null,
    status: "aberto",
  },
  {
    id: 3,
    unidadeId: 1,
    tanque: "TQ-01",
    lote: "101-A",
    tipo: "acima",
    temperatura: 25.2,
    inicio: "2026-10-29T14:32:10",
    fim: null,
    status: "aberto",
  },
  {
    id: 4,
    unidadeId: 1,
    tanque: "TQ-02",
    lote: "201",
    tipo: "acima",
    temperatura: 23.8,
    inicio: "2026-10-29T09:10:00",
    fim: "2026-10-29T09:28:00",
    status: "resolvido",
  },
];

export { DATA_REFERENCIA, unidadesData, alertasData };
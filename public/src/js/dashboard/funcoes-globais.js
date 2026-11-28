import {
  cervejasData,
  leiturasSensoresData
} from "../MOCK_DATA/mock_data.js";

export function formatarNumeroPtBr(valor, casasDecimais) {
  let numero = Number(valor);
  if (isNaN(numero)) {
    return "—";
  }

  let casas = 1;
  if (typeof casasDecimais === "number" && !isNaN(casasDecimais)) {
    casas = casasDecimais;
  }

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  });
}

export function buscarCervejaPorId(idCerveja) {
  for (let i = 0; i < cervejasData.length; i++) {
    if (cervejasData[i].id === idCerveja) {
      return cervejasData[i];
    }
  }

  return null;
}

export function buscarLeituraPorId(idLeitura) {
  for (let i = 0; i < leiturasSensoresData.length; i++) {
    if (leiturasSensoresData[i].id === idLeitura) {
      return leiturasSensoresData[i];
    }
  }

  return null;
}
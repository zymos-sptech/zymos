import { getUnidadeSelecionada } from "./filtro-unidades.js";
import { tanqueData } from "../../MOCK_DATA/tanque.js";
import alertaData from "../../MOCK_DATA/alerta.js";

const selectUnidade = document.getElementById("select-unidade");

// Card 1: Lotes em andamento
const qtdLotesAtivo = document.getElementById("kpi-lotes-qtd");
const lotesAle = document.getElementById("tag-lotes-ale");
const lotesLager = document.getElementById("tag-lotes-lager");
const unidadeReferencia = document.getElementById("kpi-unidade-referencia");

// Card 2: Aderência média geral
const aderenciaMedia = document.getElementById("kpi-aderencia-valor");
const aderenciaProgressBar = document.getElementById(
  "kpi-aderencia-progress-bar",
);
const unidadeAderencia = document.getElementById("kpi-aderencia-unidade");

// Card 3: Desvios no período
const qtdDesvio = document.getElementById("kpi-desvios-qtd");
const desviosResolvidos = document.getElementById("kpi-desvios-resolvidos");
const desviosAbertos = document.getElementById("kpi-desvios-abertos");
const unidadeDesvios = document.getElementById("kpi-desvios-unidade");

// Card 4: Alertas pendentes
const qtdAlertas = document.getElementById("kpi-alertas-qtd");
const alertaDetalhe = document.getElementById("kpi-alerta-detalhe");
const alertaTempo = document.getElementById("kpi-alerta-tempo");
const alertaDot = document.getElementById("kpi-alerta-dot");

// Card 5: Ocupação dos tanques
const ocupacaoQtd = document.getElementById("kpi-ocupacao-qtd");
const ocupacaoTotal = document.getElementById("kpi-ocupacao-total");
const ocupacaoProgressBar = document.getElementById(
  "kpi-ocupacao-progress-bar",
);
const ocupacaoTaxa = document.getElementById("kpi-ocupacao-taxa");

function renderizarKpi() {
  const unidadeSelecionada = getUnidadeSelecionada();
  const dataAtual = new Date();

  const tanquesDaUnidade = [];
  for (let i = 0; i < tanqueData.length; i++) {
    if (
      tanqueData[i].nomeUnidade.trim().toLowerCase() ===
      unidadeSelecionada.trim().toLowerCase()
    ) {
      tanquesDaUnidade.push(tanqueData[i]);
    }
  }

  const alertasDaUnidade = [];
  for (let i = 0; i < alertaData.length; i++) {
    if (
      alertaData[i].nome_unidade.trim().toLowerCase() ===
      unidadeSelecionada.trim().toLowerCase()
    ) {
      alertasDaUnidade.push(alertaData[i]);
    }
  }

  // BLOCO 1: KPI Lotes em Andamento
  let lotesAtivos = 0;
  let totalLotesAle = 0;
  let totalLotesLager = 0;

  for (let i = 0; i < tanquesDaUnidade.length; i++) {
    const tanque = tanquesDaUnidade[i];
    const dataFimLote = new Date(tanque.dataFim);

    if (
      tanque.status.toLowerCase() !== "disponivel" &&
      dataAtual <= dataFimLote
    ) {
      lotesAtivos++;

      if (tanque.tipo.toLowerCase() === "ale") {
        totalLotesAle++;
      } else if (tanque.tipo.toLowerCase() === "lager") {
        totalLotesLager++;
      }
    }
  }

  qtdLotesAtivo.textContent = `${lotesAtivos}`;
  lotesAle.textContent = `${totalLotesAle} Ale`;
  lotesLager.textContent = `${totalLotesLager} Lager`;
  unidadeReferencia.textContent = `${unidadeSelecionada} · até agora`;

  // BLOCO 2: KPI Aderência Média Geral
  let qtdLotesAderencia = 0;
  let somaAderencia = 0;

  for (let i = 0; i < tanquesDaUnidade.length; i++) {
    const tanque = tanquesDaUnidade[i];
    if (
      tanque.status.toLowerCase() !== "disponivel" &&
      typeof tanque.aderenciaTermica === "number"
    ) {
      somaAderencia += tanque.aderenciaTermica;
      qtdLotesAderencia++;
    }
  }

  const aderenciaMediaFinal =
    qtdLotesAderencia > 0 ? somaAderencia / qtdLotesAderencia : 0;

  aderenciaMedia.textContent = `${aderenciaMediaFinal.toFixed(1)}%`;
  aderenciaProgressBar.style.width = `${aderenciaMediaFinal}%`;
  unidadeAderencia.textContent = `${unidadeSelecionada} · até agora`;

  // BLOCO 3: KPI Desvios no Período
  let totalDesvios = 0;
  let totalDesviosResolvidos = 0;
  let totalDesviosAbertos = 0;

  for (let i = 0; i < alertasDaUnidade.length; i++) {
    let alerta = alertasDaUnidade[i];
    let statusAlerta = alerta.status.trim().toLowerCase();

    if (statusAlerta === "resolvido") {
      totalDesviosResolvidos++;
      totalDesvios++;
    } else if (statusAlerta === "aberto" || statusAlerta === "iniciado") {
      totalDesviosAbertos++;
      totalDesvios++;
    }
  }

  qtdDesvio.textContent = `${totalDesvios}`;
  desviosResolvidos.textContent = `${totalDesviosResolvidos} resolvido${totalDesviosResolvidos === 1 ? "" : "s"}`;
  desviosAbertos.textContent = `${totalDesviosAbertos} em aberto`;
  unidadeDesvios.textContent = `${unidadeSelecionada} · até agora`;

  // BLOCO 4: KPI Alertas Pendentes
  let alertasPendentes = 0;
  let alertaMaisRecente = null;

  for (let i = 0; i < alertasDaUnidade.length; i++) {
    const alerta = alertasDaUnidade[i];

    if (alerta.status.trim().toLowerCase() === "aberto") {
      alertasPendentes++;
      if (!alertaMaisRecente) {
        alertaMaisRecente = alerta;
      }
    }
  }

  qtdAlertas.textContent = `${alertasPendentes}`;

  if (alertaMaisRecente) {
    const alertaStatus = alertaMaisRecente.status.trim().toLowerCase();
    alertaDot.className = "kpi-dot";

    if (alertaStatus === "aberto") {
      alertaDot.classList.add("orange");
    } else if (alertaStatus === "finalizado") {
      alertaDot.classList.add("gray");
    } else if (alertaStatus === "iniciado") {
      alertaDot.classList.add("blue");
    }

    alertaDetalhe.textContent = `${alertaMaisRecente.nome_tanque}  ${alertaMaisRecente.tipo}`;
    alertaTempo.textContent = `desde ${alertaMaisRecente.horario || alertaMaisRecente.dt_inicio}`;
  } else {
    alertaDot.className = "kpi-dot green";
    alertaDetalhe.textContent = "Tudo na faixa ideal";
    alertaTempo.textContent = "Nenhum alerta pendente na unidade";
  }

  // BLOCO 5: KPI Ocupação dos Tanques
  let totalTanques = 0;
  let totalTanquesOcupados = 0;
  let totalTanquesDisponivel = 0;
  let porcentagemOcupacao = 0;

  for (let i = 0; i < tanquesDaUnidade.length; i++) {
    let tanques = tanquesDaUnidade[i];
    totalTanques++;

    if (tanques.status.trim().toLowerCase() === "disponivel") {
      totalTanquesDisponivel++;
    } else {
      totalTanquesOcupados++;
    }
  }

  porcentagemOcupacao = totalTanques > 0 ? (totalTanquesOcupados / totalTanques) * 100 : 0;

  ocupacaoQtd.textContent = `${totalTanquesOcupados}`;
  ocupacaoTotal.textContent = `de ${totalTanques} tanques`;
  ocupacaoProgressBar.style.width = `${porcentagemOcupacao}%`;
  ocupacaoTaxa.textContent = `${porcentagemOcupacao.toFixed(1)}% de ocupação`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarKpi();
});

if (selectUnidade) {
  selectUnidade.addEventListener("change", () => {
    renderizarKpi();
  });
}

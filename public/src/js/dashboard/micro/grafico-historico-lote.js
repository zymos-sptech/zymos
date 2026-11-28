import {
  DATA_REFERENCIA,
  lotesData,
  leiturasSensoresData
} from "../../MOCK_DATA/mock_data.js";
import { formatarNumeroPtBr } from "../funcoes-globais.js";

const COR_LOTE_ATUAL = "#426084";
const COR_LOTE_REFERENCIA = "#c88a4b";
const COR_FAIXA_IDEAL = "#e8efe6A5";

let instanciaGraficoHistorico = null;
let loteComparativoSelecionadoPorReceita = {};

function obterPainelHistorico() {
  let canvas = document.getElementById("canvas_grafico_historico");
  if(canvas){
    if(canvas.closest(".painel")){
      return canvas.closest(".painel");
    }
    return canvas.parentElement;
  }

  let container = document.getElementById("grafico-historico-lote-container");
  if(container){
    if(container.closest(".painel")){
      return container.closest(".painel");
    }
    return container;
  }
  return document.querySelector(".lote-comparativo");
}

function obterOuCriarElementosHistorico() {
  let painel = obterPainelHistorico();

  let controlesEl = document.getElementById("comparativo-filtros");
  if(!controlesEl && painel){
    controlesEl = document.createElement("div");
    controlesEl.id = "comparativo-filtros";
    let cabecalho = painel.querySelector(".painel__cabecalho");
    if(cabecalho){
      cabecalho.appendChild(controlesEl);
    }else{
      painel.prepend(controlesEl);
    }
  }

  let wrapperGrafico = document.getElementById("wrapper-canvas-historico");
  let canvas = document.getElementById("canvas_grafico_historico");

  if(!wrapperGrafico && painel){
    let areaGrafico = document.getElementById("grafico-historico-lote-container");
    if(!areaGrafico){
      areaGrafico = painel;
    }

    wrapperGrafico = document.createElement("div");
    wrapperGrafico.id = "wrapper-canvas-historico";

    if(canvas && canvas.parentElement){
      canvas.parentElement.replaceChild(wrapperGrafico, canvas);
      wrapperGrafico.appendChild(canvas);
    }else{
      wrapperGrafico.innerHTML = '<canvas id="canvas_grafico_historico"></canvas>';
      areaGrafico.appendChild(wrapperGrafico);
      canvas = document.getElementById("canvas_grafico_historico");
    }
  }else if(wrapperGrafico){
    canvas = document.getElementById("canvas_grafico_historico");
  }

  let rodapeEl = document.getElementById("comparativo-rodape");
  if(!rodapeEl && painel){
    rodapeEl = document.createElement("div");
    rodapeEl.id = "comparativo-rodape";
    rodapeEl.className = "painel__rodape";
    painel.appendChild(rodapeEl);
  }

  return{canvas: canvas, controlesEl: controlesEl, rodapeEl: rodapeEl};
}

function buscarLotesMesmaReceita(loteAtual) {
  let candidatos = [];

  for(let i = 0; i < lotesData.length; i++){
    let candidato = lotesData[i];
    if(candidato.id !== loteAtual.id && candidato.fk_cerveja === loteAtual.fk_cerveja){
      candidatos.push(candidato);
    }
  }

  candidatos.sort(function (a, b) {
    let aFinalizado = 1;
    if(a.fk_status_lote === 2){
      aFinalizado = 0;
    }

    let bFinalizado = 1;
    if(b.fk_status_lote === 2){
      bFinalizado = 0;
    }

    if(aFinalizado !== bFinalizado){
      return aFinalizado - bFinalizado;
    }
    return a.id - b.id;
  });
  return candidatos;
}

function calcularDiaRelativo(dtInicio, dtAlvo) {
  let inicio = new Date(dtInicio);
  let alvo = new Date(dtAlvo);

  if(isNaN(inicio.getTime()) || isNaN(alvo.getTime())){
    return 1;
  }

  let diffDias = Math.floor((alvo - inicio) / (1000 * 60 * 60 * 24)) + 1;
  if(diffDias < 1){
    return 1;
  }
  return diffDias;
}

function construirSeriePorDia(lote, totalDias, ateDiaMaximo) {
  let somaPorDia = {};
  let contagemPorDia = {};
  let ultimoValorConhecido = null;

  for(let i = 0; i < leiturasSensoresData.length; i++){
    let leitura = leiturasSensoresData[i];
    let temp = Number(leitura.temperatura);

    if(leitura.fk_lote === lote.id && !isNaN(temp)){
      let dia = calcularDiaRelativo(lote.dt_inicio, leitura.dt_medicao);
      if (dia >= 1 && dia <= totalDias) {
        if(!somaPorDia[dia]){
          somaPorDia[dia] = 0;
          contagemPorDia[dia] = 0;
        }
        somaPorDia[dia] = somaPorDia[dia] + temp;
        contagemPorDia[dia] = contagemPorDia[dia] + 1;
      }
      ultimoValorConhecido = temp;
    }
  }

  if(ultimoValorConhecido === null){
    ultimoValorConhecido = 20.0;
  }

  let mediaPorDia = {};
  let primeiroValorConhecido = null;

  for(let dia = 1; dia <= totalDias; dia++){
    if(somaPorDia[dia] !== undefined && contagemPorDia[dia] > 0){
      let media = Math.round((somaPorDia[dia] / contagemPorDia[dia]) * 10) / 10;
      mediaPorDia[dia] = media;
      if(primeiroValorConhecido === null){
        primeiroValorConhecido = media;
      }
    }
  }

  let serie = [];
  let valorCorrente = ultimoValorConhecido;
  if(primeiroValorConhecido !== null){
    valorCorrente = primeiroValorConhecido;
  }

  for(let dia = 1; dia <= totalDias; dia++){
    if(dia > ateDiaMaximo && lote.fk_status_lote !== 2){
      serie.push(null);
      continue;
    }

    if(mediaPorDia[dia] !== undefined){
      valorCorrente = mediaPorDia[dia];
    }
    serie.push(valorCorrente);
  }
  return serie;
}

function calcularCorrelacaoPercentual(serieA, serieB, faixaAmplitude) {
  let somaDiferenca = 0;
  let comparacoes = 0;
  let tamanho = Math.min(serieA.length, serieB.length);

  let amplitude = 6;
  if(faixaAmplitude && faixaAmplitude > 0){
    amplitude = faixaAmplitude;
  }

  for(let i = 0; i < tamanho; i++){
    if(serieA[i] !== null && serieB[i] !== null){
      let diff = Math.abs(serieA[i] - serieB[i]);
      let similaridadeDia = Math.max(0, 1 - diff / (amplitude * 1.5));
      somaDiferenca = somaDiferenca + similaridadeDia;
      comparacoes = comparacoes + 1;
    }
  }

  if(comparacoes === 0){
    return null;
  }

  let percentual = (somaDiferenca / comparacoes) * 100;
  let limitado = Math.max(0, Math.min(100, percentual));
  return Math.round(limitado * 10) / 10;
}

function obterFitFinal(loteRef, serieAtual, serieRef, intervalo) {
  if (loteRef && loteRef.fit_percentual !== null && loteRef.fit_percentual !== undefined){
    let valorBackend = Number(loteRef.fit_percentual);
    if(!isNaN(valorBackend)){
      return valorBackend;
    }
  }

  if(loteRef){
    return calcularCorrelacaoPercentual(serieAtual, serieRef, intervalo);
  }
  return null;
}

function atualizarExtremosSerie(serie, extremos) {
  for(let i = 0; i < serie.length; i++){
    if(serie[i] !== null) {
      if(serie[i] < extremos.menor){
        extremos.menor = serie[i];
      }
      if(serie[i] > extremos.maior){
        extremos.maior = serie[i];
      }
    }
  }
}

function calcularLimitesEixoY(tempMin, tempMax, serieAtual, serieRef) {
  let extremos = {
    menor: tempMin,
    maior: tempMax
  };

  atualizarExtremosSerie(serieAtual, extremos);
  atualizarExtremosSerie(serieRef, extremos);

  let minY = Math.floor(extremos.menor - 2);
  let maxY = Math.ceil(extremos.maior + 2);

  if(maxY - minY < 6){
    minY = Math.floor(tempMin - 2);
    maxY = Math.ceil(tempMax + 2);
  }

  let passo = Math.max(2, Math.round((maxY - minY) / 4));
  return {min: minY, max: maxY, stepSize: passo};
}

function atualizarCabecalhoEControles(controlesEl, loteAtual, cerveja, candidatos, loteRef) {
  let painel = obterPainelHistorico();
  let subtituloEl = null;
  if(painel){
    subtituloEl = painel.querySelector(".painel__subtitulo");
  }

  let nomeReceita = "Receita";
  if(cerveja && cerveja.nome){
    nomeReceita = cerveja.nome;
  }

  if(subtituloEl){
    subtituloEl.textContent = "Mesma receita (" + nomeReceita + ") · alinhado por dia de fermentação";
  }

  if(!controlesEl){
    return;
  }

  let optionsHTML = "";
  for(let i = 0; i < candidatos.length; i++){
    let c = candidatos[i];
    let selected = "";
    if(loteRef && c.id === loteRef.id){
      selected = " selected";
    }
    optionsHTML =
    optionsHTML + '<option value="' +
    c.id + '"' +
    selected + ">Lote " +
    c.codigo + "</option>";
  }

  if(candidatos.length === 0){
    optionsHTML = '<option value="">Sem outro lote</option>';
  }

  controlesEl.innerHTML =
    '<div class="historico-controles">' +
    "<span>Comparando:</span>" +
    '<span id="nome-lote-atual-historico" class="historico-pill-atual">' +
    '<span class="historico-pill-ponto"></span>' +
    "Lote " +
    loteAtual.codigo +
    "</span>" +
    '<select id="grafico_historico_lote2" class="historico-select-ref" aria-label="Selecionar lote para comparação">' +
    optionsHTML +
    "</select>" +
    "</div>";

  let selectRef = document.getElementById("grafico_historico_lote2");
  if(selectRef){
    selectRef.onchange = function () {
      let receitaKey = loteAtual.fk_cerveja;
      loteComparativoSelecionadoPorReceita[receitaKey] = Number(selectRef.value);
      renderizarGraficoHistoricoLote(loteAtual, cerveja);
    };
  }
}

function atualizarRodapeComparativo(rodapeEl, loteAtual, loteRef, fitValor) {
  if(!rodapeEl){
    return;
  }

  let fitTexto = "—";
  if(fitValor !== null && fitValor !== undefined){
    fitTexto = formatarNumeroPtBr(fitValor, 1) + "%";
  }

  let nomeRef = "Sem referência";
  if(loteRef){
    nomeRef = "Lote " + loteRef.codigo + " (referência)";
  }

  rodapeEl.innerHTML =
    '<div id="legenda_grafico_historico" class="historico-rodape-linha">' +
    "<div>Correlação (fit) entre os lotes: <strong>" +
    fitTexto +
    "</strong></div>" +
    '<div class="historico-rodape-legendas">' +
    '<span class="grafico-legenda-item">' +
    '<span class="grafico-legenda-traco"></span>' +
    "Lote " +
    loteAtual.codigo +
    " (atual)" +
    "</span>" +
    '<span class="grafico-legenda-item">' +
    '<span class="grafico-legenda-traco grafico-legenda-traco--tracejado"></span>' +
    nomeRef +
    "</span>" +
    "</div>" +
    "</div>";
}

function buscarLoteReferencia(loteAtual, candidatos) {
  let receitaKey = loteAtual.fk_cerveja;
  let salvoId = loteComparativoSelecionadoPorReceita[receitaKey];

  if(salvoId){
    for(let i = 0; i < candidatos.length; i++){
      if(candidatos[i].id === salvoId){
        return candidatos[i];
      }
    }
  }

  if(candidatos.length > 0){
    return candidatos[0];
  }

  return null;
}

export function renderizarGraficoHistoricoLote(loteAtual, cerveja) {
  if(!loteAtual){
    return;
  }

  let candidatos = buscarLotesMesmaReceita(loteAtual);
  let loteRef = buscarLoteReferencia(loteAtual, candidatos);

  let elementos = obterOuCriarElementosHistorico();
  atualizarCabecalhoEControles(elementos.controlesEl, loteAtual, cerveja, candidatos, loteRef);

  let canvas = elementos.canvas;
  if(!canvas || typeof Chart === "undefined"){
    return;
  }

  if(instanciaGraficoHistorico){
    instanciaGraficoHistorico.destroy();
    instanciaGraficoHistorico = null;
  }

  let totalDias = 14;
  if(cerveja && cerveja.tempo_fermentacao_dias){
    totalDias = Number(cerveja.tempo_fermentacao_dias);
  }

  let diaAtualLote = calcularDiaRelativo(loteAtual.dt_inicio, DATA_REFERENCIA);
  if(diaAtualLote > totalDias){
    diaAtualLote = totalDias;
  }

  let labels = [];
  let faixaMaxArr = [];
  let faixaMinArr = [];

  let tempMin = 15;
  if(cerveja && cerveja.temperatura_min !== null && cerveja.temperatura_min !== undefined){
    tempMin = Number(cerveja.temperatura_min);
  }

  let tempMax = 24;
  if(cerveja && cerveja.temperatura_max !== null && cerveja.temperatura_max !== undefined){
    tempMax = Number(cerveja.temperatura_max);
  }

  for(let dia = 1; dia <= totalDias; dia++){
    labels.push("Dia " + dia);
    faixaMaxArr.push(tempMax);
    faixaMinArr.push(tempMin);
  }

  let serieAtual = construirSeriePorDia(loteAtual, totalDias, diaAtualLote);

  let serieRef = [];
  if(loteRef){
    serieRef = construirSeriePorDia(loteRef, totalDias, totalDias);
  }

  let intervalo = Math.abs(tempMax - tempMin);
  if(intervalo === 0){
    intervalo = 6;
  }

  let fitValor = obterFitFinal(loteRef, serieAtual, serieRef, intervalo);
  atualizarRodapeComparativo(elementos.rodapeEl, loteAtual, loteRef, fitValor);

  let limitesY = calcularLimitesEixoY(tempMin, tempMax, serieAtual, serieRef);

  let pluginHoje = {
    id: "linhaHojeHistorico",
    afterDatasetsDraw: function (chartInstance) {
      if (loteAtual.fk_status_lote === 2) {
        return;
      }

      let xScale = chartInstance.scales.x;
      let yScale = chartInstance.scales.y;
      if(!xScale || !yScale){
        return;
      }

      let indiceHoje = Math.max(0, Math.min(totalDias - 1, diaAtualLote - 1));
      let xPos = xScale.getPixelForValue(indiceHoje);

      let c = chartInstance.ctx;
      c.save();
      c.beginPath();
      c.setLineDash([4, 4]);
      c.strokeStyle = "#8a99a8";
      c.lineWidth = 1.2;
      c.moveTo(xPos, yScale.top);
      c.lineTo(xPos, yScale.bottom);
      c.stroke();

      c.setLineDash([]);
      c.fillStyle = "#556c80";
      c.font = "11px sans-serif";
      c.textAlign = "left";
      c.fillText("Hoje", xPos + 6, yScale.top + 11);
      c.restore();
    }
  };

  let datasets = [
    {
      type: "line",
      label: "Lote " + loteAtual.codigo + " (atual)",
      data: serieAtual,
      borderColor: COR_LOTE_ATUAL,
      backgroundColor: COR_LOTE_ATUAL,
      borderWidth: 2,
      pointRadius: function (context) {
        let idx = context.dataIndex;
        let isUltimoAtivo = idx === diaAtualLote - 1 && loteAtual.fk_status_lote !== 2;
        if(isUltimoAtivo){
          return 5;
        }
        return 2.5;
      },
      tension: 0.25,
      spanGaps: false
    }
  ];

  if(loteRef){
    datasets.push({
      type: "line",
      label: "Lote " + loteRef.codigo + " (referência)",
      data: serieRef,
      borderColor: COR_LOTE_REFERENCIA,
      backgroundColor: COR_LOTE_REFERENCIA,
      borderWidth: 1.8,
      borderDash: [4, 4],
      pointRadius: 2.5,
      tension: 0.25
    });
  }

  datasets.push(
    {
      type: "line",
      label: "Faixa máx.",
      data: faixaMaxArr,
      backgroundColor: COR_FAIXA_IDEAL,
      borderWidth: 0,
      pointRadius: 0,
      fill: "+1"
    },
    {
      type: "line",
      label: "Faixa mín.",
      data: faixaMinArr,
      borderWidth: 0,
      pointRadius: 0,
      fill: false
    }
  );

  let tamanhoFonteX = 9.5;
  if(totalDias > 14){
    tamanhoFonteX = 8.5;
  }

  instanciaGraficoHistorico = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 8, right: 14, bottom: 4 }
      },
      scales: {
        y: {
          min: limitesY.min,
          max: limitesY.max,
          ticks: {
            stepSize: limitesY.stepSize,
            callback: function (value) {
              return Math.round(Number(value)) + "°";
            }
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)"
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            padding: 4,
            font: {
              size: tamanhoFonteX
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (
                context.parsed &&
                context.parsed.y !== null &&
                context.parsed.y !== undefined
              ) {
                return(context.dataset.label + ": " + formatarNumeroPtBr(context.parsed.y, 1) + "°C");
              }
              return null;
            }
          }
        }
      }
    },
    plugins: [pluginHoje]
  });
}

window.renderizarGraficoHistoricoLote = renderizarGraficoHistoricoLote;
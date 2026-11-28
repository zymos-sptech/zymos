import { formatarNumeroPtBr } from "../funcoes-globais.js";

const COR_LINHA = "#426084";
const COR_FAIXA = "#e8efe6A5";
const MAX_LEITURAS_VISIVEIS = 10;
let instanciaGraficoTempReal = null;

function obterTemperaturaSegura(valor, padrao) {
  if(valor === null || valor === undefined){
    return padrao;
  }

  let numero = Number(valor);
  if(isNaN(numero)){
    return padrao;
  }

  return numero;
}

function obterOuCriarCanvas() {
  let container = document.getElementById("grafico-temperatura-real-container");
  if(!container){
    return null;
  }

  let canvas = document.getElementById("temperaturaRealGrafico");
  if(!canvas){
    container.innerHTML = '<canvas id="temperaturaRealGrafico"></canvas>';
    canvas = document.getElementById("temperaturaRealGrafico");
  }

  return canvas;
}

function atualizarCabecalhoELegenda(lote, cerveja, tanque, tempMin, tempMax) {
  let tituloEl = document.querySelector(".lote-grafico-principal .painel__titulo");
  let subtituloEl = document.getElementById("grafico-real-subtitulo");
  let controlesEl = document.getElementById("grafico-real-controles");

  let codigoLote = "";
  if(lote && lote.codigo){
    codigoLote = lote.codigo;
  }

  let nomeCerveja = "";
  if(cerveja && cerveja.nome){
    nomeCerveja = cerveja.nome;
  }

  let nomeTanque = "Tanque não informado";
  if(tanque && tanque.nome){
    nomeTanque = tanque.nome;
  }

  if(tituloEl){
    let sufixoLote = "";
    if(codigoLote){
      sufixoLote = " — Lote " + codigoLote;
      if(nomeCerveja){
        sufixoLote = sufixoLote + " (" + nomeCerveja + ")";
      }
    }
    tituloEl.innerHTML = "Temperatura real × Faixa ideal" + sufixoLote + ' <span class="tag"><span class="tag__ponto"></span>AO VIVO</span>';
  }

  if(subtituloEl){
    subtituloEl.textContent = "Leitura a cada 2 segundos · janela das últimas " + MAX_LEITURAS_VISIVEIS + " leituras (tanque " +
    nomeTanque + ")";
  }

  if(controlesEl){
    let faixaTexto = formatarNumeroPtBr(tempMin, 1) + "–" + formatarNumeroPtBr(tempMax, 1) + "°C";
    controlesEl.innerHTML =
      '<div class="grafico-legenda-linha">' + 
        '<span class="grafico-legenda-item">' +
          '<span class="grafico-legenda-traco"></span>' +
          "Temperatura real" +
        "</span>" +
        '<span class="grafico-legenda-item">' +
          '<span class="grafico-legenda-caixa"></span>' +
          "Faixa ideal " + faixaTexto +
        "</span>" +
      "</div>";
  }
}

export function renderizarGraficoTemperaturaReal(lote, cerveja, tanque, leiturasLote) {
  let listaOrigem = [];
  if(leiturasLote){
    listaOrigem = leiturasLote;
  }

  let inicioCorte = Math.max(0, listaOrigem.length - MAX_LEITURAS_VISIVEIS);
  let listaLeituras = [];
  for(let i = inicioCorte; i < listaOrigem.length; i++){
    listaLeituras.push(listaOrigem[i]);
  }

  let minInformado = null;
  let maxInformado = null;
  if(cerveja){
    minInformado = cerveja.temperatura_min;
    maxInformado = cerveja.temperatura_max;
  }

  let tempMin = obterTemperaturaSegura(minInformado, 18);
  let tempMax = obterTemperaturaSegura(maxInformado, 24);

  atualizarCabecalhoELegenda(lote, cerveja, tanque, tempMin, tempMax);

  let canvas = obterOuCriarCanvas();
  if(!canvas || typeof Chart === "undefined"){
    return;
  }

  if(instanciaGraficoTempReal){
    instanciaGraficoTempReal.destroy();
    instanciaGraficoTempReal = null;
  }

  let labels = [];
  let temperaturas = [];
  let faixaMaxArray = [];
  let faixaMinArray = [];

  for(let i = 0; i < listaLeituras.length; i++){
    let leitura = listaLeituras[i];
    let temp = Number(leitura.temperatura);

    if(!isNaN(temp)){
      let horario = "Leitura " + (i + 1);
      if(leitura.dt_medicao){
        horario = String(leitura.dt_medicao).slice(11, 19);
      }

      labels.push(horario);
      temperaturas.push(temp);
      faixaMaxArray.push(tempMax);
      faixaMinArray.push(tempMin);
    }
  }

  let intervalo = Math.abs(tempMax - tempMin);
  if(intervalo === 0){
    intervalo = 6;
  }

  let metadeIntervalo = intervalo / 2;
  let minEixoY = tempMin - metadeIntervalo;
  let maxEixoY = tempMax + metadeIntervalo;

  for(let i = 0; i < temperaturas.length; i++){
    if (temperaturas[i] < minEixoY) {
      minEixoY = Math.floor(temperaturas[i] - 1);
    }
    if(temperaturas[i] > maxEixoY){
      maxEixoY = Math.ceil(temperaturas[i] + 1);
    }
  }

  instanciaGraficoTempReal = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperatura real",
          data: temperaturas,
          borderColor: COR_LINHA,
          borderWidth: 2,
          pointBackgroundColor: COR_LINHA,
          pointBorderColor: COR_LINHA,
          pointRadius: 4,
          fill: false,
          tension: 0.1
        },
        {
          label: "Faixa máx.",
          data: faixaMaxArray,
          backgroundColor: COR_FAIXA,
          borderWidth: 0,
          pointRadius: 0,
          fill: "+1"
        },
        {
          label: "Faixa mín.",
          data: faixaMinArray,
          borderWidth: 0,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 25, right: 20 }
      },
      scales: {
        y: {
          min: minEixoY,
          max: maxEixoY,
          ticks: {
            stepSize: metadeIntervalo,
            callback: function (value) {
              return formatarNumeroPtBr(value, 1);
            }
          }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              let rotulo = "";
              if (context.dataset && context.dataset.label) {
                rotulo = context.dataset.label;
              }

              let valor = "";
              if (
                context.parsed &&
                context.parsed.y !== null &&
                context.parsed.y !== undefined
              ) {
                valor = formatarNumeroPtBr(context.parsed.y, 1) + "°C";
              }

              if (rotulo) {
                return rotulo + ": " + valor;
              }
              return valor;
            }
          }
        }
      }
    }
  });
}

window.renderizarGraficoTemperaturaReal = renderizarGraficoTemperaturaReal;
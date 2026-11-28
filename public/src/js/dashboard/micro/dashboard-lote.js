import { DATA_REFERENCIA, unidadesData, lotesData, producoesData, tanquesData, leiturasSensoresData, alertasData, tiposAlertaData } from "../../MOCK_DATA/mock_data.js";
import { formatarNumeroPtBr, buscarCervejaPorId, buscarLeituraPorId } from "../funcoes-globais.js";
import { renderizarGraficoTemperaturaReal } from "../micro/grafico-temperatura-real.js";
import { renderizarGraficoHistoricoLote } from "../micro/grafico-historico-lote.js";
import { preencherDetalhesLotePopup, configurarEventosPopupLote } from "../micro/popup-detalhes-lote.js";

// ============================================================
// FUNÇÕES AUXILIARES DO DASHBOARD DO LOTE
// ============================================================

function buscarLotePorId(idLote) {
  for(let i = 0; i < lotesData.length; i++){
    if(String(lotesData[i].id) === String(idLote)){
      return lotesData[i];
    }
  }
  return null;
}

function buscarUnidade(idUnidade) {
  for(let i = 0; i < unidadesData.length; i++){
    if(unidadesData[i].id === idUnidade){
      return unidadesData[i];
    }
  }
  return null;
}

function buscarTanque(idTanque) {
  for(let i = 0; i < tanquesData.length; i++){
    if(tanquesData[i].id === idTanque){
      return tanquesData[i];
    }
  }
  return null;
}

function buscarTipoAlertaDescricao(fkTipoAlerta) {
  for(let i = 0; i < tiposAlertaData.length; i++){
    if(tiposAlertaData[i].id === fkTipoAlerta){
      return tiposAlertaData[i].nome;
    }
  }
  return null;
}

function buscarProducaoDoLote(idLote) {
  let producaoFallback = null;

  for(let i = 0; i < producoesData.length; i++){
    if(producoesData[i].fk_lote === idLote){
      if(producoesData[i].dt_saida === null){
        return producoesData[i];
      }
      producaoFallback = producoesData[i];
    }
  }
  return producaoFallback;
}

function buscarLeiturasDoLote(idLote, idTanque) {
  let leituras = [];

  for(let i = 0; i < leiturasSensoresData.length; i++){
    let leitura = leiturasSensoresData[i];
    let mesmoLote = leitura.fk_lote === idLote;
    let mesmoTanque = false;

    if(idTanque === null || idTanque === undefined){
      mesmoTanque = true;
    }else if(leitura.fk_tanque === idTanque){
      mesmoTanque = true;
    }

    if(mesmoLote && mesmoTanque){
      leituras.push(leitura);
    }
  }

  leituras.sort(function (a, b) {
    return new Date(a.dt_medicao) - new Date(b.dt_medicao);
  });

  return leituras;
}

function formatarNomeCerveja(cerveja) {
  if(!cerveja){
    return "Receita não informada";
  }

  if(cerveja.nome === "IPA"){
    return "India Pale Ale (IPA)";
  }
  return cerveja.nome;
}

// ============================================================
// PASSO 1 — TOPO DO DASHBOARD DO LOTE
// ============================================================

function preencherSelectLotes(loteSelecionadoId) {
  let selectEl = document.getElementById("lote");

  if(!selectEl){
    return;
  }

  let opcoesHTML = "";

  for(let i = 0; i < lotesData.length; i++){
    let lote = lotesData[i];
    let cerveja = buscarCervejaPorId(lote.fk_cerveja);

    let nomeCerveja = "";
    if(cerveja && cerveja.nome){
      nomeCerveja = cerveja.nome;
    }

    let selected = "";
    if(String(lote.id) === String(loteSelecionadoId)){
      selected = " selected";
    }

    let sufixoCerveja = "";
    if(nomeCerveja){
      sufixoCerveja = " · " + nomeCerveja;
    }

    opcoesHTML =
    opcoesHTML + '<option value="' +
    lote.id + '"' +
    selected + ">Lote " +
    lote.codigo + sufixoCerveja + "</option>";
  }
  selectEl.innerHTML = opcoesHTML;
}

function atualizarTopo(lote, cerveja, unidade, producao, tanque) {
  let tituloEl = document.getElementById("lote-titulo");
  let subtituloEl = document.getElementById("lote-subtitulo");
  let badgesEl = document.getElementById("lote-badges");

  if(tituloEl){
    tituloEl.textContent = "Lote " + lote.codigo;
  }

  if(subtituloEl){
    subtituloEl.textContent = formatarNomeCerveja(cerveja);
  }

  if(badgesEl){
    let badges = [];

    let tanqueTexto = "";
    if(tanque && tanque.nome){
      tanqueTexto = tanque.nome;
    }

    let unidadeTexto = "";
    if(unidade && unidade.nome){
      unidadeTexto = unidade.nome;
    }

    if(tanqueTexto && unidadeTexto){
      badges.push(tanqueTexto + " · " + unidadeTexto);
    } else if (tanqueTexto) {
      badges.push(tanqueTexto);
    } else if (unidadeTexto) {
      badges.push(unidadeTexto);
    }

    if(cerveja && cerveja.temperatura_min !== null && cerveja.temperatura_min !== undefined && cerveja.temperatura_max !== null && cerveja.temperatura_max !== undefined){
      badges.push("Faixa " + cerveja.temperatura_min + "–" + cerveja.temperatura_max + " °C");
    }

    let badgesHTML = "";
    for(let i = 0; i < badges.length; i++){
      badgesHTML = badgesHTML + '<span class="badge">' + badges[i] + "</span>";
    }
    badgesEl.innerHTML = badgesHTML;
  }
}

// ============================================================
// PASSO 2 — KPIs DA COLUNA LATERAL
// ============================================================

function buscarAlertaAbertoDoLote(lote, leiturasLote) {
  let alertaMaisRecente = null;

  for(let i = 0; i < alertasData.length; i++){
    let alerta = alertasData[i];

    if(alerta.dt_resolucao === null){
      let leitura = buscarLeituraPorId(alerta.fk_leitura);
      let pertenceAoLote = false;

      if(leitura && leitura.fk_lote === lote.id){
        pertenceAoLote = true;
      }else{
        for(let j = 0; j < leiturasLote.length; j++){
          if(leiturasLote[j].id === alerta.fk_leitura){
            pertenceAoLote = true;
            break;
          }
        }
      }

      if(pertenceAoLote){
        if(alertaMaisRecente === null || new Date(alerta.dt_alerta) > new Date(alertaMaisRecente.dt_alerta)){
          alertaMaisRecente = alerta;
        }
      }
    }
  }
  return alertaMaisRecente;
}

function atualizarKPIAlerta(lote, cerveja, leiturasLote) {
  let valorEl = document.getElementById("kpi-alerta-valor");
  let tagsEl = document.getElementById("kpi-alerta-tags");
  let rodapeEl = document.getElementById("kpi-alerta-rodape");

  if(!valorEl || !tagsEl || !rodapeEl) {return;}

  let cardAlertaEl = valorEl.closest(".kpi-card");
  let alertaAberto = buscarAlertaAbertoDoLote(lote, leiturasLote);

  if(!alertaAberto){
    if(cardAlertaEl){
      cardAlertaEl.classList.remove("kpi-card--alerta");
    }
    valorEl.innerHTML = "<strong>Estável</strong>";
    tagsEl.innerHTML = "";
    rodapeEl.textContent = "Nenhum alerta pendente";
    return;
  }

  if(cardAlertaEl){
    cardAlertaEl.classList.add("kpi-card--alerta");
  }

  let leituraAlerta = buscarLeituraPorId(alertaAberto.fk_leitura);

  let tempAlerta = null;
  if(leituraAlerta && leituraAlerta.temperatura !== undefined){
    tempAlerta = Number(leituraAlerta.temperatura);
  }

  let tempMin = null;
  let tempMax = null;
  if(cerveja){
    tempMin = Number(cerveja.temperatura_min);
    tempMax = Number(cerveja.temperatura_max);
  }

  let tituloAlerta = "Acima do ideal";
  if(alertaAberto.fk_tipo_alerta === 1){
    tituloAlerta = "Abaixo do ideal";
  }

  valorEl.innerHTML = "<strong>" + tituloAlerta + "</strong>";

  let tagTexto = "";
  if(tempAlerta !== null && !isNaN(tempAlerta)){
    if(alertaAberto.fk_tipo_alerta === 2 && tempMax !== null && !isNaN(tempMax)){
      let diffAcima = Math.max(0, tempAlerta - tempMax);
      tagTexto = "+" + formatarNumeroPtBr(diffAcima, 1) + " °C acima do limite · " + formatarNumeroPtBr(tempAlerta, 1) + " °C";
    }else if(alertaAberto.fk_tipo_alerta === 1 && tempMin !== null && !isNaN(tempMin)){
      let diffAbaixo = Math.max(0, tempMin - tempAlerta);
      tagTexto = "-" + formatarNumeroPtBr(diffAbaixo, 1) + " °C abaixo do limite · " + formatarNumeroPtBr(tempAlerta, 1) + " °C";
    }else{
      tagTexto = formatarNumeroPtBr(tempAlerta, 1) + " °C";
    }
  }

  if(tagTexto){
    tagsEl.innerHTML = '<span class="tag"><span class="tag__ponto tag__ponto--alerta"></span>' + tagTexto + "</span>";
  }else{
    tagsEl.innerHTML = "";
  }

  let horaAlerta = "";
  if(alertaAberto.dt_alerta){
    horaAlerta = String(alertaAberto.dt_alerta).slice(11, 19);
  }

  if(horaAlerta){
    rodapeEl.textContent = "desde " + horaAlerta + " · aguardando revisão";
  }else{
    rodapeEl.textContent = "aguardando revisão";
  }
}

function atualizarKPIAderencia(lote, cerveja, leiturasLote) {
  let valorEl = document.getElementById("kpi-aderencia-valor");
  let barraEl = document.getElementById("kpi-aderencia-barra");
  let rodapeEl = document.getElementById("kpi-aderencia-rodape");

  if(!valorEl || !barraEl || !rodapeEl) {return;}

  if(!cerveja || leiturasLote.length === 0){
    valorEl.innerHTML = "<strong>—</strong>";
    barraEl.style.width = "0%";
    rodapeEl.textContent = "Lote " + lote.codigo + " · sem leituras";
    return;
  }

  let tempMin = Number(cerveja.temperatura_min);
  let tempMax = Number(cerveja.temperatura_max);
  let totalValidas = 0;
  let dentroFaixa = 0;

  for(let i = 0; i < leiturasLote.length; i++){
    let temp = Number(leiturasLote[i].temperatura);
    if(!isNaN(temp)){
      totalValidas = totalValidas + 1;
      if(temp >= tempMin && temp <= tempMax){
        dentroFaixa = dentroFaixa + 1;
      }
    }
  }

  if(totalValidas === 0){
    valorEl.innerHTML = "<strong>—</strong>";
    barraEl.style.width = "0%";
    rodapeEl.textContent = "Lote " + lote.codigo + " · sem leituras";
    return;
  }

  let percentualExato = (dentroFaixa / totalValidas) * 100;
  let percentualArredondado = Math.round(percentualExato * 10) / 10;
  let larguraBarra = Math.max(0, Math.min(100, percentualExato));

  valorEl.innerHTML = "<strong>" + formatarNumeroPtBr(percentualArredondado, 1) + "%</strong>";
  barraEl.style.width = larguraBarra + "%";
  rodapeEl.textContent = "Lote " + lote.codigo + " · até agora";
}

function atualizarKPIProgresso(lote, cerveja) {
  let valorEl = document.getElementById("kpi-progresso-valor");
  let barraEl = document.getElementById("kpi-progresso-barra");
  let rodapeEl = document.getElementById("kpi-progresso-rodape");

  if(!valorEl || !barraEl || !rodapeEl){
    return;
  }

  let totalDias = 14;
  if(cerveja && cerveja.tempo_fermentacao_dias){
    totalDias = Number(cerveja.tempo_fermentacao_dias);
  }

  let dataBase = new Date(DATA_REFERENCIA);
  let dataInicio = new Date(lote.dt_inicio);

  let diaAtual = Math.floor((dataBase - dataInicio) / (1000 * 60 * 60 * 24)) + 1;

  if(isNaN(diaAtual) || diaAtual < 1){
    diaAtual = 1;
  }

  if(diaAtual > totalDias){
    diaAtual = totalDias;
  }

  let percentual = 0;
  if(totalDias > 0){
    percentual = Math.round((diaAtual / totalDias) * 100);
  }

  let larguraBarra = Math.max(0, Math.min(100, percentual));

  valorEl.innerHTML = "<strong>" + diaAtual + "</strong><span>de " + totalDias + " Dias</span>";
  barraEl.style.width = larguraBarra + "%";
  rodapeEl.textContent = "Lote " + lote.codigo + " · " + percentual + "% de progresso";
}

function atualizarKPIs(lote, cerveja, leiturasLote) {
  atualizarKPIAlerta(lote, cerveja, leiturasLote);
  atualizarKPIAderencia(lote, cerveja, leiturasLote);
  atualizarKPIProgresso(lote, cerveja);
}

// ============================================================
// PASSO 4 — TABELA DE HISTÓRICO DE DESVIOS
// ============================================================

function buscarAlertasDoLote(lote, leiturasLote) {
  let alertasDoLote = [];

  for(let i = 0; i < alertasData.length; i++){
    let alerta = alertasData[i];
    let leitura = buscarLeituraPorId(alerta.fk_leitura);
    let pertenceAoLote = false;

    if(leitura && leitura.fk_lote === lote.id){
      pertenceAoLote = true;
    }else{
      for(let j = 0; j < leiturasLote.length; j++){
        if(leiturasLote[j].id === alerta.fk_leitura){
          pertenceAoLote = true;
          break;
        }
      }
    }

    if(pertenceAoLote){
      alertasDoLote.push({
        alerta: alerta,
        leitura: leitura
      });
    }
  }

  alertasDoLote.sort(function (a, b) {
    return new Date(b.alerta.dt_alerta) - new Date(a.alerta.dt_alerta);
  });

  return alertasDoLote;
}

function formatarInicioDuasLinhas(dtAlerta) {
  if(!dtAlerta){
    return "—";
  }

  let dataObj = new Date(dtAlerta);
  let horaTexto = String(dtAlerta).slice(11, 19);

  if(isNaN(dataObj.getTime())){
    if(horaTexto){
      return horaTexto;
    }
    return "—";
  }

  let dataFormatada = dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return dataFormatada + "<br>" + horaTexto;
}

function formatarTipoDuasLinhas(alerta) {
  if(alerta.fk_tipo_alerta === 1){
    return "Temperatura<br>abaixo do ideal";
  }

  if(alerta.fk_tipo_alerta === 2){
    return "Temperatura<br>acima do ideal";
  }

  let descricao = buscarTipoAlertaDescricao(alerta.fk_tipo_alerta);
  if(descricao){
    return descricao;
  }

  return "Desvio";
}

function formatarDuracaoTabela(alerta) {
  if(!alerta || !alerta.dt_alerta){
    return "—";
  }

  if(alerta.dt_resolucao === null){
    return "Em aberto";
  }

  let inicioMs = new Date(alerta.dt_alerta).getTime();
  let fimMs = new Date(alerta.dt_resolucao).getTime();

  if(isNaN(inicioMs) || isNaN(fimMs) || fimMs < inicioMs){
    return "—";
  }

  let minutos = Math.round((fimMs - inicioMs) / 60000);

  if(minutos < 60){
    return minutos + " min";
  }

  let horas = Math.floor(minutos / 60);
  let restoMinutos = minutos % 60;

  if(restoMinutos === 0){
    return horas + "h";
  }

  let minutosFormatados = String(restoMinutos);
  if(restoMinutos < 10){
    minutosFormatados = "0" + restoMinutos;
  }
  return horas + "h" + minutosFormatados;
}

function atualizarTabelaDesvios(lote, leiturasLote) {
  let corpoTabelaEl = document.getElementById("historico-desvios-corpo");

  if(!corpoTabelaEl){return;}

  let registros = buscarAlertasDoLote(lote, leiturasLote);

  if(registros.length === 0){
    corpoTabelaEl.innerHTML = '<tr><td colspan="5">Nenhum desvio registrado para este lote.</td></tr>';
    return;
  }

  let linhasHTML = "";

  for(let i = 0; i < registros.length; i++){
    let alerta = registros[i].alerta;
    let leitura = registros[i].leitura;
    let inicioHTML = formatarInicioDuasLinhas(alerta.dt_alerta);
    let tipoHTML = formatarTipoDuasLinhas(alerta);
    let picoHTML = "—";

    if(leitura && leitura.temperatura !== undefined && !isNaN(Number(leitura.temperatura))){
      picoHTML = "<strong>" + formatarNumeroPtBr(Number(leitura.temperatura), 1) + "°C</strong>";
    }

    let duracaoTexto = formatarDuracaoTabela(alerta);
    let estaAberto = alerta.dt_resolucao === null;
    let statusTexto = "Resolvido";
    let statusClasse = "badge-status-desvio badge-status-desvio--resolvido";
    
    if(estaAberto){
      statusTexto = "Aberto";
      statusClasse = "badge-status-desvio badge-status-desvio--aberto";
    }

    linhasHTML =
    linhasHTML + "<tr>" + "<td>" +
    inicioHTML + "</td>" + "<td>" +
    tipoHTML + "</td>" + "<td>" +
    picoHTML + "</td>" + "<td>" +
    duracaoTexto + "</td>" + '<td><span class="' +
    statusClasse + '">' +
    statusTexto + "</span></td>" + "</tr>";
  }
  corpoTabelaEl.innerHTML = linhasHTML;
}

// ============================================================
// CONTROLE GERAL DO DASHBOARD DO LOTE
// ============================================================

function obterLoteInicial() {
  let params = new URLSearchParams(window.location.search);
  let loteParam = params.get("lote");

  if(loteParam && buscarLotePorId(loteParam)){
    return loteParam;
  }

  if(lotesData.length > 0){
    return lotesData[0].id;
  }
  return null;
}

function atualizarDashboardLote(idLote) {
  let lote = buscarLotePorId(idLote);

  if(!lote && lotesData.length > 0){
    lote = lotesData[0];
  }

  if(!lote){return;}

  let cerveja = buscarCervejaPorId(lote.fk_cerveja);
  let unidade = buscarUnidade(lote.fk_unidade);
  let producao = buscarProducaoDoLote(lote.id);
  let tanque = null;

  if(producao){
    tanque = buscarTanque(producao.fk_tanque);
  }

  let idTanque = null;
  if(tanque){
    idTanque = tanque.id;
  }

  let leiturasLote = buscarLeiturasDoLote(lote.id, idTanque);

  atualizarTopo(lote, cerveja, unidade, producao, tanque);
  atualizarKPIs(lote, cerveja, leiturasLote);
  renderizarGraficoTemperaturaReal(lote, cerveja, tanque, leiturasLote);
  renderizarGraficoHistoricoLote(lote, cerveja);
  atualizarTabelaDesvios(lote, leiturasLote);
  preencherDetalhesLotePopup(lote, cerveja, unidade, tanque);
}

function inicializarDashboardLote() {
  let loteInicial = obterLoteInicial();

  if(!loteInicial){return;}

  preencherSelectLotes(loteInicial);
  atualizarDashboardLote(loteInicial);
  configurarEventosPopupLote();

  let selectEl = document.getElementById("lote");
  if(selectEl){
    selectEl.addEventListener("change", function (event) {
      atualizarDashboardLote(event.target.value);
    });
  }
}

inicializarDashboardLote();
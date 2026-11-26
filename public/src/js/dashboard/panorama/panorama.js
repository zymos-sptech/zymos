import userData from "../../MOCK_DATA/user.js";

import {
  DATA_REFERENCIA,
  empresaData,
  unidadesData,
  tanquesData,
  lotesData,
  producoesData,
  leiturasSensoresData,
  alertasData
} from "../../MOCK_DATA/mock_data.js";

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function buscarLeitura(idLeitura) {
  for (let i = 0; i < leiturasSensoresData.length; i++) {
    if (leiturasSensoresData[i].id === idLeitura) {
      return leiturasSensoresData[i];
    }
  }

  return null;
}

function buscarTanque(idTanque) {
  for (let i = 0; i < tanquesData.length; i++) {
    if (tanquesData[i].id === idTanque) {
      return tanquesData[i];
    }
  }

  return null;
}

function buscarUnidade(idUnidade) {
  for (let i = 0; i < unidadesData.length; i++) {
    if (unidadesData[i].id === idUnidade) {
      return unidadesData[i];
    }
  }

  return null;
}

function buscarLote(idLote) {
  for (let i = 0; i < lotesData.length; i++) {
    if (lotesData[i].id === idLote) {
      return lotesData[i];
    }
  }

  return null;
}

// No V4, a produção está ativa quando dt_saida é NULL.
function buscarProducaoTanque(idTanque) {
  for (let i = 0; i < producoesData.length; i++) {
    if (
      producoesData[i].fk_tanque === idTanque &&
      producoesData[i].dt_saida === null
    ) {
      return producoesData[i];
    }
  }

  return null;
}

// No V4:
// alerta -> leitura_sensor -> tanque
// A leitura já possui fk_tanque. Não precisamos passar pelo sensor.
function buscarTanqueDoAlerta(alerta) {
  let leitura = buscarLeitura(alerta.fk_leitura);

  if (leitura === null) {
    return null;
  }

  return buscarTanque(leitura.fk_tanque);
}

// No V4, o volume está armazenado em lote.volume_litros.
function buscarVolumeTanque(idTanque) {
  let producao = buscarProducaoTanque(idTanque);

  if (producao === null) {
    return 0;
  }

  let lote = buscarLote(producao.fk_lote);

  if (lote === null) {
    return 0;
  }

  return lote.volume_litros;
}

// No V4, o tipo do alerta é identificado por fk_tipo_alerta.
// Conforme os INSERTs de domínio:
// 1 = Temperatura abaixo do limite
// 2 = Temperatura acima do limite
function buscarTipoAlerta(alerta) {
  if (alerta.fk_tipo_alerta === 2) {
    return "acima";
  }

  if (alerta.fk_tipo_alerta === 1) {
    return "abaixo";
  }

  return "abaixo";
}

// ============================================================
// ATUALIZAÇÃO DO PANORAMA
// ============================================================

function atualizarPanorama() {

  let agora = new Date(DATA_REFERENCIA);
  let MS_POR_MINUTO = 60000;
  let JANELA_24H_MS = 24 * 60 * 60 * 1000;
  let nomeUsuarioTopo = "Fernanda Caramico";

  if (
    userData &&
    userData.nome &&
    userData.nome.trim() !== "" &&
    userData.nome.trim() !== "Usuário Padrão"
  ) {
    nomeUsuarioTopo = userData.nome;
  } else if (sessionStorage.getItem("NOME_COMPLETO")) {
    nomeUsuarioTopo = sessionStorage.getItem("NOME_COMPLETO");
  }

  let primeiroNome = nomeUsuarioTopo.trim().split(" ")[0];
  let nomeEmpresa = empresaData.nome;

  if (
    userData &&
    userData.nome_empresa &&
    userData.nome_empresa.trim() !== "" &&
    userData.nome_empresa.trim() !== "Sem empresa"
  ) {
    nomeEmpresa = userData.nome_empresa;
  }

  let opcoesData = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  };

  let dataFormatada = agora.toLocaleDateString("pt-BR", opcoesData);

  document.getElementById("topo-titulo").textContent = `Olá, ${primeiroNome}!`;

  document.getElementById("topo-subtitulo").textContent =
    `Bem-vindo(a) ao painel da ${nomeEmpresa} · ${dataFormatada}`;

  // ============================================================
  // PLANO DA EMPRESA
  // ============================================================

  let badgePlanoEl = document.getElementById("badge-plano");

  if (badgePlanoEl) {
    let planoTexto = "";

    if (
      userData &&
      userData.plano &&
      userData.plano.trim() !== ""
    ) {
      planoTexto = `Plano ${userData.plano}`;

    } else if (
      empresaData &&
      empresaData.plano &&
      empresaData.plano.trim() !== ""
    ) {
      planoTexto = `Plano ${empresaData.plano}`;
    }

    if (planoTexto !== "") {
      badgePlanoEl.textContent = planoTexto;
      badgePlanoEl.hidden = false;
    } else {
      badgePlanoEl.hidden = true;
    }
  }

  // ============================================================
  // UNIDADES ATIVAS E TANQUES
  // ============================================================

  let unidadesAtivas = [];
  let tanquesAtivos = [];

  // No V4, status_unidade:
  // 1 = Solicitada / Em Análise
  // 2 = Aguardando Setup Hardware
  // 3 = Ativa
  // 4 = Inativa

  for (let i = 0; i < unidadesData.length; i++) {
    if (unidadesData[i].fk_status_unidade === 3) {
      unidadesAtivas.push(unidadesData[i]);
    }
  }

  // Considera os tanques pertencentes às unidades ativas.
  for (let i = 0; i < tanquesData.length; i++) {
    for (let u = 0; u < unidadesAtivas.length; u++) {
      if (tanquesData[i].fk_unidade === unidadesAtivas[u].id) {
        tanquesAtivos.push(tanquesData[i]);
      }
    }
  }

  let totalTanquesGeral = tanquesAtivos.length;

  document.getElementById("badge-unidades").textContent =
    `${unidadesAtivas.length} unidades ativas`;

  document.getElementById("badge-tanques").textContent =
    `${totalTanquesGeral} tanques monitorados`;

  // ============================================================
  // PROCESSAMENTO DOS ALERTAS
  // ============================================================

  let abertos = [];
  let resolvidos = [];
  let alertasUltimas24h = [];

  let abertos24hCount = 0;
  let resolvidos24hCount = 0;

  let alertaMaisAntigoGeral = null;

  for (let i = 0; i < alertasData.length; i++) {

    let alerta = alertasData[i];

    // No V4, o status é identificado pela data de resolução.
    // Sem data de resolução = alerta aberto.
    if (alerta.dt_resolucao === null) {

      abertos.push(alerta);

      if (alertaMaisAntigoGeral === null) {
        alertaMaisAntigoGeral = alerta;

      } else if (
        new Date(alerta.dt_alerta) <
        new Date(alertaMaisAntigoGeral.dt_alerta)
      ) {
        alertaMaisAntigoGeral = alerta;
      }

    } else {
      resolvidos.push(alerta);
    }

    let inicioMs = new Date(alerta.dt_alerta).getTime();
    let diferenca = agora.getTime() - inicioMs;

    // Verifica se o alerta ocorreu nas últimas 24 horas.
    if (
      !isNaN(inicioMs) &&
      diferenca >= 0 &&
      diferenca <= JANELA_24H_MS
    ) {

      alertasUltimas24h.push(alerta);

      if (alerta.dt_resolucao === null) {
        abertos24hCount++;

      } else {
        resolvidos24hCount++;
      }
    }
  }

  // ============================================================
  // PROCESSAMENTO DAS UNIDADES E TANQUES
  // ============================================================

  let tanquesEmUsoGeral = 0;
  let unidadesEmDesvioCount = 0;
  let unidadesProcessadas = [];

  for (let i = 0; i < unidadesAtivas.length; i++) {

    let unidade = unidadesAtivas[i];

    let tanquesUsoUnidade = 0;
    let tanquesEmDesvioDestaUnidade = [];
    let totalDesvios24hUnidade = 0;

    // ----------------------------------------------------------
    // Verifica os tanques em uso da unidade.
    // ----------------------------------------------------------

    for (let t = 0; t < tanquesAtivos.length; t++) {

      let tanque = tanquesAtivos[t];

      if (tanque.fk_unidade === unidade.id) {

        // No V4, status_tanque:
        // 1 = Disponível
        // 2 = Em uso
        // 3 = Em limpeza
        // 4 = Manutenção
        // 5 = Indisponível

        if (tanque.fk_status_tanque === 2) {
          tanquesEmUsoGeral++;
          tanquesUsoUnidade++;
        }
      }
    }

    // ----------------------------------------------------------
    // Localiza os alertas abertos da unidade.
    // ----------------------------------------------------------

    let alertasAbertosUnidades = [];

    for (let a = 0; a < abertos.length; a++) {

      let alerta = abertos[a];
      let tanqueAlerta = buscarTanqueDoAlerta(alerta);

      if (
        tanqueAlerta !== null &&
        tanqueAlerta.fk_unidade === unidade.id
      ) {

        alertasAbertosUnidades.push(alerta);

        let tanqueJaAdicionado = false;

        // Evita adicionar o mesmo tanque mais de uma vez.
        for (
          let d = 0;
          d < tanquesEmDesvioDestaUnidade.length;
          d++
        ) {

          if (
            tanquesEmDesvioDestaUnidade[d].id === tanqueAlerta.id
          ) {
            tanqueJaAdicionado = true;
          }
        }

        if (!tanqueJaAdicionado) {

          let volumeTanque = buscarVolumeTanque(tanqueAlerta.id);
          let tipoAlerta = buscarTipoAlerta(alerta);

          tanquesEmDesvioDestaUnidade.push({
            id: tanqueAlerta.id,
            nome: tanqueAlerta.nome,
            tipo: tipoAlerta,
            volume: volumeTanque
          });
        }
      }
    }

    // ----------------------------------------------------------
    // Conta os desvios das últimas 24 horas da unidade.
    // ----------------------------------------------------------

    for (let a = 0; a < alertasUltimas24h.length; a++) {

      let tanqueAlerta = buscarTanqueDoAlerta(alertasUltimas24h[a]);

      if (
        tanqueAlerta !== null &&
        tanqueAlerta.fk_unidade === unidade.id
      ) {
        totalDesvios24hUnidade++;
      }
    }

    // ----------------------------------------------------------
    // Localiza o alerta aberto mais antigo da unidade.
    // ----------------------------------------------------------

    let minutosAntigos = null;
    let alertaMaisAntigoUnidade = null;

    for (let a = 0; a < alertasAbertosUnidades.length; a++) {

      let alerta = alertasAbertosUnidades[a];

      if (alertaMaisAntigoUnidade === null) {
        alertaMaisAntigoUnidade = alerta;

      } else if (
        new Date(alerta.dt_alerta) <
        new Date(alertaMaisAntigoUnidade.dt_alerta)
      ) {
        alertaMaisAntigoUnidade = alerta;
      }
    }

    if (alertaMaisAntigoUnidade !== null) {

      minutosAntigos = Math.floor(
        (agora - new Date(alertaMaisAntigoUnidade.dt_alerta)) /
        MS_POR_MINUTO
      );
    }

    // ----------------------------------------------------------
    // Verifica se a unidade possui algum tanque em desvio.
    // ----------------------------------------------------------

    let emDesvio = tanquesEmDesvioDestaUnidade.length > 0;

    if (emDesvio) {
      unidadesEmDesvioCount++;
    }

    // ----------------------------------------------------------
    // Calcula o volume total em risco da unidade.
    // ----------------------------------------------------------

    let volumeRisco = 0;

    for (let d = 0; d < tanquesEmDesvioDestaUnidade.length; d++) {
      volumeRisco += tanquesEmDesvioDestaUnidade[d].volume;
    }

    // ----------------------------------------------------------
    // Guarda os dados processados da unidade.
    // ----------------------------------------------------------

    unidadesProcessadas.push({

      id: unidade.id,
      nome: unidade.nome,
      totalTanques: unidade.quantidade_tanques,
      tanquesEmUso: tanquesUsoUnidade,
      tanquesEmDesvio: tanquesEmDesvioDestaUnidade,
      volumeEmRisco: volumeRisco,
      alertasAbertosCount: alertasAbertosUnidades.length,
      minutosDesdeMaisAntigos: minutosAntigos,
      emDesvio: emDesvio,
      totalDesvios: totalDesvios24hUnidade

    });
  }

  // ============================================================
  // KPI: UNIDADES
  // ============================================================

  let unidadesEstaveisCount =
    unidadesAtivas.length - unidadesEmDesvioCount;

  document.getElementById("kpi-unidades-valor").textContent =
    unidadesAtivas.length;

  document.getElementById("kpi-unidades-tags").innerHTML = `
  <span class="tag">
    <span class="tag__ponto"></span>
    ${unidadesEstaveisCount}
    ${unidadesEstaveisCount === 1 ? "estável" : "estáveis"}
  </span>
  <span class="tag ${unidadesEmDesvioCount > 0 ? "tag--alerta" : ""}">
    <span class="tag__ponto ${unidadesEmDesvioCount > 0 ? "tag__ponto--alerta" : ""}"></span>
    ${unidadesEmDesvioCount} com desvios
  </span>`;

  // ============================================================
  // KPI: OCUPAÇÃO DOS TANQUES
  // ============================================================

  let percentualOcupacao = 0;

  if (totalTanquesGeral > 0) {
    percentualOcupacao = Math.round(
      (tanquesEmUsoGeral / totalTanquesGeral) * 100
    );
  }

  document.getElementById("kpi-ocupacao-valor").textContent =
    tanquesEmUsoGeral;

  document.getElementById("kpi-ocupacao-complemento").textContent =
    ` de ${totalTanquesGeral} tanques`;

  document.getElementById("kpi-ocupacao-barra").style.width =
    `${percentualOcupacao}%`;

  document.getElementById("kpi-ocupacao-rodape").textContent =
    `${percentualOcupacao}% de ocupação`;

  // ============================================================
  // KPI: OCORRÊNCIAS NAS ÚLTIMAS 24 HORAS
  // ============================================================

  document.getElementById("kpi-ocorrencias-valor").textContent =
    alertasUltimas24h.length;

  document.getElementById("kpi-ocorrencias-tags").innerHTML = `
  <span class="tag">
    <span class="tag__ponto"></span>
    ${resolvidos24hCount} resolvidos
  </span>
  <span class="tag">
    <span class="tag__ponto tag__ponto--alerta"></span>
    ${abertos24hCount} em aberto
  </span>`;

  // ============================================================
  // KPI: ALERTAS ABERTOS
  // ============================================================

  let cardAlerta = document.getElementById("kpi-alerta");

  if (abertos.length > 0) {
    cardAlerta.classList.add("kpi-card--alerta");

  } else {
    cardAlerta.classList.remove("kpi-card--alerta");
  }

  let acimaCount = 0;
  let abaixoCount = 0;

  for (let i = 0; i < abertos.length; i++) {

    let tipoAlerta = buscarTipoAlerta(abertos[i]);

    if (tipoAlerta === "abaixo") {
      abaixoCount++;
    }

    if (tipoAlerta === "acima") {
      acimaCount++;
    }
  }

  document.getElementById("kpi-alerta-valor").textContent =
    abertos.length;

  document.getElementById("kpi-alerta-complemento").textContent =
    abertos.length === 1 ? "alerta" : "alertas";

  document.getElementById("kpi-alerta-tags").innerHTML = `
  ${acimaCount > 0 ? `
    <span class="tag tag--alerta">
      <span class="tag__ponto tag__ponto--alerta"></span>
      ${acimaCount} Acima do ideal
    </span>` : ""}
  ${abaixoCount > 0 ? `
    <span class="tag tag--alerta">
      <span class="tag__ponto tag__ponto--alerta"></span>
      ${abaixoCount} Abaixo do ideal
    </span>` : ""}
  `;

  if (alertaMaisAntigoGeral !== null) {

    let horaInicio = alertaMaisAntigoGeral.dt_alerta.slice(11, 19);

    document.getElementById("kpi-alerta-rodape").textContent =
      `Desde ${horaInicio} · aguardando revisão`;

  } else {

    document.getElementById("kpi-alerta-rodape").textContent =
      "Nenhum alerta pendente";
  }

  // ============================================================
  // TABELA: UNIDADES EM DESVIO
  // ============================================================

  let unidadesEmDesvioLista = [];

  for (let i = 0; i < unidadesProcessadas.length; i++) {

    if (unidadesProcessadas[i].emDesvio) {
      unidadesEmDesvioLista.push(unidadesProcessadas[i]);
    }
  }

  document.getElementById("contador-desvio").textContent =
    `Em desvio · ${unidadesEmDesvioLista.length}`;

  let tabelaHTML = "";

  for (let i = 0; i < unidadesEmDesvioLista.length; i++) {

    let u = unidadesEmDesvioLista[i];
    let tagsTanquesHTML = "";

    for (let t = 0; t < u.tanquesEmDesvio.length; t++) {

      let tanque = u.tanquesEmDesvio[t];
      let seta = "down";

      if (tanque.tipo === "acima") {
        seta = "up";
      }

      tagsTanquesHTML += `
      <span class="tag-tanque tag-tanque--${tanque.tipo}">
        <i class="fa-solid fa-arrow-${seta}"></i>
        <strong>${tanque.nome}</strong>
        ${tanque.tipo} do ideal
      </span>`;
    }

    let tempoMsg = "";

    if (u.minutosDesdeMaisAntigos !== null) {
      tempoMsg = `(há ${u.minutosDesdeMaisAntigos} min)`;
    }

    tabelaHTML += `
    <tr class="tabela__linha">
      <td>${u.nome}</td>
      <td>${u.volumeEmRisco.toLocaleString("pt-BR")} L</td>
      <td>
        ${u.alertasAbertosCount} em aberto ${tempoMsg}
      </td>
      <td>
        <span class="status status--desvio">
          Em desvio
        </span>
      </td>
      <td>
        <a class="tabela__link" href="./monitor-tanques.html?unidade=${u.id}">
          Ver tanques
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </td>
    </tr>
    <tr class="tabela__tanques">
      <td colspan="5">
        <div class="tabela__tanques-conteudo">
          ${tagsTanquesHTML}
        </div>
      </td>
    </tr>`;
  }

  if (unidadesEmDesvioLista.length === 0) {

    tabelaHTML = `
    <tr class="tabela__vazio">
      <td colspan="5">
        Nenhuma unidade em desvio no momento.
      </td>
    </tr>`;
  }

  document.getElementById("tabela-unidades-corpo").innerHTML =
    tabelaHTML;

  document.getElementById("tabela-rodape-resumo").innerHTML =

    `${unidadesEmDesvioLista.length} de ${unidadesAtivas.length} ` +

    `${unidadesAtivas.length === 1 ? "unidade" : "unidades"} em desvio · ` +

    `<strong>
      ${unidadesEstaveisCount}
      ${unidadesEstaveisCount === 1 ? "unidade estável" : "unidades estáveis"}
    </strong> ` +

    `${unidadesEstaveisCount === 1 ? "fica" : "ficam"} fora desta lista`;

  // ============================================================
  // GRÁFICO: DESVIOS POR UNIDADE
  // ============================================================

  let todasUnidadesOrdenadas = [];

  for (let i = 0; i < unidadesProcessadas.length; i++) {

    if (unidadesProcessadas[i].totalDesvios > 0) {
      todasUnidadesOrdenadas.push(unidadesProcessadas[i]);
    }
  }

  todasUnidadesOrdenadas.sort(function (a, b) {
    return b.totalDesvios - a.totalDesvios;
  });

  let maxDesvios = 0;

  for (let i = 0; i < todasUnidadesOrdenadas.length; i++) {

    if (todasUnidadesOrdenadas[i].totalDesvios > maxDesvios) {
      maxDesvios = todasUnidadesOrdenadas[i].totalDesvios;
    }
  }

  let listaDesviosEl = document.getElementById("lista-desvios");

  if (todasUnidadesOrdenadas.length === 0) {

    listaDesviosEl.innerHTML =
      `<p class="desvios-mais">Nenhuma unidade com ocorrências no período.</p>`;

  } else {

    let desviosHTML = "";

    for (let i = 0; i < todasUnidadesOrdenadas.length; i++) {

      let u = todasUnidadesOrdenadas[i];
      let larguraBarra = 0;

      if (maxDesvios > 0) {
        larguraBarra = Math.round(
          (u.totalDesvios / maxDesvios) * 100
        );
      }

      let isPrimeiro = i === 0 && u.totalDesvios > 0;
      let destaque = "";

      if (isPrimeiro) {
        destaque = " barra__preenchimento--destaque";
      }

      desviosHTML += `
      <div class="desvio-barra">
        <p class="desvio-barra__nome">
          ${u.nome}
        </p>
        <div class="desvio-barra__linha">
          <div class="barra barra--grossa">
            <div
              class="barra__preenchimento${destaque}"
              style="width: ${larguraBarra}%"
            ></div>
          </div>
          <span class="desvio-barra__contagem">
            ${u.totalDesvios}
          </span>
        </div>
      </div>`;
    }

    listaDesviosEl.innerHTML = desviosHTML;
  }

  // ============================================================
  // RODAPÉ DO GRÁFICO
  // ============================================================

  let desviosMaisEl = document.getElementById("desvios-mais");

  if (desviosMaisEl) {
    desviosMaisEl.hidden = true;
  }

  let demaisSemDesvioCount = 0;

  for (let i = 0; i < unidadesProcessadas.length; i++) {

    if (unidadesProcessadas[i].totalDesvios === 0) {
      demaisSemDesvioCount++;
    }
  }

  document.getElementById("desvios-demais").textContent =
    `Demais ${demaisSemDesvioCount} ` +
    `${demaisSemDesvioCount === 1 ? "unidade" : "unidades"} · 0 desvios`;

  // ============================================================
  // TEMPO MÉDIO DE RESOLUÇÃO
  // ============================================================

  let temposResolvidos = [];

  for (let i = 0; i < resolvidos.length; i++) {

    if (
      resolvidos[i].dt_resolucao &&
      resolvidos[i].dt_alerta
    ) {

      let diffMin = (
        new Date(resolvidos[i].dt_resolucao) -
        new Date(resolvidos[i].dt_alerta)
      ) / MS_POR_MINUTO;

      if (!isNaN(diffMin) && diffMin >= 0) {
        temposResolvidos.push(diffMin);
      }
    }
  }

  let tempoMedioMin = null;

  if (temposResolvidos.length > 0) {

    let somaTempos = 0;

    for (let t = 0; t < temposResolvidos.length; t++) {
      somaTempos += temposResolvidos[t];
    }

    tempoMedioMin = Math.round(
      somaTempos / temposResolvidos.length
    );
  }

  let tempoRespostaTexto = "—";

  if (tempoMedioMin !== null) {

    if (tempoMedioMin < 60) {

      tempoRespostaTexto = `${tempoMedioMin} min`;

    } else {

      let h = Math.floor(tempoMedioMin / 60);
      let m = tempoMedioMin % 60;

      if (m === 0) {

        tempoRespostaTexto = `${h}h`;

      } else {

        let mTexto = m;

        if (m < 10) {
          mTexto = "0" + m;
        }

        tempoRespostaTexto = `${h}h${mTexto}`;
      }
    }
  }

  document.getElementById("tempo-resposta").textContent =
    tempoRespostaTexto;
}

// Executa a atualização do panorama.
atualizarPanorama();
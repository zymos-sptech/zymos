/*
  PANORAMA
  Calcula e preenche todos os dados, KPIs, tabelas e painéis laterais de forma direta.
*/

import userData from "../../MOCK_DATA/user.js";
import { DATA_REFERENCIA, unidadesData, alertasData } from "../../MOCK_DATA/unidade.js";

function atualizarPanorama() {
  try {
    const agora = new Date(DATA_REFERENCIA);
    const MS_POR_MINUTO = 60000;

    const primeiroNome = userData.nome.trim().split(" ")[0];
    
    // Formatar data longa (ex: "quinta-feira, 29/10/2026")
    const opcoesData = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dataFormatada = agora.toLocaleDateString("pt-BR", opcoesData);

    document.getElementById("topo-titulo").textContent = `Olá, ${primeiroNome}!`;
    document.getElementById("topo-subtitulo").textContent = `Bem-vindo(a) ao painel da ${userData.nome_empresa} · ${dataFormatada}`;
    document.getElementById("badge-plano").textContent = `Plano ${userData.plano}`;
    document.getElementById("badge-unidades").textContent = `${unidadesData.length} unidades ativas`;

    // Calcular total de tanques para o badge do topo
    let totalTanquesGeral = 0;
    for (let i = 0; i < unidadesData.length; i++) {
      totalTanquesGeral += unidadesData[i].tanques.length;
    }
    document.getElementById("badge-tanques").textContent = `${totalTanquesGeral} tanques monitorados`;


    // ==========================================
    // 2. PROCESSAMENTO DE DADOS E ALERTAS
    // ==========================================
    let abertos = [];
    let resolvidos = [];

    for (let i = 0; i < alertasData.length; i++) {
      if (alertasData[i].status === "aberto") {
        abertos.push(alertasData[i]);
      } else if (alertasData[i].status === "resolvido") {
        resolvidos.push(alertasData[i]);
      }
    }

    // Ordenar alertas abertos do mais antigo para o mais novo
    abertos.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

    let tanquesEmUsoGeral = 0;
    let unidadesEmDesvioCount = 0;
    let unidadesProcessadas = [];

    for (let i = 0; i < unidadesData.length; i++) {
      let unidade = unidadesData[i];
      let tanquesUsoUnidade = 0;
      let tanquesEmDesvioDestaUnidade = [];
      let totalDesviosUnidade = 0;

      for (let t = 0; t < unidade.tanques.length; t++) {
        let tanque = unidade.tanques[t];
        if (tanque.status === "ocupado") {
          tanquesEmUsoGeral++;
          tanquesUsoUnidade++;
        }

        // Verificar se tem alerta aberto para este tanque
        let alertaAbertoTanque = null;
        for (let a = 0; a < abertos.length; a++) {
          if (abertos[a].unidadeId === unidade.id && abertos[a].tanque === tanque.nome) {
            alertaAbertoTanque = abertos[a];
            break;
          }
        }

        if (alertaAbertoTanque) {
          tanquesEmDesvioDestaUnidade.push({
            nome: tanque.nome,
            tipo: alertaAbertoTanque.tipo,
            volume: tanque.lote ? tanque.lote.volume : 0
          });
        }
      }

      // Contar total de desvios (abertos + resolvidos) desta unidade
      for (let a = 0; a < alertasData.length; a++) {
        if (alertasData[a].unidadeId === unidade.id) {
          totalDesviosUnidade++;
        }
      }

      let alertasAbertosUnidade = [];
      for (let a = 0; a < abertos.length; a++) {
        if (abertos[a].unidadeId === unidade.id) {
          alertasAbertosUnidade.push(abertos[a]);
        }
      }

      let minutosAntigo = null;
      if (alertasAbertosUnidade.length > 0) {
        minutosAntigo = Math.floor((agora - new Date(alertasAbertosUnidade[0].inicio)) / MS_POR_MINUTO);
      }

      let emDesvio = tanquesEmDesvioDestaUnidade.length > 0;
      if (emDesvio) unidadesEmDesvioCount++;

      let volumeRisco = 0;
      for (let d = 0; d < tanquesEmDesvioDestaUnidade.length; d++) {
        volumeRisco += tanquesEmDesvioDestaUnidade[d].volume;
      }

      unidadesProcessadas.push({
        id: unidade.id,
        nome: unidade.nome,
        totalTanques: unidade.tanques.length,
        tanquesEmUso: tanquesUsoUnidade,
        tanquesEmDesvio: tanquesEmDesvioDestaUnidade,
        volumeEmRisco: volumeRisco,
        alertasAbertosCount: alertasAbertosUnidade.length,
        minutosDesdeMaisAntigo: minutosAntigo,
        emDesvio: emDesvio,
        totalDesvios: totalDesviosUnidade
      });
    }

    const unidadesEstaveisCount = unidadesData.length - unidadesEmDesvioCount;


    // ==========================================
    // 3. PREENCHIMENTO DOS 4 KPIS
    // ==========================================
    // KPI 1: Unidades ativas
    document.getElementById("kpi-unidades-valor").textContent = unidadesData.length;
    document.getElementById("kpi-unidades-tags").innerHTML = `
      <span class="tag"><span class="tag__ponto"></span>${unidadesEstaveisCount} ${unidadesEstaveisCount === 1 ? 'estável' : 'estáveis'}</span>
      <span class="tag ${unidadesEmDesvioCount > 0 ? 'tag--alerta' : ''}"><span class="tag__ponto ${unidadesEmDesvioCount > 0 ? 'tag__ponto--alerta' : ''}"></span>${unidadesEmDesvioCount} com desvios</span>
    `;

    // KPI 2: Ocupação dos tanques
    let percentualOcupacao = totalTanquesGeral > 0 ? Math.round((tanquesEmUsoGeral / totalTanquesGeral) * 100) : 0;
    document.getElementById("kpi-ocupacao-valor").textContent = tanquesEmUsoGeral;
    document.getElementById("kpi-ocupacao-complemento").textContent = ` de ${totalTanquesGeral} tanques`;
    document.getElementById("kpi-ocupacao-barra").style.width = `${percentualOcupacao}%`;
    document.getElementById("kpi-ocupacao-rodape").textContent = `${percentualOcupacao}% de ocupação`;

    // KPI 3: Desvios no período
    document.getElementById("kpi-ocorrencias-valor").textContent = alertasData.length;
    document.getElementById("kpi-ocorrencias-tags").innerHTML = `
      <span class="tag"><span class="tag__ponto"></span>${resolvidos.length} resolvido</span>
      <span class="tag"><span class="tag__ponto tag__ponto--alerta"></span>${abertos.length} em aberto</span>
    `;

    // KPI 4: Alerta pendente
    const cardAlerta = document.getElementById("kpi-alerta");
    if (abertos.length > 0) {
      cardAlerta.classList.add("kpi-card--alerta");
    } else {
      cardAlerta.classList.remove("kpi-card--alerta");
    }

    let acimaCount = 0;
    let abaixoCount = 0;
    for (let i = 0; i < abertos.length; i++) {
      if (abertos[i].tipo === "acima") acimaCount++;
      if (abertos[i].tipo === "abaixo") abaixoCount++;
    }

    document.getElementById("kpi-alerta-valor").textContent = abertos.length;
    document.getElementById("kpi-alerta-complemento").textContent = abertos.length === 1 ? "alerta" : "alertas";
    document.getElementById("kpi-alerta-tags").innerHTML = `
      ${acimaCount > 0 ? `<span class="tag tag--alerta"><span class="tag__ponto tag__ponto--alerta"></span>${acimaCount} Acima do ideal</span>` : ""}
      ${abaixoCount > 0 ? `<span class="tag tag--alerta"><span class="tag__ponto tag__ponto--alerta"></span>${abaixoCount} Abaixo do ideal</span>` : ""}
    `;
    
    if (abertos.length > 0) {
      const horaInicio = abertos[0].inicio.slice(11, 19);
      document.getElementById("kpi-alerta-rodape").textContent = `Desde ${horaInicio} · aguardando revisão`;
    } else {
      document.getElementById("kpi-alerta-rodape").textContent = "Nenhum alerta pendente";
    }


    // ==========================================
    // 4. TABELA DE UNIDADES EM DESVIO
    // ==========================================
    let unidadesEmDesvioLista = [];
    for (let i = 0; i < unidadesProcessadas.length; i++) {
      if (unidadesProcessadas[i].emDesvio) {
        unidadesEmDesvioLista.push(unidadesProcessadas[i]);
      }
    }

    document.getElementById("contador-desvio").textContent = `Em desvio · ${unidadesEmDesvioLista.length}`;

    let tabelaHTML = "";
    for (let i = 0; i < unidadesEmDesvioLista.length; i++) {
      let u = unidadesEmDesvioLista[i];
      let tagsTanquesHTML = "";

      // Ordenar tanques em desvio pelo nome
      u.tanquesEmDesvio.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

      for (let t = 0; t < u.tanquesEmDesvio.length; t++) {
        let tanque = u.tanquesEmDesvio[t];
        let seta = tanque.tipo === "acima" ? "up" : "down";
        tagsTanquesHTML += `
          <span class="tag-tanque tag-tanque--${tanque.tipo}">
            <i class="fa-solid fa-arrow-${seta}"></i><strong>${tanque.nome}</strong> ${tanque.tipo} do ideal
          </span>`;
      }

      let tempoMsg = u.minutosDesdeMaisAntigo !== null ? `(há ${u.minutosDesdeMaisAntigo} min)` : "";

      tabelaHTML += `
        <tr class="tabela__linha">
          <td>${u.nome}</td>
          <td>${u.volumeEmRisco.toLocaleString("pt-BR")} L</td>
          <td>${u.alertasAbertosCount} em aberto ${tempoMsg}</td>
          <td><span class="status status--desvio">Em desvio</span></td>
          <td><a class="tabela__link" href="./dashboard-macro.html?unidade=${u.id}">Ver tanques <i class="fa-solid fa-arrow-right"></i></a></td>
        </tr>
        <tr class="tabela__tanques">
          <td colspan="6">
            <div class="tabela__tanques-conteudo">
              <span class="tabela__tanques-rotulo">Tanques em desvios</span>${tagsTanquesHTML}
            </div>
          </td>
        </tr>`;
    }

    if (unidadesEmDesvioLista.length === 0) {
      tabelaHTML = `<tr class="tabela__vazio"><td colspan="6">Nenhuma unidade em desvio no momento.</td></tr>`;
    }
    document.getElementById("tabela-unidades-corpo").innerHTML = tabelaHTML;

    document.getElementById("tabela-rodape-resumo").innerHTML = 
      `${unidadesEmDesvioLista.length} de ${unidadesData.length} ${unidadesData.length === 1 ? 'unidade' : 'unidades'} em desvio · ` +
      `<strong>${unidadesEstaveisCount} ${unidadesEstaveisCount === 1 ? 'unidade estável' : 'unidades estáveis'}</strong> ` +
      `${unidadesEstaveisCount === 1 ? 'fica' : 'ficam'} fora desta lista`;


    // ==========================================
    // 5. PAINEL LATERAL: ALERTAS EM ABERTO
    // ==========================================
    const listaAlertasEl = document.getElementById("lista-alertas");
    if (abertos.length === 0) {
      listaAlertasEl.innerHTML = `<li class="lista-alertas__vazio">Nenhum alerta em aberto.</li>`;
    } else {
      let alertasHTML = "";
      for (let i = 0; i < abertos.length; i++) {
        let a = abertos[i];
        let nomeUnidade = "—";
        for (let u = 0; u < unidadesData.length; u++) {
          if (unidadesData[u].id === a.unidadeId) {
            nomeUnidade = unidadesData[u].nome;
            break;
          }
        }
        let isUltimo = (i === abertos.length - 1);
        let horaAlerta = a.inicio.slice(11, 19);

        alertasHTML += `
          <li class="alerta-item${isUltimo ? " alerta-item--destaque" : ""}">
            <span class="alerta-item__ponto"></span>
            <div>
              <p class="alerta-item__titulo">${nomeUnidade} · ${a.tanque} — Temperatura ${a.tipo} do ideal</p>
              <p class="alerta-item__legenda">${a.temperatura ? a.temperatura.toFixed(1).replace('.', ',') + '°C às ' + horaAlerta : ''} · Lote ${a.lote || '—'}</p>
            </div>
          </li>`;
      }
      listaAlertasEl.innerHTML = alertasHTML;
    }


    // ==========================================
    // 6. PAINEL LATERAL: DESVIOS POR UNIDADE (TOP 5)
    // ==========================================
    // Ordenar unidades por total de desvios (decrescente) e depois por nome
    let unidadesComDesviosOrdenadas = [...unidadesProcessadas].filter(u => u.totalDesvios > 0);
    unidadesComDesviosOrdenadas.sort((a, b) => b.totalDesvios - a.totalDesvios || a.nome.localeCompare(b.nome, "pt-BR"));

    let maxDesvios = unidadesComDesviosOrdenadas.length > 0 ? unidadesComDesviosOrdenadas[0].totalDesvios : 0;
    let top5 = unidadesComDesviosOrdenadas.slice(0, 5);

    let desviosHTML = "";
    for (let i = 0; i < top5.length; i++) {
      let u = top5[i];
      let larguraBarra = maxDesvios > 0 ? Math.round((u.totalDesvios / maxDesvios) * 100) : 0;
      let isPrimeiro = (i === 0);

      desviosHTML += `
        <div class="desvio-barra">
          <p class="desvio-barra__nome">${u.nome}</p>
          <div class="desvio-barra__linha">
            <div class="barra barra--grossa">
              <div class="barra__preenchimento${isPrimeiro ? " barra__preenchimento--destaque" : ""}" style="width: ${larguraBarra}%"></div>
            </div>
            <span class="desvio-barra__contagem">${u.totalDesvios}</span>
          </div>
        </div>`;
    }

    if (top5.length === 0) {
      document.getElementById("lista-desvios").innerHTML = `<p class="desvios-mais">Nenhum desvio até agora.</p>`;
    } else {
      document.getElementById("lista-desvios").innerHTML = desviosHTML;
    }

    // Texto de unidades restantes
    let maisCount = Math.max(0, unidadesComDesviosOrdenadas.length - 5);
    let desviosMaisEl = document.getElementById("desvios-mais");
    if (maisCount > 0) {
      desviosMaisEl.hidden = false;
      desviosMaisEl.innerHTML = `+${maisCount} ${maisCount === 1 ? 'unidade com desvios' : 'unidades com desvios'} · <a href="./unidades.html">Ver todos</a>`;
    } else {
      desviosMaisEl.hidden = true;
    }

    let demaisSemDesvioCount = unidadesProcessadas.filter(u => u.totalDesvios === 0).length;
    document.getElementById("desvios-demais").textContent = `Demais ${demaisSemDesvioCount} ${demaisSemDesvioCount === 1 ? 'unidade' : 'unidades'} · 0 desvios`;

    // Tempo médio de resposta
    let temposResolvidos = [];
    for (let i = 0; i < resolvidos.length; i++) {
      if (resolvidos[i].fim && resolvidos[i].inicio) {
        let diffMin = (new Date(resolvidos[i].fim) - new Date(resolvidos[i].inicio)) / MS_POR_MINUTO;
        temposResolvidos.push(diffMin);
      }
    }

    let tempoMedioMin = null;
    if (temposResolvidos.length > 0) {
      let somaTempos = 0;
      for (let t = 0; t < temposResolvidos.length; t++) {
        somaTempos += temposResolvidos[t];
      }
      tempoMedioMin = Math.round(somaTempos / temposResolvidos.length);
    }

    let tempoRespostaTexto = "—";
    if (tempoMedioMin !== null) {
      if (tempoMedioMin < 60) {
        tempoRespostaTexto = `${tempoMedioMin} min`;
      } else {
        let h = Math.floor(tempoMedioMin / 60);
        let m = tempoMedioMin % 60;
        tempoRespostaTexto = m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
      }
    }
    document.getElementById("tempo-resposta").textContent = tempoRespostaTexto;

  } catch (erro) {
    console.error("Erro ao atualizar o panorama:", erro);
  }
}

atualizarPanorama();
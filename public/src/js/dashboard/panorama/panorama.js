import { carregarPanorama } from "../../services/panorama/fetch.js";

// ============================================================
// FUNÇÕES AUXILIARES (Mantidas intactas)
// ============================================================

function buscarLeitura(idLeitura, leiturasSensoresData) {
  for (let i = 0; i < leiturasSensoresData.length; i++) {
    if (leiturasSensoresData[i].id === idLeitura) {
      return leiturasSensoresData[i];
    }
  }
  return null;
}

function buscarTanque(idTanque, tanquesData) {
  for (let i = 0; i < tanquesData.length; i++) {
    if (tanquesData[i].id === idTanque) {
      return tanquesData[i];
    }
  }
  return null;
}

// No V4, a produção está ativa quando dt_saida é NULL.
function buscarProducaoTanque(idTanque, producoesData) {
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

function buscarLote(idLote, lotesData) {
  for (let i = 0; i < lotesData.length; i++) {
    if (lotesData[i].id === idLote) {
      return lotesData[i];
    }
  }
  return null;
}

// No V4:
// alerta -> leitura_sensor -> tanque
function buscarTanqueDoAlerta(alerta, leiturasSensoresData, tanquesData) {
  let leitura = buscarLeitura(alerta.fk_leitura, leiturasSensoresData);
  if (leitura === null) return null;
  return buscarTanque(leitura.fk_tanque, tanquesData);
}

// No V4, o volume está armazenado em lote.volume_litros.
function buscarVolumeTanque(idTanque, producoesData, lotesData) {
  let producao = buscarProducaoTanque(idTanque, producoesData);
  if (producao === null) return 0;
  
  let lote = buscarLote(producao.fk_lote, lotesData);
  if (lote === null) return 0;
  
  return lote.volume_litros;
}

// No V4, o tipo do alerta é identificado por fk_tipo_alerta.
function buscarTipoAlerta(alerta) {
  if (alerta.fk_tipo_alerta === 2) return "acima";
  if (alerta.fk_tipo_alerta === 1) return "abaixo";
  return "abaixo";
}

// ============================================================
// ATUALIZAÇÃO DO PANORAMA
// ============================================================

function atualizarPanorama(dados) {
  // Extrai os dados necessários
  const {
    usuario: userData,
    empresa: empresaData,
    unidades: unidadesData,
    tanques: tanquesData,
    lotes: lotesData,
    producoes: producoesData,
    leiturasSensores: leiturasSensoresData,
    alertas: alertasData,
  } = dados;

  let dataAtual = new Date(); // Substitui o DATA_REFERENCIA
  let MS_POR_MINUTO = 60000;
  let JANELA_24H_MS = 24 * 60 * 60 * 1000;
  let nomeUsuarioTopo = "Usuário Padrão";

  // Fallbacks para nome do usuário
  if (userData && userData.nome && userData.nome.trim() !== "") {
    nomeUsuarioTopo = userData.nome;
  } else if (sessionStorage.getItem("NOME_COMPLETO")) {
    nomeUsuarioTopo = sessionStorage.getItem("NOME_COMPLETO");
  }

  let primeiroNome = nomeUsuarioTopo.trim().split(" ")[0];
  let nomeEmpresa = empresaData?.nome || "Sua Empresa";

  if (userData?.nome_empresa && userData.nome_empresa.trim() !== "") {
    nomeEmpresa = userData.nome_empresa;
  }

  // função para formatar data/hora --> SUBSTITUIR
  let dataFormatada = dataAtual.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  document.getElementById("topo-titulo").textContent = `Olá, ${primeiroNome}!`;
  document.getElementById("topo-subtitulo").textContent =
    `Bem-vindo(a) ao painel da ${nomeEmpresa} · ${dataFormatada}`;

  // ============================================================
  // PLANO DA EMPRESA
  // ============================================================
  let badgePlanoEl = document.getElementById("badge-plano");
  if (badgePlanoEl) {
    let planoTexto = "";
    if (userData?.plano && userData.plano.trim() !== "") {
      planoTexto = `Plano ${userData.plano}`;
    } else if (empresaData?.plano && empresaData.plano.trim() !== "") {
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
  let unidadesAtivas = unidadesData.filter(u => u.fk_status_unidade === 3);
  let tanquesAtivos = tanquesData.filter(t => 
    unidadesAtivas.some(u => u.id === t.fk_unidade)
  );

  let totalTanquesGeral = tanquesAtivos.length;

  document.getElementById("badge-unidades").textContent = `${unidadesAtivas.length} unidades ativas`;
  document.getElementById("badge-tanques").textContent = `${totalTanquesGeral} tanques monitorados`;

  // ============================================================
  // PROCESSAMENTO DOS ALERTAS
  // ============================================================
  let abertos = [];
  let resolvidos = [];
  let alertasUltimas24h = [];
  let abertos24hCount = 0;
  let resolvidos24hCount = 0;
  let alertaMaisAntigoGeral = null;

  alertasData.forEach(alerta => {
    if (alerta.dt_resolucao === null) {
      abertos.push(alerta);
      if (!alertaMaisAntigoGeral || new Date(alerta.dt_alerta) < new Date(alertaMaisAntigoGeral.dt_alerta)) {
        alertaMaisAntigoGeral = alerta;
      }
    } else {
      resolvidos.push(alerta);
    }

    let inicioMs = new Date(alerta.dt_alerta).getTime();
    let diferenca = dataAtual.getTime() - inicioMs;

    if (!isNaN(inicioMs) && diferenca >= 0 && diferenca <= JANELA_24H_MS) {
      alertasUltimas24h.push(alerta);
      if (alerta.dt_resolucao === null) abertos24hCount++;
      else resolvidos24hCount++;
    }
  });

  // ============================================================
  // PROCESSAMENTO DAS UNIDADES E TANQUES
  // ============================================================
  let tanquesEmUsoGeral = 0;
  let unidadesEmDesvioCount = 0;
  let unidadesProcessadas = [];

  unidadesAtivas.forEach(unidade => {
    let tanquesUsoUnidade = 0;
    let tanquesEmDesvioDestaUnidade = [];
    let totalDesvios24hUnidade = 0;

    // Tanques em uso
    tanquesAtivos.forEach(tanque => {
      if (tanque.fk_unidade === unidade.id && tanque.fk_status_tanque === 2) {
        tanquesEmUsoGeral++;
        tanquesUsoUnidade++;
      }
    });

    // Alertas Abertos
    let alertasAbertosUnidades = [];
    abertos.forEach(alerta => {
      let tanqueAlerta = buscarTanqueDoAlerta(alerta, leiturasSensoresData, tanquesData);
      if (tanqueAlerta && tanqueAlerta.fk_unidade === unidade.id) {
        alertasAbertosUnidades.push(alerta);
        
        let jaAdicionado = tanquesEmDesvioDestaUnidade.some(t => t.id === tanqueAlerta.id);
        if (!jaAdicionado) {
          let volumeTanque = buscarVolumeTanque(tanqueAlerta.id, producoesData, lotesData);
          tanquesEmDesvioDestaUnidade.push({
            id: tanqueAlerta.id,
            nome: tanqueAlerta.nome,
            tipo: buscarTipoAlerta(alerta),
            volume: volumeTanque
          });
        }
      }
    });

    // Desvios 24h
    alertasUltimas24h.forEach(alerta => {
      let tanqueAlerta = buscarTanqueDoAlerta(alerta, leiturasSensoresData, tanquesData);
      if (tanqueAlerta && tanqueAlerta.fk_unidade === unidade.id) {
        totalDesvios24hUnidade++;
      }
    });

    // Alerta mais antigo da unidade
    let minutosAntigos = null;
    let alertaMaisAntigoUnidade = null;
    
    alertasAbertosUnidades.forEach(alerta => {
      if (!alertaMaisAntigoUnidade || new Date(alerta.dt_alerta) < new Date(alertaMaisAntigoUnidade.dt_alerta)) {
        alertaMaisAntigoUnidade = alerta;
      }
    });

    if (alertaMaisAntigoUnidade) {
      minutosAntigos = Math.floor((dataAtual - new Date(alertaMaisAntigoUnidade.dt_alerta)) / MS_POR_MINUTO);
    }

    let emDesvio = tanquesEmDesvioDestaUnidade.length > 0;
    if (emDesvio) unidadesEmDesvioCount++;

    let volumeRisco = tanquesEmDesvioDestaUnidade.reduce((acc, t) => acc + t.volume, 0);

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
  });

  // ============================================================
  // KPIs
  // ============================================================
  let unidadesEstaveisCount = unidadesAtivas.length - unidadesEmDesvioCount;

  document.getElementById("kpi-unidades-valor").textContent = unidadesAtivas.length;
  document.getElementById("kpi-unidades-tags").innerHTML = `
  <span class="tag">
    <span class="tag__ponto"></span>
    ${unidadesEstaveisCount} ${unidadesEstaveisCount === 1 ? "estável" : "estáveis"}
  </span>
  <span class="tag ${unidadesEmDesvioCount > 0 ? "tag--alerta" : ""}">
    <span class="tag__ponto ${unidadesEmDesvioCount > 0 ? "tag__ponto--alerta" : ""}"></span>
    ${unidadesEmDesvioCount} com desvios
  </span>`;

  let percentualOcupacao = totalTanquesGeral > 0 
    ? Math.round((tanquesEmUsoGeral / totalTanquesGeral) * 100) 
    : 0;

  document.getElementById("kpi-ocupacao-valor").textContent = tanquesEmUsoGeral;
  document.getElementById("kpi-ocupacao-complemento").textContent = ` de ${totalTanquesGeral} tanques`;
  document.getElementById("kpi-ocupacao-barra").style.width = `${percentualOcupacao}%`;
  document.getElementById("kpi-ocupacao-rodape").textContent = `${percentualOcupacao}% de ocupação`;

  document.getElementById("kpi-ocorrencias-valor").textContent = alertasUltimas24h.length;
  document.getElementById("kpi-ocorrencias-tags").innerHTML = `
  <span class="tag">
    <span class="tag__ponto"></span>
    ${resolvidos24hCount} resolvidos
  </span>
  <span class="tag">
    <span class="tag__ponto tag__ponto--alerta"></span>
    ${abertos24hCount} em aberto
  </span>`;

  let cardAlerta = document.getElementById("kpi-alerta");
  if (abertos.length > 0) {
    cardAlerta.classList.add("kpi-card--alerta");
  } else {
    cardAlerta.classList.remove("kpi-card--alerta");
  }

  let acimaCount = 0;
  let abaixoCount = 0;
  abertos.forEach(alerta => {
    let tipo = buscarTipoAlerta(alerta);
    if (tipo === "abaixo") abaixoCount++;
    if (tipo === "acima") acimaCount++;
  });

  document.getElementById("kpi-alerta-valor").textContent = abertos.length;
  document.getElementById("kpi-alerta-complemento").textContent = abertos.length === 1 ? "alerta" : "alertas";
  document.getElementById("kpi-alerta-tags").innerHTML = `
    ${acimaCount > 0 ? `<span class="tag tag--alerta"><span class="tag__ponto tag__ponto--alerta"></span>${acimaCount} Acima do ideal</span>` : ""}
    ${abaixoCount > 0 ? `<span class="tag tag--alerta"><span class="tag__ponto tag__ponto--alerta"></span>${abaixoCount} Abaixo do ideal</span>` : ""}
  `;

  if (alertaMaisAntigoGeral) {
    let horaInicio = alertaMaisAntigoGeral.dt_alerta.slice(11, 19);
    document.getElementById("kpi-alerta-rodape").textContent = `Desde ${horaInicio} · aguardando revisão`;
  } else {
    document.getElementById("kpi-alerta-rodape").textContent = "Nenhum alerta pendente";
  }

  // ============================================================
  // TABELA: UNIDADES EM DESVIO
  // ============================================================
  let unidadesEmDesvioLista = unidadesProcessadas.filter(u => u.emDesvio);

  document.getElementById("contador-desvio").textContent = `Em desvio · ${unidadesEmDesvioLista.length}`;
  
  let tabelaHTML = "";
  if (unidadesEmDesvioLista.length === 0) {
    tabelaHTML = `<tr class="tabela__vazio"><td colspan="5">Nenhuma unidade em desvio no momento.</td></tr>`;
  } else {
    tabelaHTML = unidadesEmDesvioLista.map(u => {
      let tagsTanquesHTML = u.tanquesEmDesvio.map(tanque => {
        let seta = tanque.tipo === "acima" ? "up" : "down";
        return `
        <span class="tag-tanque tag-tanque--${tanque.tipo}">
          <i class="fa-solid fa-arrow-${seta}"></i>
          <strong>${tanque.nome}</strong>
          ${tanque.tipo} do ideal
        </span>`;
      }).join('');

      let tempoMsg = u.minutosDesdeMaisAntigos !== null ? `(há ${u.minutosDesdeMaisAntigos} min)` : "";

      return `
      <tr class="tabela__linha">
        <td>${u.nome}</td>
        <td>${u.volumeEmRisco.toLocaleString("pt-BR")} L</td>
        <td>${u.alertasAbertosCount} em aberto ${tempoMsg}</td>
        <td><span class="status status--desvio">Em desvio</span></td>
        <td>
          <a class="tabela__link" href="./monitor-tanques.html?unidade=${u.id}">
            Ver tanques <i class="fa-solid fa-arrow-right"></i>
          </a>
        </td>
      </tr>
      <tr class="tabela__tanques">
        <td colspan="5">
          <div class="tabela__tanques-conteudo">${tagsTanquesHTML}</div>
        </td>
      </tr>`;
    }).join('');
  }

  document.getElementById("tabela-unidades-corpo").innerHTML = tabelaHTML;
  
  document.getElementById("tabela-rodape-resumo").innerHTML =
    `${unidadesEmDesvioLista.length} de ${unidadesAtivas.length} ` +
    `${unidadesAtivas.length === 1 ? "unidade" : "unidades"} em desvio · ` +
    `<strong>${unidadesEstaveisCount} ${unidadesEstaveisCount === 1 ? "unidade estável" : "unidades estáveis"}</strong> ` +
    `${unidadesEstaveisCount === 1 ? "fica" : "ficam"} fora desta lista`;

  // ============================================================
  // GRÁFICO: DESVIOS POR UNIDADE
  // ============================================================
  let todasUnidadesOrdenadas = unidadesProcessadas
    .filter(u => u.totalDesvios > 0)
    .sort((a, b) => b.totalDesvios - a.totalDesvios);

  let maxDesvios = todasUnidadesOrdenadas.length > 0 ? todasUnidadesOrdenadas[0].totalDesvios : 0;

  let listaDesviosEl = document.getElementById("lista-desvios");
  if (todasUnidadesOrdenadas.length === 0) {
    listaDesviosEl.innerHTML = `<p class="desvios-mais">Nenhuma unidade com ocorrências no período.</p>`;
  } else {
    let desviosHTML = todasUnidadesOrdenadas.map((u, index) => {
      let larguraBarra = maxDesvios > 0 ? Math.round((u.totalDesvios / maxDesvios) * 100) : 0;
      let destaque = (index === 0 && u.totalDesvios > 0) ? " barra__preenchimento--destaque" : "";
      
      return `
      <div class="desvio-barra">
        <p class="desvio-barra__nome">${u.nome}</p>
        <div class="desvio-barra__linha">
          <div class="barra barra--grossa">
            <div class="barra__preenchimento${destaque}" style="width: ${larguraBarra}%"></div>
          </div>
          <span class="desvio-barra__contagem">${u.totalDesvios}</span>
        </div>
      </div>`;
    }).join('');
    listaDesviosEl.innerHTML = desviosHTML;
  }

  // ============================================================
  // RODAPÉ DO GRÁFICO
  // ============================================================
  let desviosMaisEl = document.getElementById("desvios-mais");
  if (desviosMaisEl) desviosMaisEl.hidden = true;

  let demaisSemDesvioCount = unidadesProcessadas.filter(u => u.totalDesvios === 0).length;
  document.getElementById("desvios-demais").textContent = 
    `Demais ${demaisSemDesvioCount} ${demaisSemDesvioCount === 1 ? "unidade" : "unidades"} · 0 desvios`;

  // ============================================================
  // TEMPO MÉDIO DE RESOLUÇÃO
  // ============================================================
  let temposResolvidos = resolvidos
    .filter(r => r.dt_resolucao && r.dt_alerta)
    .map(r => (new Date(r.dt_resolucao) - new Date(r.dt_alerta)) / MS_POR_MINUTO)
    .filter(diff => !isNaN(diff) && diff >= 0);

  let tempoRespostaTexto = "—";
  if (temposResolvidos.length > 0) {
    let tempoMedioMin = Math.round(temposResolvidos.reduce((acc, t) => acc + t, 0) / temposResolvidos.length);
    
    if (tempoMedioMin < 60) {
      tempoRespostaTexto = `${tempoMedioMin} min`;
    } else {
      let h = Math.floor(tempoMedioMin / 60);
      let m = tempoMedioMin % 60;
      let mTexto = m < 10 ? "0" + m : m;
      tempoRespostaTexto = m === 0 ? `${h}h` : `${h}h${mTexto}`;
    }
  }

  document.getElementById("tempo-resposta").textContent = tempoRespostaTexto;
}

// ============================================================
// INICIALIZAÇÃO E CONTROLE DE LOADING/ERRO
// ============================================================
async function initPanorama() {
  // Criação dinâmica dos elementos de loading/erro (caso não existam no HTML)
  let loadingEl = document.getElementById("panorama-loading");
  if (!loadingEl) {
    loadingEl = document.createElement("div");
    loadingEl.id = "panorama-loading";
    loadingEl.innerHTML = `<p style="text-align:center; padding: 20px; color: #666;">Carregando dados do painel...</p>`;
    document.body.prepend(loadingEl);
  }

  let erroEl = document.getElementById("panorama-erro");
  if (!erroEl) {
    erroEl = document.createElement("div");
    erroEl.id = "panorama-erro";
    erroEl.style.display = "none";
    erroEl.style.textAlign = "center";
    erroEl.style.padding = "20px";
    erroEl.style.color = "#d32f2f";
    erroEl.innerHTML = `<p id="panorama-erro-msg"></p><button onclick="window.location.reload()" style="padding: 8px 16px; cursor: pointer; border-radius: 4px; border: 1px solid #d32f2f; background: transparent; color: #d32f2f; margin-top: 10px;">Tentar Novamente</button>`;
    document.body.prepend(erroEl);
  }

  try {
    loadingEl.style.display = "block";
    erroEl.style.display = "none";

    const dados = await carregarPanorama();
    
    loadingEl.style.display = "none";
    atualizarPanorama(dados);

  } catch (error) {
    loadingEl.style.display = "none";
    erroEl.style.display = "block";
    document.getElementById("panorama-erro-msg").textContent = error.message || "Erro ao carregar os dados. Tente novamente mais tarde.";
  }
}

// Executa a inicialização
initPanorama();
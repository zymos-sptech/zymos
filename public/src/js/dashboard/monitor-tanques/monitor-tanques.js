
import {
    DATA_REFERENCIA,
    unidadesData,
    tanquesData,
    cervejasData,
    lotesData,
    producoesData,
    leiturasSensoresData,
    alertasData
} from "../../MOCK_DATA/mock_data.js";

// Busca uma leitura pelo ID.
function buscarLeitura(idLeitura) {
    for (let i = 0; i < leiturasSensoresData.length; i++) {
        if (leiturasSensoresData[i].id == idLeitura) {
            return leiturasSensoresData[i];
        }
    }

    return null;
}

// Busca um tanque pelo ID.
function buscarTanque(idTanque) {
    for (let i = 0; i < tanquesData.length; i++) {
        if (tanquesData[i].id == idTanque) {
            return tanquesData[i];
        }
    }

    return null;
}

// Busca um lote pelo ID.
function buscarLote(idLote) {
    for (let i = 0; i < lotesData.length; i++) {
        if (lotesData[i].id == idLote) {
            return lotesData[i];
        }
    }

    return null;
}

// Busca uma cerveja pelo ID.
function buscarCerveja(idCerveja) {
    for (let i = 0; i < cervejasData.length; i++) {
        if (cervejasData[i].id == idCerveja) {
            return cervejasData[i];
        }
    }

    return null;
}

// Busca a produção ativa do tanque.
// No V4, dt_saida NULL significa que a produção continua ativa.
function buscarProducaoAtiva(idTanque) {
    for (let i = 0; i < producoesData.length; i++) {
        let producao = producoesData[i];

        if (
            producao.fk_tanque == idTanque &&
            producao.dt_saida == null
        ) {
            return producao;
        }
    }

    return null;
}

// Busca a última leitura da produção.
// No V4, a leitura é relacionada diretamente ao lote e ao tanque.
function buscarUltimaLeitura(producao) {
    let ultimaLeitura = null;

    for (let i = 0; i < leiturasSensoresData.length; i++) {
        let leitura = leiturasSensoresData[i];

        if (
            leitura.fk_lote == producao.fk_lote &&
            leitura.fk_tanque == producao.fk_tanque
        ) {
            if (
                ultimaLeitura == null ||
                new Date(leitura.dt_medicao) >
                new Date(ultimaLeitura.dt_medicao)
            ) {
                ultimaLeitura = leitura;
            }
        }
    }

    return ultimaLeitura;
}

// Calcula a aderência térmica do lote.
// Considera todas as leituras válidas relacionadas ao lote e ao tanque.
function calcularAderenciaTermica(producao, cerveja) {
    let totalLeituras = 0;
    let leiturasDentroFaixa = 0;

    let temperaturaMinima = Number(cerveja.temperatura_min);
    let temperaturaMaxima = Number(cerveja.temperatura_max);

    for (let i = 0; i < leiturasSensoresData.length; i++) {
        let leitura = leiturasSensoresData[i];

        if (
            leitura.fk_lote == producao.fk_lote &&
            leitura.fk_tanque == producao.fk_tanque
        ) {
            let temperatura = Number(leitura.temperatura);

            // Ignora temperaturas inválidas.
            if (!isNaN(temperatura)) {
                totalLeituras++;

                if (
                    temperatura >= temperaturaMinima &&
                    temperatura <= temperaturaMaxima
                ) {
                    leiturasDentroFaixa++;
                }
            }
        }
    }

    // Não existe percentual quando não há leituras válidas.
    if (totalLeituras == 0) {
        return null;
    }

    return Math.round(
        (leiturasDentroFaixa / totalLeituras) * 100
    );
}

// Identifica o tipo de cerveja pelo relacionamento com tipo_cerveja.
// IDs conforme os INSERTs do V4: 1 = Ale e 2 = Lager.
function buscarTipoCerveja(cerveja) {
    if (cerveja.fk_tipo_cerveja == 1) {
        return "Ale";
    }

    if (cerveja.fk_tipo_cerveja == 2) {
        return "Lager";
    }

    return "Não informado";
}

// Identifica a levedura pelos IDs cadastrados no V4.
function buscarLevedura(cerveja) {
    if (cerveja.fk_levedura == 1) {
        return "Saccharomyces cerevisiae";
    }

    if (cerveja.fk_levedura == 2) {
        return "Saccharomyces pastorianus";
    }

    if (cerveja.fk_levedura == 3) {
        return "Saccharomyces carlsbergensis";
    }

    return "Não informada";
}

// Verifica a temperatura atual em relação à faixa da cerveja.
function verificarTemperatura(temperatura, minima, maxima) {
    if (temperatura > maxima) {
        return "Acima";
    }

    if (temperatura < minima) {
        return "Abaixo";
    }

    return "Normal";
}

// Busca a cerveja que está sendo produzida no tanque.
function buscarCervejaTanque(idTanque) {
    let producao = buscarProducaoAtiva(idTanque);

    if (producao == null) {
        return null;
    }

    let lote = buscarLote(producao.fk_lote);

    if (lote == null) {
        return null;
    }

    return buscarCerveja(lote.fk_cerveja);
}

// Busca o tanque relacionado ao alerta.
// Caminho V4: alerta -> leitura_sensor -> tanque.
function buscarTanqueAlerta(alerta) {
    let leitura = buscarLeitura(alerta.fk_leitura);

    if (leitura == null) {
        return null;
    }

    return buscarTanque(leitura.fk_tanque);
}

// Busca o desvio atual de um tanque.
function buscarDesvioAtual(idTanque) {
    let producao = buscarProducaoAtiva(idTanque);

    if (producao == null) {
        return "Normal";
    }

    let lote = buscarLote(producao.fk_lote);

    if (lote == null) {
        return "Normal";
    }

    let cerveja = buscarCerveja(lote.fk_cerveja);

    if (cerveja == null) {
        return "Normal";
    }

    let leitura = buscarUltimaLeitura(producao);

    if (leitura == null) {
        return "Sem leitura";
    }

    return verificarTemperatura(
        Number(leitura.temperatura),
        Number(cerveja.temperatura_min),
        Number(cerveja.temperatura_max)
    );
}

// Busca a última leitura e a produção do tanque.
function buscarDadosAtuaisTanque(idTanque) {
    let producao = buscarProducaoAtiva(idTanque);

    if (producao == null) {
        return null;
    }

    let lote = buscarLote(producao.fk_lote);

    if (lote == null) {
        return null;
    }

    let cerveja = buscarCerveja(lote.fk_cerveja);

    if (cerveja == null) {
        return null;
    }

    let leitura = buscarUltimaLeitura(producao);

    if (leitura == null) {
        return null;
    }

    return {
        producao: producao,
        lote: lote,
        cerveja: cerveja,
        leitura: leitura
    };
}

// ============================================================
// DETALHES DA PRODUÇÃO DO TANQUE
// ============================================================

function montarDetalhesTanque(tanque, producao, lote, cerveja, leitura) {

    let agora = new Date(DATA_REFERENCIA);
    let inicio = new Date(lote.dt_inicio);

    // Calcula o dia atual da fermentação.
    let diasPassados = Math.floor(
        (agora - inicio) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (diasPassados < 1) {
        diasPassados = 1;
    }

    if (diasPassados > cerveja.tempo_fermentacao_dias) {
        diasPassados = cerveja.tempo_fermentacao_dias;
    }

    let temperatura = Number(leitura.temperatura);

    let desvio = verificarTemperatura(
        temperatura,
        Number(cerveja.temperatura_min),
        Number(cerveja.temperatura_max)
    );

    let status = "Dentro da faixa";

    if (desvio == "Acima" || desvio == "Abaixo") {
        status = "Em desvio";
    }

    let classeStatus = status == "Em desvio" ? "alerta" : "";

    let tipoCerveja = buscarTipoCerveja(cerveja);
    let levedura = buscarLevedura(cerveja);

    // Calcula a aderência térmica com as leituras do lote.
    let aderencia = calcularAderenciaTermica(producao, cerveja);

    let aderenciaTexto = "Sem leituras";

    if (aderencia != null) {
        aderenciaTexto = `${aderencia}%`;
    }

    return `
        <div class="detalhes-conteudo">

            <div class="detalhes-topo">
                <div class="detalhes-resumo">
                    <strong>Resumo do lote · Lote ${lote.codigo}</strong>
                    <span>${tanque.nome} · ${cerveja.nome}</span>
                </div>

                <a href="./dashboard-micro.html?lote=${lote.id}" class="link-dashboard-lote">
                    Abrir no dashboard por lote →
                </a>
            </div>

            <div class="detalhes-grid">

                <div class="detalhes-item">
                    <span>Tipo</span>
                    <strong>${tipoCerveja}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Levedura</span>
                    <strong>${levedura}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Volume do lote</span>
                    <strong>${Number(lote.volume_litros).toLocaleString("pt-BR")} litros</strong>
                </div>

                <div class="detalhes-item">
                    <span>Início</span>
                    <strong>${inicio.toLocaleDateString("pt-BR")}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Progresso</span>
                    <strong>Dia ${diasPassados} de ${cerveja.tempo_fermentacao_dias} dias</strong>
                </div>

                <div class="detalhes-item">
                    <span>Aderência térmica</span>
                    <strong>${aderenciaTexto}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Temperatura atual</span>
                    <strong>${temperatura.toFixed(1)}°C</strong>
                </div>

                <div class="detalhes-item">
                    <span>Status</span>
                    <strong class="${classeStatus}">${status}</strong>
                </div>
            </div>
        </div>
    `;
}

let unidadeInicialCarregada = false;

function atualizarDesviosPorTanque() {

    let unidadeSelecionada = document.getElementById("select-unidade").value;
    let lista = document.getElementById("lista-desvios-tanques");
    let unidadeTexto = document.getElementById("desvio-tanque-unidade");
    let demais = document.getElementById("desvios-demais-tanques");
    let tempoResposta = document.getElementById("valor-tempo-resposta");

    let agora = new Date(DATA_REFERENCIA);
    let inicio24h = new Date(agora.getTime() - (24 * 60 * 60 * 1000));

    let desviosPorTanque = [];
    let tanquesSemDesvio = 0;

    // Identifica a unidade selecionada.
    unidadeTexto.textContent = "Todos os tanques · últimas 24 horas";

    // Adiciona os tanques da unidade selecionada.
    for (let i = 0; i < tanquesData.length; i++) {

        let tanque = tanquesData[i];

        if (tanque.fk_unidade == unidadeSelecionada) {

            desviosPorTanque.push({
                id: tanque.id,
                nome: tanque.nome,
                ocorrencias: 0
            });
        }
    }

    // Conta as ocorrências de cada tanque nas últimas 24 horas.
    for (let i = 0; i < alertasData.length; i++) {

        let alerta = alertasData[i];
        let dataAlerta = new Date(alerta.dt_alerta);

        if (dataAlerta >= inicio24h && dataAlerta <= agora) {

            let tanque = buscarTanqueAlerta(alerta);

            if (
                tanque != null &&
                tanque.fk_unidade == unidadeSelecionada
            ) {

                for (let j = 0; j < desviosPorTanque.length; j++) {

                    if (desviosPorTanque[j].id == tanque.id) {
                        desviosPorTanque[j].ocorrencias++;
                    }
                }
            }
        }
    }

    // Ordena do maior número de ocorrências para o menor.
    for (let i = 0; i < desviosPorTanque.length; i++) {

        for (let j = i + 1; j < desviosPorTanque.length; j++) {

            if (
                desviosPorTanque[j].ocorrencias >
                desviosPorTanque[i].ocorrencias
            ) {

                let temporario = desviosPorTanque[i];

                desviosPorTanque[i] = desviosPorTanque[j];
                desviosPorTanque[j] = temporario;
            }
        }
    }

    // Separa os tanques sem ocorrências.
    let tanquesComDesvio = [];

    for (let i = 0; i < desviosPorTanque.length; i++) {

        if (desviosPorTanque[i].ocorrencias > 0) {
            tanquesComDesvio.push(desviosPorTanque[i]);

        } else {
            tanquesSemDesvio++;
        }
    }

    // Monta a lista de tanques com desvio.
    let listaHTML = "";
    let maiorQuantidade = 0;

    if (tanquesComDesvio.length > 0) {
        maiorQuantidade = tanquesComDesvio[0].ocorrencias;
    }

    for (let i = 0; i < tanquesComDesvio.length; i++) {

        let tanque = tanquesComDesvio[i];

        let porcentagem = (
            tanque.ocorrencias / maiorQuantidade
        ) * 100;

        let classeDestaque = "";

        if (i == 0) {
            classeDestaque = "destaque";
        }

        listaHTML += `
            <div class="desvio-tanque-row">
                <strong class="desvio-tanque-nome">${tanque.nome}</strong>

                <div class="desvio-barra-container">
                    <div class="desvio-barra-preenchimento ${classeDestaque}"
                        style="width: ${porcentagem}%">
                    </div>
                </div>

                <strong class="desvio-tanque-contagem">${tanque.ocorrencias}</strong>
            </div>
        `;
    }

    if (tanquesComDesvio.length == 0) {
        listaHTML = `<p class="desvios-mais">Nenhum desvio registrado no período.</p>`;
    }

    lista.innerHTML = listaHTML;

    // Atualiza a quantidade de tanques sem desvio.
    demais.hidden = false;

    demais.textContent =
        `Demais ${tanquesSemDesvio} tanques · 0 desvios`;

    // ========================================================
    // TEMPO MÉDIO DE RESPOSTA
    // ========================================================

    let totalMinutos = 0;
    let totalAlertasResolvidos = 0;

    for (let i = 0; i < alertasData.length; i++) {

        let alerta = alertasData[i];
        let dataInicio = new Date(alerta.dt_alerta);

        // No V4, alerta resolvido possui dt_resolucao preenchida.
        if (
            dataInicio >= inicio24h &&
            dataInicio <= agora &&
            alerta.dt_resolucao != null
        ) {

            let tanque = buscarTanqueAlerta(alerta);

            if (
                tanque != null &&
                tanque.fk_unidade == unidadeSelecionada
            ) {

                let dataResolucao = new Date(alerta.dt_resolucao);

                if (!isNaN(dataResolucao.getTime())) {

                    let minutos = (
                        dataResolucao - dataInicio
                    ) / 60000;

                    if (minutos >= 0) {
                        totalMinutos += minutos;
                        totalAlertasResolvidos++;
                    }
                }
            }
        }
    }

    if (totalAlertasResolvidos > 0) {

        let media = Math.round(
            totalMinutos / totalAlertasResolvidos
        );

        tempoResposta.textContent = `${media} min`;

    } else {

        tempoResposta.textContent = "—";
    }
}

// ============================================================
// BLOCO 2 — BADGE E KPIs
// ============================================================

function atualizarKPIs() {

    let selectUnidade = document.getElementById("select-unidade");

    // Preenche o select com as unidades ativas.
    if (selectUnidade.options.length == 0) {

        for (let i = 0; i < unidadesData.length; i++) {

            let unidade = unidadesData[i];

            // V4: status_unidade 3 = Ativa.
            if (unidade.fk_status_unidade == 3) {

                let opcao = document.createElement("option");

                opcao.value = unidade.id;
                opcao.textContent = unidade.nome;

                selectUnidade.appendChild(opcao);
            }
        }
    }

    // Define a unidade inicial.
    if (!unidadeInicialCarregada) {

        let parametrosURL = new URLSearchParams(window.location.search);
        let unidadeURL = parametrosURL.get("unidade");

        let unidadeEncontrada = false;

        for (let i = 0; i < unidadesData.length; i++) {

            if (
                unidadesData[i].id == unidadeURL &&
                unidadesData[i].fk_status_unidade == 3
            ) {
                unidadeEncontrada = true;
            }
        }

        if (unidadeEncontrada) {

            selectUnidade.value = unidadeURL;

        } else if (selectUnidade.options.length > 0) {

            selectUnidade.value = selectUnidade.options[0].value;
        }

        unidadeInicialCarregada = true;
    }

    let unidadeSelecionada = selectUnidade.value;

    // ========================================================
    // KPI — OCUPAÇÃO
    // ========================================================

    let totalTanques = 0;
    let tanquesEmUso = 0;
    let lotesAle = 0;
    let lotesLager = 0;

    for (let i = 0; i < tanquesData.length; i++) {

        let tanque = tanquesData[i];

        if (tanque.fk_unidade == unidadeSelecionada) {

            totalTanques++;

            // V4: status_tanque 2 = Em uso.
            if (tanque.fk_status_tanque == 2) {

                tanquesEmUso++;

                let cerveja = buscarCervejaTanque(tanque.id);

                if (cerveja != null) {

                    let tipoCerveja = buscarTipoCerveja(cerveja);

                    if (tipoCerveja == "Ale") {
                        lotesAle++;

                    } else if (tipoCerveja == "Lager") {
                        lotesLager++;
                    }
                }
            }
        }
    }

    let taxaOcupacao = 0;

    if (totalTanques > 0) {

        taxaOcupacao = Math.round(
            (tanquesEmUso / totalTanques) * 100
        );
    }

    document.getElementById("kpi-lotes-qtd").textContent =
        tanquesEmUso;

    document.getElementById("kpi-ocupacao-total").textContent =
        ` de ${totalTanques} tanques`;

    document.getElementById("kpi-ocupacao-taxa").textContent =
        `${taxaOcupacao}% de ocupação`;

    document.getElementById("tag-lotes-ale").innerHTML = `
        <span class="tag__ponto"></span>
        ${lotesAle} Ale`;

    document.getElementById("tag-lotes-lager").innerHTML = `
        <span class="tag__ponto"></span>
        ${lotesLager} Lager`;

    // ========================================================
    // KPI — ALERTAS PENDENTES
    // ========================================================

    let alertasPendentes = 0;
    let alertasAcima = 0;
    let alertasAbaixo = 0;

    // Conta os tanques que estão atualmente em desvio.
    for (let i = 0; i < tanquesData.length; i++) {

        let tanque = tanquesData[i];

        if (
            tanque.fk_unidade == unidadeSelecionada &&
            tanque.fk_status_tanque == 2
        ) {

            let desvio = buscarDesvioAtual(tanque.id);

            if (desvio == "Acima" || desvio == "Abaixo") {

                alertasPendentes++;

                if (desvio == "Acima") {
                    alertasAcima++;

                } else {
                    alertasAbaixo++;
                }
            }
        }
    }

    document.getElementById("kpi-alertas-qtd").textContent =
        alertasPendentes;

    let cardAlertas = document.getElementById("card-alertas-pendentes");

    if (alertasPendentes > 0) {

        cardAlertas.classList.add("kpi-card--alerta");

    } else {

        cardAlertas.classList.remove("kpi-card--alerta");
    }

    let tagsAlertas = cardAlertas.querySelector(".kpi-card__tags");

    tagsAlertas.innerHTML = `
        ${alertasAcima > 0 ? `
            <span class="tag tag--alerta">
                <span class="tag__ponto tag__ponto--alerta"></span>
                ${alertasAcima} Acima do ideal
            </span>` : ""}

        ${alertasAbaixo > 0 ? `
            <span class="tag tag--alerta">
                <span class="tag__ponto tag__ponto--alerta"></span>
                ${alertasAbaixo} Abaixo do ideal
            </span>` : ""}
    `;

    // ========================================================
    // KPI — ALERTA MAIS ANTIGO
    // ========================================================

    let alertaMaisAntigo = null;
    let tanqueMaisAntigo = null;

    for (let i = 0; i < alertasData.length; i++) {

        let alerta = alertasData[i];

        // No V4, dt_resolucao NULL significa alerta aberto.
        if (alerta.dt_resolucao == null) {

            let tanque = buscarTanqueAlerta(alerta);

            if (
                tanque != null &&
                tanque.fk_unidade == unidadeSelecionada &&
                tanque.fk_status_tanque == 2
            ) {

                let desvio = buscarDesvioAtual(tanque.id);

                // Só considera se o tanque ainda estiver em desvio.
                if (desvio == "Acima" || desvio == "Abaixo") {

                    if (
                        alertaMaisAntigo == null ||
                        new Date(alerta.dt_alerta) <
                        new Date(alertaMaisAntigo.dt_alerta)
                    ) {

                        alertaMaisAntigo = alerta;
                        tanqueMaisAntigo = tanque;
                    }
                }
            }
        }
    }

    if (alertaMaisAntigo != null) {

        document.getElementById("kpi-antigo-tanque").textContent =
            tanqueMaisAntigo.nome;

        let inicio = new Date(alertaMaisAntigo.dt_alerta);
        let agora = new Date(DATA_REFERENCIA);

        let minutos = Math.floor(
            (agora - inicio) / 60000
        );

        if (minutos < 60) {

            document.getElementById("kpi-antigo-tempo").textContent =
                `há ${minutos} minutos`;

        } else {

            let horas = Math.floor(minutos / 60);
            let restante = minutos % 60;

            document.getElementById("kpi-antigo-tempo").textContent =
                `há ${horas}h ${restante}min`;
        }

        let desvio = buscarDesvioAtual(tanqueMaisAntigo.id);

        document.getElementById("kpi-antigo-tag").innerHTML = `
            <span class="tag__ponto tag__ponto--alerta"></span>
            ${desvio == "Acima" ? "Acima do ideal" : "Abaixo do ideal"}
        `;

        document.getElementById("kpi-antigo-rodape").textContent =
            `Desde ${alertaMaisAntigo.dt_alerta.slice(11, 19)} · aguardando revisão`;

    } else {

        document.getElementById("kpi-antigo-tanque").textContent = "—";

        document.getElementById("kpi-antigo-tempo").textContent =
            "Nenhum tanque em desvio";

        document.getElementById("kpi-antigo-tag").innerHTML = "";

        document.getElementById("kpi-antigo-rodape").textContent = "";
    }

    // ========================================================
    // KPI — OCORRÊNCIAS NAS ÚLTIMAS 24 HORAS
    // ========================================================

    let totalOcorrencias = 0;
    let ocorrenciasResolvidas = 0;
    let ocorrenciasAbertas = 0;

    let agora24h = new Date(DATA_REFERENCIA);

    let inicio24h = new Date(
        agora24h.getTime() - (24 * 60 * 60 * 1000)
    );

    for (let i = 0; i < alertasData.length; i++) {

        let alerta = alertasData[i];
        let dataAlerta = new Date(alerta.dt_alerta);

        if (dataAlerta >= inicio24h && dataAlerta <= agora24h) {

            let tanque = buscarTanqueAlerta(alerta);

            if (
                tanque != null &&
                tanque.fk_unidade == unidadeSelecionada &&
                tanque.fk_status_tanque == 2
            ) {

                totalOcorrencias++;

                if (alerta.dt_resolucao == null) {

                    ocorrenciasAbertas++;

                } else {

                    ocorrenciasResolvidas++;
                }
            }
        }
    }

    document.getElementById("kpi-desvios-qtd").textContent =
        totalOcorrencias;

    document.getElementById("kpi-desvios-resolvidos").textContent =
        `${ocorrenciasResolvidas} resolvidos`;

    document.getElementById("kpi-desvios-abertos").textContent =
        `${ocorrenciasAbertas} em aberto`;

    document.getElementById("kpi-desvios-unidade").textContent =
        "Últimas 24 horas";

    // ========================================================
    // KPI — RODAPÉ DOS ALERTAS PENDENTES
    // ========================================================

    if (alertaMaisAntigo != null) {

        document.getElementById("kpi-alerta-tempo").textContent =
            `Desde ${alertaMaisAntigo.dt_alerta.slice(11, 19)} · aguardando revisão`;

    } else {

        document.getElementById("kpi-alerta-tempo").textContent =
            "Nenhum alerta pendente";
    }
}

// ============================================================
// BLOCO 3 — TANQUES E DESVIOS POR TANQUE
// ============================================================

function atualizarTabelaTanques() {

    let unidadeSelecionada = document.getElementById("select-unidade").value;

    let tabela = document.getElementById("tabela-tanques-body");
    let contador = document.getElementById("contador-tanques-desvio");
    let rodape = document.getElementById("tabela-tanques-rodape");

    let tabelaHTML = "";
    let tanquesEmDesvio = 0;

    for (let i = 0; i < tanquesData.length; i++) {

        let tanque = tanquesData[i];

        // Exibe os tanques em uso da unidade selecionada.
        if (
            tanque.fk_unidade == unidadeSelecionada &&
            tanque.fk_status_tanque == 2
        ) {

            let dados = buscarDadosAtuaisTanque(tanque.id);

            if (dados != null) {

                let lote = dados.lote;
                let cerveja = dados.cerveja;
                let leitura = dados.leitura;

                let temperatura = Number(leitura.temperatura);

                let desvio = verificarTemperatura(
                    temperatura,
                    Number(cerveja.temperatura_min),
                    Number(cerveja.temperatura_max)
                );

                // Só exibe tanques fora da faixa ideal.
                if (desvio == "Acima" || desvio == "Abaixo") {

                    tanquesEmDesvio++;

                    let temperaturaHTML = "";
                    let statusHTML = "";

                    if (desvio == "Acima") {

                        temperaturaHTML = `
                            <span class="temp-valor temp-alerta">
                                ${temperatura.toFixed(1)}°C ↑
                            </span>
                        `;

                        statusHTML = `
                            <span class="tag-status tag-desvio">
                                Em desvio
                            </span>
                        `;

                    } else {

                        temperaturaHTML = `
                            <span class="temp-valor">
                                ${temperatura.toFixed(1)}°C ↓
                            </span>
                        `;

                        statusHTML = `
                            <span class="tag-status tag-desvio">
                                Em desvio
                            </span>
                        `;
                    }

                    let faixaIdeal =
                        `${cerveja.temperatura_min}–${cerveja.temperatura_max}°C`;

                    tabelaHTML += `
                        <tr class="linha-tanque">
                            <td>
                                <span class="tanque-id">${tanque.nome}</span>
                            </td>

                            <td>
                                ${cerveja.nome} · Lote ${lote.codigo}
                            </td>

                            <td>${temperaturaHTML}</td>

                            <td>
                                <span class="faixa-valor">${faixaIdeal}</span>
                            </td>

                            <td>${statusHTML}</td>

                            <td>
                                <i class="fa-solid fa-play btn-detalhes"
                                data-tanque="${tanque.id}"></i>
                            </td>
                        </tr>

                        <tr class="linha-detalhes" id="detalhes-${tanque.id}" hidden>
                            <td colspan="6">
                                ${montarDetalhesTanque(
                        tanque,
                        dados.producao,
                        lote,
                        cerveja,
                        leitura
                    )}
                            </td>
                        </tr>
                    `;
                }
            }
        }
    }

    // Atualiza a tabela.
    if (tabelaHTML == "") {

        tabelaHTML = `
            <tr>
                <td colspan="6">
                    Nenhum tanque está fora da faixa ideal de temperatura.
                </td>
            </tr>
        `;
    }

    tabela.innerHTML = tabelaHTML;

    // Controla a abertura dos detalhes.
    tabela.onclick = function (event) {

        let icone = event.target.closest(".btn-detalhes");

        if (icone != null) {

            let idTanque = icone.getAttribute("data-tanque");

            let detalhes = document.getElementById(
                `detalhes-${idTanque}`
            );

            if (detalhes != null) {

                detalhes.classList.toggle("aberto");
                icone.classList.toggle("ativo");

                icone.closest(".linha-tanque")
                    .classList.toggle("selecionada");
            }
        }
    };

    // Atualiza o contador de tanques em desvio.
    contador.textContent =
        `${tanquesEmDesvio} tanques em desvio`;

    // Atualiza o rodapé da tabela.
    if (tanquesEmDesvio == 0) {

        rodape.textContent =
            "Nenhum tanque está fora da faixa ideal de temperatura.";

    } else {

        rodape.textContent =
            `${tanquesEmDesvio} tanques fora da faixa ideal de temperatura.`;
    }
}

// ============================================================
// ATUALIZAÇÃO DO MONITOR
// ============================================================

function atualizarMonitor() {

    atualizarKPIs();
    atualizarTabelaTanques();
    atualizarDesviosPorTanque();
}

// Atualiza KPIs, tabela e gráficos ao trocar a unidade.
document.getElementById("select-unidade").onchange = atualizarMonitor;

// Carregamento inicial.
atualizarMonitor();

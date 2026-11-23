import {
    DATA_REFERENCIA,
    unidadesData,
    tanquesData,
    sensoresData,
    leiturasSensoresData,
    cervejasData,
    lotesData,
    producoesData,
    alertasData,
    historicoTemperaturasData
} from "../../MOCK_DATA/mock_data.js";

function buscarUltimaLeitura(idSensor) {
    let ultimaLeitura = null;

    for(let i = 0; i < leiturasSensoresData.length; i++){
        let leitura = leiturasSensoresData[i];

        if(leitura.fk_sensor == idSensor){
            if (ultimaLeitura == null || leitura.dataHora > ultimaLeitura.dataHora) {
                ultimaLeitura = leitura;
            }
        }
    }
    return ultimaLeitura;
}

function buscarSensorTanque(idTanque) {
    for(let i = 0; i < sensoresData.length; i++){
        if (sensoresData[i].fk_tanque == idTanque) {
            return sensoresData[i];
        }
    }
    return null;
}


function buscarProducaoAtiva(idTanque) {
    for(let i = 0; i < producoesData.length; i++){
        let producao = producoesData[i];

        if(producao.fk_tanque == idTanque && producao.status == "Em andamento"){
            return producao;
        }
    }
    return null;
}

function buscarLote(idLote) {
    for(let i = 0; i < lotesData.length; i++){
        if(lotesData[i].id == idLote){
            return lotesData[i];
        }
    }
    return null;
}

function buscarCerveja(idCerveja) {
    for(let i = 0; i < cervejasData.length; i++){
        if(cervejasData[i].id == idCerveja){
            return cervejasData[i];
        }
    }
    return null;
}

function verificarTemperatura(temperatura, minima, maxima) {
    if(temperatura > maxima){
        return "Acima";
    }

    if(temperatura < minima){
        return "Abaixo";
    }
    return "Normal";
}

function buscarCervejaTanque(idTanque) {
    for(let i = 0; i < producoesData.length; i++){
        let producao = producoesData[i];

        if(producao.fk_tanque == idTanque){
            let lote = buscarLote(producao.fk_lote);

            if(lote != null){
                return buscarCerveja(lote.fk_cerveja);
            }
        }
    }
    return null;
}

// Calcula a porcentagem de tempo dentro da faixa ideal
function calcularAderencia(idLote) {
    let agora = new Date(DATA_REFERENCIA);
    let inicioMonitoramento = null;
    let tempoDentro = 0;

    for(let i = 0; i < historicoTemperaturasData.length; i++){
        let historico = historicoTemperaturasData[i];

        if(historico.fk_lote == idLote){
            let inicio = new Date(historico.dataInicio);
            let fim;

            if(historico.dataFim == null){
                fim = agora;
            }else{
                fim = new Date(historico.dataFim);
            }

            if(inicioMonitoramento == null || inicio < inicioMonitoramento){
                inicioMonitoramento = inicio;
            }

            if(historico.situacao == "Dentro"){
                tempoDentro += fim - inicio;
            }
        }
    }

    if(inicioMonitoramento == null){
        return 0;
    }

    let tempoTotal = agora - inicioMonitoramento;

    if(tempoTotal <= 0){
        return 0;
    }

    let aderencia = (tempoDentro / tempoTotal) * 100;
    return Math.round(aderencia);
}

// Busca os períodos de temperatura de um lote
function buscarHistoricoLote(idLote) {
    let historicoLote = [];

    for(let i = 0; i < historicoTemperaturasData.length; i++){
        let historico = historicoTemperaturasData[i];

        if(historico.fk_lote == idLote){
            historicoLote.push(historico);
        }
    }

    return historicoLote;
}

// Monta os detalhes da produção do tanque

function montarDetalhesTanque(tanque, producao, lote, cerveja) {
    let aderencia = calcularAderencia(lote.id);
    let historico = buscarHistoricoLote(lote.id);

    let agora = new Date(DATA_REFERENCIA);
    let inicio = new Date(producao.dataInicio);

    // Calcula o dia atual da fermentação
    let diasPassados = Math.floor((agora - inicio) / (1000 * 60 * 60 * 24)) + 1;

    if(diasPassados < 1){
        diasPassados = 1;
    }

    if(diasPassados > cerveja.diasFermentacao){
        diasPassados = cerveja.diasFermentacao;
    }

    // Verifica o status atual pelo último histórico
    let status = "Dentro da faixa";

    if(historico.length > 0){
        let ultimoHistorico = historico[historico.length - 1];

        if(ultimoHistorico.situacao == "Fora"){
            status = "Em desvio";
        }
    }

    let classeStatus = status == "Em desvio" ? "alerta" : "";

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
                    <strong>${cerveja.estilo}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Levedura</span>
                    <strong>${cerveja.levedura}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Volume do lote</span>
                    <strong>${lote.volume.toLocaleString("pt-BR")} litros</strong>
                </div>

                <div class="detalhes-item">
                    <span>Início</span>
                    <strong>${inicio.toLocaleDateString("pt-BR")}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Progresso</span>
                    <strong>Dia ${diasPassados} de ${cerveja.diasFermentacao} dias</strong>
                </div>

                <div class="detalhes-item">
                    <span>Aderência térmica</span>
                    <strong>${aderencia}%</strong>
                </div>

                <div class="detalhes-item">
                    <span>Status</span>
                    <strong class="${classeStatus}">${status}</strong>
                </div>

                <div class="detalhes-item">
                    <span>Faixa ideal do estilo</span>
                    <strong>${cerveja.temperaturaMinima}°C a ${cerveja.temperaturaMaxima}°C</strong>
                </div>

            </div>
        </div>
    `;
}


// Verifica o desvio atual do tanque
function buscarDesvioAtual(idTanque) {
    let producao = buscarProducaoAtiva(idTanque);

    if(producao == null){
        return "Normal";
    }

    let lote = buscarLote(producao.fk_lote);

    if(lote == null){
        return "Normal";
    }

    let cerveja = buscarCerveja(lote.fk_cerveja);

    if(cerveja == null){
        return "Normal";
    }

    let sensor = buscarSensorTanque(idTanque);

    if(sensor == null){
        return "Normal";
    }

    let leitura = buscarUltimaLeitura(sensor.id);

    if(leitura == null){
        return "Normal";
    }

    return verificarTemperatura(
        leitura.temperatura,
        cerveja.temperaturaMinima,
        cerveja.temperaturaMaxima
    );
}

// Busca o tanque relacionado ao alerta
function buscarTanqueAlerta(alerta) {
    for(let i = 0; i < leiturasSensoresData.length; i++){
        let leitura = leiturasSensoresData[i];

        if(leitura.id == alerta.fk_leitura_sensor){
            for(let j = 0; j < sensoresData.length; j++){
                let sensor = sensoresData[j];

                if(sensor.id == leitura.fk_sensor){
                    for(let k = 0; k < tanquesData.length; k++){
                        let tanque = tanquesData[k];

                        if(tanque.id == sensor.fk_tanque){
                            return tanque;
                        }
                    }
                }
            }
        }
    }
    return null;
}

let unidadeInicialCarregada = false;


// BLOCO — DESVIOS POR TANQUE

// BLOCO — DESVIOS POR TANQUE
function atualizarDesviosPorTanque() {
    let unidadeSelecionada = document.getElementById("select-unidade").value;
    let lista = document.getElementById("lista-desvios-tanques");
    let unidadeTexto = document.getElementById("desvio-tanque-unidade");
    let demais = document.getElementById("desvios-demais-tanques");
    let tempoResposta = document.getElementById("valor-tempo-resposta");

    let agora = new Date(DATA_REFERENCIA);
    let inicio24h = new Date(agora);
    inicio24h.setHours(inicio24h.getHours() - 24);

    let desviosPorTanque = [];
    let tanquesSemDesvio = 0;

    // Identifica a unidade selecionada
    for(let i = 0; i < unidadesData.length; i++){
        if(unidadesData[i].id == unidadeSelecionada){
            unidadeTexto.textContent = "Todos os tanques · últimas 24 horas";
        }
    }

    // Adiciona todos os tanques da unidade
    for(let i = 0; i < tanquesData.length; i++){
        let tanque = tanquesData[i];

        if(tanque.fk_unidade == unidadeSelecionada){
            desviosPorTanque.push({
                id: tanque.id,
                nome: tanque.nome,
                ocorrencias: 0
            });
        }
    }

    // Conta as ocorrências de cada tanque nas últimas 24 horas
    for(let i = 0; i < alertasData.length; i++){
        let alerta = alertasData[i];
        let dataAlerta = new Date(alerta.dataInicio);

        if(dataAlerta >= inicio24h && dataAlerta <= agora){
            let tanque = buscarTanqueAlerta(alerta);

            if(tanque != null && tanque.fk_unidade == unidadeSelecionada){
                for(let j = 0; j < desviosPorTanque.length; j++){
                    if(desviosPorTanque[j].id == tanque.id){
                        desviosPorTanque[j].ocorrencias++;
                    }
                }
            }
        }
    }

    // Ordena do maior número de ocorrências para o menor
    for(let i = 0; i < desviosPorTanque.length; i++){
        for(let j = i + 1; j < desviosPorTanque.length; j++){
            if(desviosPorTanque[j].ocorrencias > desviosPorTanque[i].ocorrencias){
                let temporario = desviosPorTanque[i];
                desviosPorTanque[i] = desviosPorTanque[j];
                desviosPorTanque[j] = temporario;
            }
        }
    }

    // Separa os tanques sem ocorrências
    let tanquesComDesvio = [];

    for(let i = 0; i < desviosPorTanque.length; i++){
        if(desviosPorTanque[i].ocorrencias > 0){
            tanquesComDesvio.push(desviosPorTanque[i]);
        }else{
            tanquesSemDesvio++;
        }
    }

    // Monta a lista de tanques com desvio
    let listaHTML = "";
    let maiorQuantidade = 0;

    if(tanquesComDesvio.length > 0){
        maiorQuantidade = tanquesComDesvio[0].ocorrencias;
    }

    for(let i = 0; i < tanquesComDesvio.length; i++){
        let tanque = tanquesComDesvio[i];
        let porcentagem = (tanque.ocorrencias / maiorQuantidade) * 100;

        let classeDestaque = "";

        if(i == 0){
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

    lista.innerHTML = listaHTML;

    // Atualiza a quantidade de tanques sem desvio
    demais.hidden = false;
    demais.textContent = `Demais ${tanquesSemDesvio} tanques · 0 desvios`;

    // Calcula o tempo médio de resposta dos alertas resolvidos
    let totalMinutos = 0;
    let totalAlertasResolvidos = 0;

    for(let i = 0; i < alertasData.length; i++){
        let alerta = alertasData[i];
        let dataInicio = new Date(alerta.dataInicio);

        if(dataInicio >= inicio24h && dataInicio <= agora && alerta.status != "Aberto"){
            let tanque = buscarTanqueAlerta(alerta);

            if(tanque != null && tanque.fk_unidade == unidadeSelecionada){
                let dataResolucao = new Date(alerta.dataResolucao);

                if(!isNaN(dataResolucao.getTime())){
                    let minutos = (dataResolucao - dataInicio) / 60000;

                    if(minutos >= 0){
                        totalMinutos += minutos;
                        totalAlertasResolvidos++;
                    }
                }
            }
        }
    }

    if(totalAlertasResolvidos > 0){
        let media = Math.round(totalMinutos / totalAlertasResolvidos);
        tempoResposta.textContent = `${media} min`;
    }else{
        tempoResposta.textContent = "—";
    }
}

// BLOCO 2 — BADGE E KPIs
function atualizarKPIs() {
    let selectUnidade = document.getElementById("select-unidade");

    if(selectUnidade.options.length == 0){
        for(let i = 0; i < unidadesData.length; i++){
            let unidade = unidadesData[i];

            let opcao = document.createElement("option");
            opcao.value = unidade.id;
            opcao.textContent = unidade.nome;

            selectUnidade.appendChild(opcao);
        }
    }

    if(!unidadeInicialCarregada){
        let parametrosURL = new URLSearchParams(window.location.search);
        let unidadeURL = parametrosURL.get("unidade");
        // Verifica se a unidade recebida existe
        let unidadeEncontrada = false;
        
        for(let i = 0; i < unidadesData.length; i++){
            if(unidadesData[i].id == unidadeURL){
            unidadeEncontrada = true;
            }
        }

        if(unidadeEncontrada){
            selectUnidade.value = unidadeURL;
        }else if(selectUnidade.options.length > 0){
            selectUnidade.value = selectUnidade.options[0].value;
        }
        unidadeInicialCarregada = true;
    }

    let unidadeSelecionada = selectUnidade.value;

    // KPI — OCUPAÇÃO
    let totalTanques = 0;
    let tanquesEmUso = 0;
    let lotesAle = 0;
    let lotesLager = 0;

    for(let i = 0; i < tanquesData.length; i++){
        let tanque = tanquesData[i];

        if(tanque.fk_unidade == unidadeSelecionada){
            totalTanques++;

            if(tanque.status == "Em uso"){
                tanquesEmUso++;

                let cerveja = buscarCervejaTanque(tanque.id);

                if(cerveja != null){
                    if(cerveja.estilo == "Ale"){
                        lotesAle++;
                    }else if(cerveja.estilo == "Lager"){
                        lotesLager++;
                    }
                }
            }
        }
    }

    let taxaOcupacao = 0;

    if(totalTanques > 0){
        taxaOcupacao = Math.round((tanquesEmUso / totalTanques) * 100);
    }

    document.getElementById("kpi-lotes-qtd").textContent = tanquesEmUso;
    document.getElementById("kpi-ocupacao-total").textContent = ` de ${totalTanques} tanques`;
    document.getElementById("kpi-ocupacao-taxa").textContent = `${taxaOcupacao}% de ocupação`;

    document.getElementById("tag-lotes-ale").innerHTML = `
    <span class="tag__ponto"></span>
    ${lotesAle} Ale`;

    document.getElementById("tag-lotes-lager").innerHTML = `
    <span class="tag__ponto"></span>
    ${lotesLager} Lager`;

    // KPI — ALERTAS PENDENTES
    let alertasPendentes = 0;
    let alertasAcima = 0;
    let alertasAbaixo = 0;

    // Conta os tanques que estão atualmente em desvio
    for(let i = 0; i < tanquesData.length; i++){
        let tanque = tanquesData[i];

        if(tanque.fk_unidade == unidadeSelecionada && tanque.status == "Em uso"){
            let desvio = buscarDesvioAtual(tanque.id);

            if(desvio == "Acima" || desvio == "Abaixo"){
                alertasPendentes++;

                if(desvio == "Acima"){
                    alertasAcima++;
                }else{
                    alertasAbaixo++;
                }
            }
        }
    }

    // ATUALIZA QUANTIDADE DE ALERTAS
    document.getElementById("kpi-alertas-qtd").textContent = alertasPendentes;

    // ALTERA COR DO CARD
    let cardAlertas = document.getElementById("card-alertas-pendentes");

    if(alertasPendentes > 0){
        cardAlertas.classList.add("kpi-card--alerta");
    } else {
        cardAlertas.classList.remove("kpi-card--alerta");
    }

    // TAGS DOS ALERTAS
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

    // KPI — ALERTA MAIS ANTIGO
    let alertaMaisAntigo = null;
    let tanqueMaisAntigo = null;

    for(let i = 0; i < alertasData.length; i++){
        let alerta = alertasData[i];

        if(alerta.status == "Aberto"){
            let tanque = buscarTanqueAlerta(alerta);

            if(tanque != null && tanque.fk_unidade == unidadeSelecionada && tanque.status == "Em uso"){
                let desvio = buscarDesvioAtual(tanque.id);

                // Só considera se o tanque ainda estiver em desvio
                if(desvio == "Acima" || desvio == "Abaixo"){
                    if (alertaMaisAntigo == null || alerta.dataInicio < alertaMaisAntigo.dataInicio){
                        alertaMaisAntigo = alerta;
                        tanqueMaisAntigo = tanque;
                    }
                }
            }
        }
    }

    if(alertaMaisAntigo != null){
        document.getElementById("kpi-antigo-tanque").textContent = tanqueMaisAntigo.nome;

        let inicio = new Date(alertaMaisAntigo.dataInicio);
        let agora = new Date(DATA_REFERENCIA);
        let minutos = Math.floor((agora - inicio) / 60000);

        if(minutos < 60){
            document.getElementById("kpi-antigo-tempo").textContent = `há ${minutos} minutos`;
        }else{
            let horas = Math.floor(minutos / 60);
            let restante = minutos % 60;

            document.getElementById("kpi-antigo-tempo").textContent = `há ${horas}h ${restante}min`;
        }

        let desvio = buscarDesvioAtual(tanqueMaisAntigo.id);

        document.getElementById("kpi-antigo-tag").innerHTML = `
        <span class="tag__ponto tag__ponto--alerta"></span>
        ${desvio == "Acima" ? "Acima do ideal" : "Abaixo do ideal"}
        `;

        document.getElementById("kpi-antigo-rodape").textContent = `Desde ${alertaMaisAntigo.dataInicio.slice(11, 19)} · aguardando revisão`;

    }else{
        document.getElementById("kpi-antigo-tanque").textContent = "—";
        document.getElementById("kpi-antigo-tempo").textContent = "Nenhum tanque em desvio";
        document.getElementById("kpi-antigo-tag").innerHTML = "";
        document.getElementById("kpi-antigo-rodape").textContent = "";
    }

    // KPI — OCORRÊNCIAS NAS ÚLTIMAS 24 HORAS
    let totalOcorrencias = 0;
    let ocorrenciasResolvidas = 0;
    let ocorrenciasAbertas = 0;

    let agora24h = new Date(DATA_REFERENCIA);
    let inicio24h = new Date(agora24h);
    inicio24h.setHours(inicio24h.getHours() - 24);
    
    for(let i = 0; i < alertasData.length; i++){
        let alerta = alertasData[i];
        let dataAlerta = new Date(alerta.dataInicio);

        if(dataAlerta >= inicio24h && dataAlerta <= agora24h){
            let tanque = buscarTanqueAlerta(alerta);

            if(tanque != null && tanque.fk_unidade == unidadeSelecionada && tanque.status == "Em uso"){
                totalOcorrencias++;

                if(alerta.status == "Aberto"){
                    ocorrenciasAbertas++;
                }else if(alerta.status == "Resolvido"){
                    ocorrenciasResolvidas++;
                }
            }
        }
    }

    document.getElementById("kpi-desvios-qtd").textContent = totalOcorrencias;

    // Preserva os pontos que já existem no HTML
    document.getElementById("kpi-desvios-resolvidos").textContent = `${ocorrenciasResolvidas} resolvidos`;
    document.getElementById("kpi-desvios-abertos").textContent = `${ocorrenciasAbertas} em aberto`;
    document.getElementById("kpi-desvios-unidade").textContent = "Últimas 24 horas";

    // KPI — RODAPÉ DOS ALERTAS PENDENTES
    if(alertaMaisAntigo != null){
        document.getElementById("kpi-alerta-tempo").textContent = `Desde ${alertaMaisAntigo.dataInicio.slice(11, 19)} · aguardando revisão`;
    }else{
        document.getElementById("kpi-alerta-tempo").textContent = "Nenhum alerta pendente";
    }
}


document.getElementById("select-unidade").onchange = atualizarKPIs;



// BLOCO 3 — TANQUES E DESVIOS POR TANQUE
function atualizarTabelaTanques() {
    let unidadeSelecionada = document.getElementById("select-unidade").value;
    let tabela = document.getElementById("tabela-tanques-body");
    let contador = document.getElementById("contador-tanques-desvio");
    let rodape = document.getElementById("tabela-tanques-rodape");

    let tabelaHTML = "";
    let tanquesEmDesvio = 0;

    for(let i = 0; i < tanquesData.length; i++){
        let tanque = tanquesData[i];

        if(tanque.fk_unidade == unidadeSelecionada && tanque.status == "Em uso"){

            let producao = buscarProducaoAtiva(tanque.id);

            if(producao != null){
                let lote = buscarLote(producao.fk_lote);

                if(lote != null){
                    let cerveja = buscarCerveja(lote.fk_cerveja);

                    if(cerveja != null){
                        let sensor = buscarSensorTanque(tanque.id);

                        if(sensor != null){
                            let leitura = buscarUltimaLeitura(sensor.id);

                            if(leitura != null){
                                let temperatura = leitura.temperatura;
                                let desvio = verificarTemperatura(
                                    temperatura,
                                    cerveja.temperaturaMinima,
                                    cerveja.temperaturaMaxima
                                );

                                // Só exibe tanques fora da faixa ideal
                                if(desvio == "Acima" || desvio == "Abaixo"){
                                    tanquesEmDesvio++;

                                    let temperaturaHTML = "";
                                    let statusHTML = "";

                                    if(desvio == "Acima"){
                                        temperaturaHTML = `<span class="temp-valor temp-alerta">${temperatura.toFixed(1)}°C ↑</span>`;
                                        statusHTML = `<span class="tag-status tag-desvio">Em desvio</span>`;
                                    }else{
                                        temperaturaHTML = `<span class="temp-valor">${temperatura.toFixed(1)}°C ↓</span>`;
                                        statusHTML = `<span class="tag-status tag-desvio">Em desvio</span>`;
                                    }

                                    let faixaIdeal = `${cerveja.temperaturaMinima}–${cerveja.temperaturaMaxima}°C`;

                                    tabelaHTML += `
                                        <tr class="linha-tanque">
                                            <td>
                                                <span class="tanque-id">${tanque.nome}</span>
                                            </td>

                                            <td>${cerveja.nome} · Lote ${lote.codigo || lote.id}</td>

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
                                                ${montarDetalhesTanque(tanque, producao, lote, cerveja)}
                                            </td>
                                        </tr>
                                    `;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Atualiza a tabela
    tabela.innerHTML = tabelaHTML;

    tabela.onclick = function(event){
        let icone = event.target.closest(".btn-detalhes");

        if(icone != null){
            let idTanque = icone.getAttribute("data-tanque");
            let detalhes = document.getElementById(`detalhes-${idTanque}`);

            if(detalhes != null){
                detalhes.classList.toggle("aberto");
                icone.classList.toggle("ativo");
                icone.closest(".linha-tanque").classList.toggle("selecionada");
            }
        }
    };

    // Atualiza contador de tanques em desvio
    contador.textContent = `${tanquesEmDesvio} tanques em desvio`;

    // Atualiza rodapé da tabela
    if(tanquesEmDesvio == 0){
        rodape.textContent = "Nenhum tanque está fora da faixa ideal de temperatura.";
    }else{
        rodape.textContent = `${tanquesEmDesvio} tanques fora da faixa ideal de temperatura.`;
    }
}


// ======================================================
// ATUALIZAÇÃO DO MONITOR
// ======================================================

function atualizarMonitor() {
    atualizarKPIs();
    atualizarTabelaTanques();
    atualizarDesviosPorTanque();
}

// Atualiza KPIs e tabela ao trocar unidade
document.getElementById("select-unidade").onchange = atualizarMonitor;

// Carregamento inicial
atualizarMonitor();
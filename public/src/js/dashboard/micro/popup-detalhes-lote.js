import {
    DATA_REFERENCIA,
    tiposCervejaData,
    levedurasData,
    statusLoteData
} from "../../MOCK_DATA/mock_data.js";
import { formatarNumeroPtBr } from "../funcoes-globais.js";

function buscarNomeTipoCerveja(idTipo) {
    for(let i = 0; i < tiposCervejaData.length; i++){
        if(tiposCervejaData[i].id === idTipo){
            return tiposCervejaData[i].tipo;
        }
    }
    return "—";
}

function buscarNomeLevedura(idLevedura) {
    for(let i = 0; i < levedurasData.length; i++){
        if(levedurasData[i].id === idLevedura){
            return levedurasData[i].nome;
        }
    }
    return "—";
}

function buscarNomeStatusLote(idStatus) {
    for(let i = 0; i < statusLoteData.length; i++){
        if (statusLoteData[i].id === idStatus) {
            return statusLoteData[i].nome;
        }
    }
    return "Em andamento";
}

function formatarDataSimples(dataTexto) {
    if(!dataTexto){
        return "—";
    }

    let dataObj = new Date(dataTexto);
    if(isNaN(dataObj.getTime())){
        return "—";
    }

    let dia = String(dataObj.getDate());
    if(dataObj.getDate() < 10){
        dia = "0" + dia;
    }

    let mesNumero = dataObj.getMonth() + 1;
    let mes = String(mesNumero);
    if(mesNumero < 10){
        mes = "0" + mes;
    }

    let ano = String(dataObj.getFullYear());
    return dia + "/" + mes + "/" + ano;
}

function calcularTerminoPrevisto(lote, cerveja) {
    if(lote && lote.dt_fim){
        return formatarDataSimples(lote.dt_fim);
    }

    if(!lote || !lote.dt_inicio){
        return "—";
    }

    let diasFermentacao = 14;
    if(cerveja && cerveja.tempo_fermentacao_dias){
        diasFermentacao = Number(cerveja.tempo_fermentacao_dias);
    }

    let dataInicio = new Date(lote.dt_inicio);
    if(isNaN(dataInicio.getTime())){
        return "—";
    }

    let dataPrevista = new Date(dataInicio.getTime());
    dataPrevista.setDate(dataPrevista.getDate() + diasFermentacao);

    return formatarDataSimples(dataPrevista);
}

function calcularDiaAtualPopup(lote, totalDias) {
    let dataBase = new Date(DATA_REFERENCIA);
    let dataInicio = new Date(lote.dt_inicio);

    let diaAtual = Math.floor((dataBase - dataInicio) / (1000 * 60 * 60 * 24)) + 1;
    if(isNaN(diaAtual) || diaAtual < 1){
        diaAtual = 1;
    }
    if(diaAtual > totalDias){
        diaAtual = totalDias;
    }
    return diaAtual;
}

function definirTextoElemento(idElemento, texto) {
    let el = document.getElementById(idElemento);
    if(el){
        el.textContent = texto;
    }
}

export function preencherDetalhesLotePopup(lote, cerveja, unidade, tanque) {
    if (!lote) {
        return;
    }

    let tipoTexto = "—";
    let leveduraTexto = "—";
    let faixaTexto = "—";
    let nomeReceita = "Receita";
    let totalDias = 14;

    if(cerveja){
        tipoTexto = buscarNomeTipoCerveja(cerveja.fk_tipo_cerveja);
        leveduraTexto = buscarNomeLevedura(cerveja.fk_levedura);

        if(cerveja.nome){
            nomeReceita = cerveja.nome;
        }

        if(cerveja.tempo_fermentacao_dias){
            totalDias = Number(cerveja.tempo_fermentacao_dias);
        }

        if(cerveja.temperatura_min !== null && cerveja.temperatura_min !== undefined && cerveja.temperatura_max !== null && cerveja.temperatura_max !== undefined){
            faixaTexto = formatarNumeroPtBr(cerveja.temperatura_min, 0) + "°C a " + formatarNumeroPtBr(cerveja.temperatura_max, 0) + "°C";
        }
    }

    let tanqueTexto = "—";
    if(tanque && tanque.nome){
        tanqueTexto = tanque.nome;
    }

    let unidadeTexto = "—";
    if(unidade && unidade.nome){
        unidadeTexto = unidade.nome;
    }

    let volumeTexto = "—";
    if(lote.volume_litros !== null && lote.volume_litros !== undefined){
        volumeTexto = formatarNumeroPtBr(lote.volume_litros, 0) + " litros";
    }

    let diaAtual = calcularDiaAtualPopup(lote, totalDias);
    let statusTexto = buscarNomeStatusLote(lote.fk_status_lote);

    definirTextoElemento("modal-lote-titulo", "Detalhes do lote · Lote " + lote.codigo);
    definirTextoElemento("detalhe-lote-tipo", tipoTexto);
    definirTextoElemento("detalhe-lote-levedura", leveduraTexto);
    definirTextoElemento("detalhe-lote-tanque", tanqueTexto);
    definirTextoElemento("detalhe-lote-unidade", unidadeTexto);
    definirTextoElemento("detalhe-lote-volume", volumeTexto);
    definirTextoElemento("detalhe-lote-inicio", formatarDataSimples(lote.dt_inicio));
    definirTextoElemento("detalhe-lote-termino", calcularTerminoPrevisto(lote, cerveja));
    definirTextoElemento("detalhe-lote-faixa", faixaTexto);
    definirTextoElemento("detalhe-lote-resumo", "Dia " + diaAtual + " de " + totalDias + " · Receita " + nomeReceita);
    definirTextoElemento("detalhe-lote-status", statusTexto);
}

export function configurarEventosPopupLote() {
    let modal = document.getElementById("modal-detalhes-lote");
    let btnAbrir = document.getElementById("btn-detalhes-lote");
    let btnFechar = document.getElementById("btn-fechar-detalhes-lote");

    if (!modal) {
        return;
    }

    if (btnAbrir) {
        btnAbrir.addEventListener("click", function () {
            modal.hidden = false;
        });
    }

    if (btnFechar) {
        btnFechar.addEventListener("click", function () {
            modal.hidden = true;
        });
    }

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
}
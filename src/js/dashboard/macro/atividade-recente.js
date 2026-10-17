import alertaData from "../../MOCK_DATA/alerta.js";
import { getUnidadeSelecionada } from "./filtro-unidades.js";

const selectUnidade = document.getElementById("select-unidade");
const unidade = document.getElementById("atv-recente-unidade-ativa");
const listaAtividadeRecente = document.getElementById(
  "lista-atividades-container",
);

function renderizarAtividadeRecente() {
  unidade.textContent = `Alertas e lotes ${getUnidadeSelecionada()}`;

  let statusAlerta = "";
  let mensagemAlerta = "";
  let descricaoAlerta = "";

  for (let i = 0; i < alertaData.length; i++) {
    if (alertaData[i].status.toLowerCase() === "aberto") {
      statusAlerta = "orange";
      mensagemAlerta = `Alerta aberto &middot; ${alertaData[i].nome_unidade} &middot; ${alertaData[i].nome_tanque}`;
      descricaoAlerta = `Temperatura acima do ideal: ${alertaData[i].temperatura}°C &middot; Lote ${alertaData[i].nome_lote}`;
    } else if (alertaData[i].status.toLowerCase() === "resolvido") {
      statusAlerta = "green";
      mensagemAlerta = `Alerta resolvido &middot; ${alertaData[i].nome_unidade} &middot; ${alertaData[i].nome_tanque}`;
      descricaoAlerta = `Resposta rápida &middot; Lote ${alertaData[i].nome_lote}`;
    } else if (alertaData[i].status.toLowerCase() === "iniciado") {
      statusAlerta = "blue";
      mensagemAlerta = `Lote ${alertaData[i].nome_lote} iniciado`;
      descricaoAlerta = `${alertaData[i].levedura} &middot; ${alertaData[i].nome_unidade} &middot; ${alertaData[i].nome_tanque}`;
    } else {
      statusAlerta = "gray";
      mensagemAlerta = `Lote ${alertaData[i].nome_lote} finalizado`;
      descricaoAlerta = `${alertaData[i].levedura} &middot; ${alertaData[i].nome_unidade} &middot; ${alertaData[i].nome_tanque}`;
    }

    listaAtividadeRecente.innerHTML += `
      <div class="item-atividade">
        <div class="item-atividade-conteudo">
          <span class="atividade-timestamp">${alertaData[i].dt_inicio}</span>
          <div class="atividade-detalhes">
            <div class="atividade-titulo-linha">
              <span class="kpi-dot ${statusAlerta}"></span>
              <span class="atividade-titulo">${mensagemAlerta}</span>
            </div>
            <span class="atividade-descricao">${descricaoAlerta}</span>
          </div>
        </div>
        <a href="#" class="link-ver-lote">Ver lote &rarr;</a>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarAtividadeRecente();
});

selectUnidade.addEventListener("change", () => {
  renderizarAtividadeRecente();
});
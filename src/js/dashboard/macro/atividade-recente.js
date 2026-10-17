import alertaData from "../../MOCK_DATA/alerta.js";
import { getUnidadeSelecionada } from "./filtro-unidades.js";

const atualizarUnidade = document.getElementById("select-unidade");
const unidade = document.getElementById("atv-recente-unidade-ativa");
const listaAtividadeRecente = document.getElementById(
  "lista-atividades-container",
);

function renderizarAtividadeRecente() {
  listaAtividadeRecente.innerHTML = "";
  let unidadeSelecionada = getUnidadeSelecionada();
  unidade.textContent = `Alertas e lotes ${unidadeSelecionada}`;

  let statusAlerta = "";
  let mensagemAlerta = "";
  let descricaoAlerta = "";

  let filterAtividadeRecente = alertaData.filter(
    (item) =>
      item.nome_unidade.toLowerCase() === unidadeSelecionada.toLowerCase(),
  );

  if (filterAtividadeRecente.length === 0) {
    listaAtividadeRecente.innerHTML = `
      <div class="item-atividade-vazio">
        <div class="atividade-vazia-conteudo">
          <span class="atividade-vazia-titulo">Sem alertas ou lotes recentes</span>
          <span class="atividade-vazia-descricao">Nenhuma atividade encontrada na unidade ${unidadeSelecionada}.</span>
        </div>
      </div>
    `;
    return;
  }

  for (let i = 0; i < filterAtividadeRecente.length; i++) {
    if (filterAtividadeRecente[i].status.toLowerCase() === "aberto") {
      statusAlerta = "orange";
      mensagemAlerta = `Alerta aberto &middot; ${filterAtividadeRecente[i].nome_unidade} &middot; ${filterAtividadeRecente[i].nome_tanque}`;
      descricaoAlerta = `Temperatura acima do ideal: ${filterAtividadeRecente[i].temperatura}°C &middot; Lote ${filterAtividadeRecente[i].nome_lote}`;
    } else if (filterAtividadeRecente[i].status.toLowerCase() === "resolvido") {
      statusAlerta = "green";
      mensagemAlerta = `Alerta resolvido &middot; ${filterAtividadeRecente[i].nome_unidade} &middot; ${filterAtividadeRecente[i].nome_tanque}`;
      descricaoAlerta = `Resposta rápida &middot; Lote ${filterAtividadeRecente[i].nome_lote}`;
    } else if (filterAtividadeRecente[i].status.toLowerCase() === "iniciado") {
      statusAlerta = "blue";
      mensagemAlerta = `Lote ${filterAtividadeRecente[i].nome_lote} iniciado`;
      descricaoAlerta = `${filterAtividadeRecente[i].levedura} &middot; ${filterAtividadeRecente[i].nome_unidade} &middot; ${filterAtividadeRecente[i].nome_tanque}`;
    } else {
      statusAlerta = "gray";
      mensagemAlerta = `Lote ${filterAtividadeRecente[i].nome_lote} finalizado`;
      descricaoAlerta = `${filterAtividadeRecente[i].levedura} &middot; ${filterAtividadeRecente[i].nome_unidade} &middot; ${filterAtividadeRecente[i].nome_tanque}`;
    }

    listaAtividadeRecente.innerHTML += `
      <div class="item-atividade">
        <div class="item-atividade-conteudo">
          <span class="atividade-timestamp">${filterAtividadeRecente[i].dt_inicio}</span>
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

atualizarUnidade.addEventListener("change", () => {
  renderizarAtividadeRecente();
});

import { loteData } from "../../MOCK_DATA/lote.js";
import { getUnidadeSelecionada } from "./filtro-unidades.js";

const selectUnidade = document.getElementById("select-unidade");

function renderizarDesvioTanque() {
  const desvioTanqueUnidade = document.getElementById("desvio-tanque-unidade");
  const listaDesvioTanque = document.getElementById("lista-desvios-tanques");

  let valorMaximoDesvio = 0;
  let valorDesvio = 0;
  let porcentagemDesvio = 0;

  const nomeUnidade = getUnidadeSelecionada();
  desvioTanqueUnidade.innerHTML = `${nomeUnidade} (até agora)`;

  for (let i = 0; i < loteData.length; i++) {
    valorDesvio = loteData[i].desvio;
    if (valorDesvio > valorMaximoDesvio) {
      valorMaximoDesvio = valorDesvio;
    }
  }

  listaDesvioTanque.innerHTML = "";

  for (let i = 0; i < loteData.length; i++) {
    let desvio = loteData[i].desvio;
    porcentagemDesvio = (desvio / valorMaximoDesvio) * 100;
    listaDesvioTanque.innerHTML += `
      <div class="desvio-tanque-row" id="lote-${loteData[i].id}">
        <span class="desvio-tanque-nome">${loteData[i].nome_tanque}</span>
        <div class="desvio-barra-container">
          ${
            desvio === 0
              ? '<span class="desvio-texto-vazio">0 desvios</span>'
              : `<div class="desvio-barra-preenchimento" style="width: ${porcentagemDesvio}%"></div>`
          }
        </div>
        <span class="desvio-tanque-contagem">${desvio}</span>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarDesvioTanque();
});

selectUnidade.addEventListener("change", () => {
  renderizarDesvioTanque();
});

import { tanqueData } from "../../MOCK_DATA/tanque.js";
import { getUnidadeSelecionada } from "./filtro-unidades.js";

const selectUnidade = document.getElementById("select-unidade");

function renderizarDesvioTanque() {
  const nomeUnidade = getUnidadeSelecionada();
  const desvioTanqueUnidade = document.getElementById("desvio-tanque-unidade");
  const listaDesvioTanque = document.getElementById("lista-desvios-tanques");
  listaDesvioTanque.innerHTML = "";

  let valorMaximoDesvio = 0;
  let valorDesvio = 0;
  let porcentagemDesvio = 0;

  desvioTanqueUnidade.innerHTML = `${nomeUnidade} (até agora)`;

  let filterLotePorUnidade = tanqueData.filter(
    (item) => item.nomeUnidade.trim().toLowerCase() === nomeUnidade.trim().toLowerCase(),
  );

  for (let i = 0; i < filterLotePorUnidade.length; i++) {
    valorDesvio = filterLotePorUnidade[i].lote[0].desvio;
    if (valorDesvio > valorMaximoDesvio) {
      valorMaximoDesvio = valorDesvio;
    }
  }

  for (let i = 0; i < filterLotePorUnidade.length; i++) {
    let desvio = filterLotePorUnidade[i].lote[0].desvio;
    porcentagemDesvio = valorMaximoDesvio > 0 ? (desvio / valorMaximoDesvio) * 100 : 0;
    listaDesvioTanque.innerHTML += `
      <div class="desvio-tanque-row" id="tanque-${filterLotePorUnidade[i].id}">
        <span class="desvio-tanque-nome">${filterLotePorUnidade[i].nome}</span>
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

import { tanqueData } from "../../MOCK_DATA/tanque.js";
import { getUnidadeSelecionada } from "./filtro-unidades.js";

let dataAtual = [];
const selectUnidade = document.getElementById("select-unidade");

// Filtra os tanques da unidade selecionada usando for tradicional
function obterTanquesDaUnidade() {
  const unidade = getUnidadeSelecionada().trim().toLowerCase();
  const tanquesFiltrados = [];

  for (let i = 0; i < tanqueData.length; i++) {
    if (tanqueData[i].nomeUnidade.trim().toLowerCase() === unidade) {
      tanquesFiltrados.push(tanqueData[i]);
    }
  }

  return tanquesFiltrados;
}

// Filtros das abas
window.filtrarTodos = function () {
  renderizarTabela(dataAtual);
};

window.filtrarDesvio = function () {
  const desvio = [];
  for (let i = 0; i < dataAtual.length; i++) {
    if (dataAtual[i].status.toLowerCase() === "em desvio") {
      desvio.push(dataAtual[i]);
    }
  }
  renderizarTabela(desvio);
};

window.filtrarFaixa = function () {
  const faixa = [];
  for (let i = 0; i < dataAtual.length; i++) {
    if (dataAtual[i].status.toLowerCase() === "na faixa ideal") {
      faixa.push(dataAtual[i]);
    }
  }
  renderizarTabela(faixa);
};

window.filtrarDisponiveis = function () {
  const disponiveis = [];
  for (let i = 0; i < dataAtual.length; i++) {
    if (dataAtual[i].status.toLowerCase() === "disponivel") {
      disponiveis.push(dataAtual[i]);
    }
  }
  renderizarTabela(disponiveis);
};

// Contadores dos badges
function contarTanques(lista) {
  const countTodos = document.getElementById("count-todos");
  const countDesvio = document.getElementById("count-desvio");
  const countFaixa = document.getElementById("count-faixa");
  const countDisponiveis = document.getElementById("count-disponiveis");

  let desvio = 0;
  let faixa = 0;
  let disponiveis = 0;

  for (let i = 0; i < lista.length; i++) {
    const status = lista[i].status.toLowerCase();
    if (status === "em desvio") {
      desvio++;
    } else if (status === "na faixa ideal") {
      faixa++;
    } else if (status === "disponivel") {
      disponiveis++;
    }
  }

  countTodos.textContent = lista.length;
  countDesvio.textContent = desvio;
  countFaixa.textContent = faixa;
  countDisponiveis.textContent = disponiveis;
}

function renderizarTabela(listaTanques) {
  const tableBody = document.getElementById("tabela-tanques-body");
  tableBody.innerHTML = "";

  for (let i = 0; i < listaTanques.length; i++) {
    let tagClass = "tag-disponivel";

    if (listaTanques[i].status.toLowerCase() === "em desvio") {
      tagClass = "tag-desvio";
    } else if (listaTanques[i].status.toLowerCase() === "na faixa ideal") {
      tagClass = "tag-faixa";
    }

    const desvio = listaTanques[i].status.toLowerCase() === "em desvio";
    const tempClass = desvio ? "temp-alerta" : "temp-normal";
    const iconSeta = desvio
      ? '<i class="fa-solid fa-arrow-up icon-arrow"></i>'
      : "";

    const textoLote = listaTanques[i].nomeLote || listaTanques[i].lote;

    tableBody.innerHTML += `
      <tr
        class="linha-tanque status-desvio"
        data-status="desvio"
        id="row-tq-${listaTanques[i].id}"
      >
        <td class="col-tanque">
          <span class="tanque-id">${listaTanques[i].tanque}</span>
        </td>
        <td class="col-lote">
          <span class="lote-info">${textoLote}</span>
        </td>
        <td class="col-temp">
          <span class="temp-valor ${tempClass}">
            ${typeof listaTanques[i].temperatura === "number" ? `${listaTanques[i].temperatura} ºC` : "-"}
            ${iconSeta}
          </span>
        </td>
        <td class="col-faixa">
          <span class="faixa-valor">${listaTanques[i].min ? `${listaTanques[i].min} ºC - ${listaTanques[i].max} ºC` : "-"}</span>
        </td>
        <td class="col-status">
          <span class="tag-status ${tagClass}">${listaTanques[i].status}</span>
        </td>
        <td class="col-acao">
          ${
            listaTanques[i].status.trim().toLowerCase() !== "disponivel"
              ? `
              <button
                id="btn-detalhes-${listaTanques[i].id}"
                type="button"
                class="btn-detalhes"
                title="Ver detalhes do tanque ${listaTanques[i].tanque}"
                onclick="verDetalhes(${listaTanques[i].id}, 'btn-detalhes-${listaTanques[i].id}')"
              >
                <i class="fa-solid fa-play" aria-hidden="true"></i>
              </button>
            
            `
              : ``
          }
        </td>
      </tr> 

      <tr class="linha-detalhes" id="detalhes-${listaTanques[i].id}">
        <td colspan="6" class="td-detalhes">
          <div class="container-detalhes">
            <div class="detalhes-topo">
              <div class="detalhes-info-lote">
                <span class="detalhes-titulo">
                  Resumo do lote · <strong>${textoLote}</strong>
                </span>
                <span class="detalhes-subtitulo">${listaTanques[i].tanque} · ${listaTanques[i].tipo}</span>
              </div>
              <a href="../dashboard/dashboard-micro.html" class="link-dashboard-lote">
                Abrir no dashboard por lote &rarr;
              </a>
            </div>

            <div class="detalhes-grid">
              <div class="detalhe-card">
                <span class="detalhe-label">Tipo</span>
                <span class="detalhe-valor">${listaTanques[i].tipo ? `${listaTanques[i].tipo}` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Levedura</span>
                <span class="detalhe-valor">${listaTanques[i].levedura ? `${listaTanques[i].levedura}` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Volume do lote</span>
                <span class="detalhe-valor">${listaTanques[i].volumeLote ? `${listaTanques[i].volumeLote} litros` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Início</span>
                <span class="detalhe-valor">${listaTanques[i].dataInicio ? `${listaTanques[i].dataInicio}` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Progresso</span>
                <span class="detalhe-valor">${listaTanques[i].diaAtual ? `${listaTanques[i].diaAtual} de ${listaTanques[i].totalDias} dias` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Aderência térmica</span>
                <span class="detalhe-valor">${listaTanques[i].aderenciaTermica ? `${listaTanques[i].aderenciaTermica}%` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Desvios</span>
                <span class="detalhe-valor alerta">${listaTanques[i].desvios ? `${listaTanques[i].desvios} em aberto` : "-"}</span>
              </div>
              <div class="detalhe-card">
                <span class="detalhe-label">Faixa ideal do estilo</span>
                <span class="detalhe-valor">${listaTanques[i].min ? `${listaTanques[i].min} ºC a ` : "-"}  ${listaTanques[i].max ? `${listaTanques[i].max} ºC` : "-"}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }
}

window.verDetalhes = function (idTanque, idBtn) {
  const btn = document.getElementById(idBtn);
  const detalhesId = document.getElementById(`detalhes-${idTanque}`);
  const tanque = document.getElementById(`row-tq-${idTanque}`);

  if (btn.classList.contains("ativo")) {
    btn.classList.remove("ativo");
    detalhesId.classList.remove("aberto");
    tanque.classList.remove("aberto");
  } else {
    btn.classList.add("ativo");
    detalhesId.classList.add("aberto");
    tanque.classList.add("aberto");
  }
};

// Atualiza tanto a tabela quanto os números de contagem
function atualizarTabelaEContadores() {
  dataAtual = obterTanquesDaUnidade();
  renderizarTabela(dataAtual);
  contarTanques(dataAtual);
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarTabelaEContadores();
});

if (selectUnidade) {
  selectUnidade.addEventListener("change", () => {
    atualizarTabelaEContadores();
  });
}

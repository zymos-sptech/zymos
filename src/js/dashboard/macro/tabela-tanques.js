const data = [
  {
    id: 1,
    tanque: "TQ-01",
    lote: "IPA · Lote 101 - A",
    temperatura: 25.3,
    min: 15,
    max: 24,
    status: "Em desvio",
    totalDias: 14,
    diaAtual: 6,
    tipo: "Ale",
    levedura: "Saccharomyces cerevisiae",
    volumeLote: 8000,
    dataInicio: "20-10-2026",
    aderenciaTermica: 92.4,
    desvios: 1,
  },
  {
    id: 2,
    tanque: "TQ-02",
    lote: "Ale · Lote 096",
    temperatura: 19.4,
    min: 15,
    max: 24,
    status: "Na faixa ideal",
    totalDias: 14,
    diaAtual: 6,
    tipo: "Ale",
    levedura: "Saccharomyces cerevisiae",
    volumeLote: 8000,
    dataInicio: "20-10-2026",
    aderenciaTermica: 99.4,
    desvios: 0,
  },
  {
    id: 3,
    tanque: "TQ-03",
    lote: "Livre para novo lote",
    temperatura: "-",
    min: "",
    max: "",
    status: "Disponivel",
    totalDias: "",
    diaAtual: "",
    tipo: "",
    levedura: "",
    volumeLote: "",
    dataInicio: "",
    aderenciaTermica: "",
    desvios: "",
  },
  {
    id: 4,
    tanque: "TQ-04",
    lote: "Ale · Lote 104",
    temperatura: 20.4,
    min: 15,
    max: 24,
    status: "Na faixa ideal",
    totalDias: 14,
    diaAtual: 1,
    tipo: "Ale",
    levedura: "Saccharomyces cerevisiae",
    volumeLote: 8000,
    dataInicio: "13-10-2026",
    aderenciaTermica: 90.4,
    desvios: 1,
  },
];

let filtro = [];

window.filtrarTodos = function () {
  renderizarTabela(data);
};

window.filtrarDesvio = function () {
  let desvio = data.filter((item) => item.status.toLowerCase() === "em desvio");
  renderizarTabela(desvio);
};

window.filtrarFaixa = function () {
  let faixa = data.filter(
    (item) => item.status.toLowerCase() === "na faixa ideal",
  );
  renderizarTabela(faixa);
};

window.filtrarDisponiveis = function () {
  let disponiveis = data.filter(
    (item) => item.status.toLowerCase() === "disponivel",
  );
  renderizarTabela(disponiveis);
};


function contarTanques() {
  const countTodos = document.getElementById("count-todos");
  const countDesvio = document.getElementById("count-desvio");
  const countFaixa = document.getElementById("count-faixa");
  const countDisponiveis = document.getElementById("count-disponiveis");

  let desvio = data.filter(
    (item) => item.status.toLowerCase() === "em desvio",
  ).length;

  let faixa = data.filter(
    (item) => item.status.toLowerCase() === "na faixa ideal",
  ).length;


  let disponiveis = data.filter(
    (item) => item.status.toLowerCase() === "disponivel",
  ).length;


  countTodos.textContent = data.length;
  countDesvio.textContent = desvio;
  countFaixa.textContent = faixa;
  countDisponiveis.textContent = disponiveis;
}

function renderizarTabela(data) {
  const tableBody = document.getElementById("tabela-tanques-body");

  tableBody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let tagClass = "tag-disponivel";

    if (data[i].status.toLowerCase() === "em desvio") {
      tagClass = "tag-desvio";
    } else if (data[i].status.toLowerCase() === "na faixa ideal") {
      tagClass = "tag-faixa";
    }

    const desvio = data[i].status.toLowerCase() === "em desvio";
    const tempClass = desvio ? "temp-alerta" : "temp-normal";
    const iconSeta = desvio
      ? '<i class="fa-solid fa-arrow-up icon-arrow"></i>'
      : "";

    tableBody.innerHTML += `
         <tr
                class="linha-tanque status-desvio"
                data-status="desvio"
                id="row-tq-${data[i].id}"
              >
                <td class="col-tanque">
                  <span class="tanque-id">${data[i].tanque}</span>
                </td>
                <td class="col-lote">
                  <span class="lote-info">${data[i].lote}</span>
                </td>
                <td class="col-temp">
                  <span class="temp-valor ${tempClass}">
                    ${typeof data[i].temperatura === "number" ? `${data[i].temperatura} ºC` : "-"}
                    ${iconSeta}
                  </span>
                </td>
                <td class="col-faixa">
                  <span class="faixa-valor">${data[i].min ? `${data[i].min} ºC - ${data[i].max} ºC` : "-"}</span>
                </td>
                <td class="col-status">
                  <span class="tag-status ${tagClass}">${data[i].status}</span>
                </td>
                <td class="col-acao">
                  <button
                    id="btn-detalhes-${data[i].id}"
                    type="button"
                    class="btn-detalhes"
                    title="Ver detalhes do tanque ${data[i].tanque}"
                    onclick="verDetalhes(${data[i].id}, 'btn-detalhes-${data[i].id}')"
                  >
                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                  </button>
                </td>
              </tr> 

<tr class="linha-detalhes" id="detalhes-${data[i].id}">
  <td colspan="6" class="td-detalhes">
    <div class="container-detalhes">
      
      <div class="detalhes-topo">
        <div class="detalhes-info-lote">
          <span class="detalhes-titulo">
            Resumo do lote · <strong>${data[i].lote}</strong>
          </span>
          <span class="detalhes-subtitulo">${data[i].tanque} · ${data[i].tipo}</span>
        </div>
        <a href="#" class="link-dashboard-lote">
          Abrir no dashboard por lote &rarr;
        </a>
      </div>

      <div class="detalhes-grid">
        <div class="detalhe-card">
          <span class="detalhe-label">Tipo</span>
          <span class="detalhe-valor">${data[i].tipo ? `${data[i].tipo}` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Levedura</span>
          <span class="detalhe-valor">${data[i].levedura ? `${data[i].levedura}` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Volume do lote</span>
          <span class="detalhe-valor">${data[i].volumeLote ? `${data[i].volumeLote} litros` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Início</span>
          <span class="detalhe-valor">${data[i].dataIniciot ? `${data[i].dataInico}` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Progresso</span>
          <span class="detalhe-valor">${data[i].diaAtual ? `${data[i].diaAtual} de ${data[i].totalDias} dias` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Aderência térmica</span>
          <span class="detalhe-valor">${data[i].aderenciaTermica ? `${data[i].aderenciaTermica}%` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Desvios</span>
          <span class="detalhe-valor alerta">${data[i].desvios ? `${data[i].desvios} em aberto` : "-"}</span>
        </div>
        <div class="detalhe-card">
          <span class="detalhe-label">Faixa ideal do estilo</span>
          <span class="detalhe-valor">${data[i].min ? `${data[i].min} ºC a ` : "-"}  ${data[i].max ? `${data[i].max} ºC` : "-"}</span>
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
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarTabela(data);
  contarTanques();
});
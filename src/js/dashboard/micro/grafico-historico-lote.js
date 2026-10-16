// DEFINIÇÂO DOS ELEMENTOS HTML
const ctx = document.getElementById("canvas_grafico_historico");
const select_lotes = document.getElementById("grafico_historico_lote1");
const select_lotes_comparativos = document.getElementById(
  "grafico_historico_lote2",
);
const div_legendas = document.getElementById("legenda_grafico_historico");
const div_filtros_dia = document.getElementById("filtros_dia");

// DEFINIÇÃO DOS DADOS MOCADOS
// definindo lotes principais (lotes disponíveis do cliente)
const exemplo_lotes = [
  {
    nome: "Lote 101-A",
    data: [20.1, 20.5, 20.9, 21.5, 21.9, 22.6, 22.5, 23.3],
    faixa_min: 18, // de acordo com o tipo de fermentação e receita
    faixa_max: 23,
    tipo: "IPA", // mudar para estilo
    estilo: "Ale",
    duracao: 14,
  },
  {
    nome: "Lote 099",
    data: [23.5, 24, 22, 20, 19.5, 19, 18.7, 18.3, 18, 18.2, 18.7, 18, 18.2],
    faixa_min: 18,
    faixa_max: 23,
    tipo: "IPA",
    estilo: "Ale",
    duracao: 14,
  },
  {
    nome: "Lote 095",
    data: [
      10, 10.2, 10.4, 10.5, 10.4, 10.8, 10.8, 10.6, 11, 12.1, 13.1, 13.7, 13.9,
    ],
    faixa_min: 8,
    faixa_max: 14,
    tipo: "Pilsen",
    estilo: "Lager",
    duracao: 21,
  },
];
// definindo lotes para comparação
const lotes_comparativos = [
  {
    nome: "Lote 101-B",
    data: [
      19.1, 19.6, 19.9, 20.3, 20.7, 21.3, 21.6, 21.5, 21.3, 21.2, 21, 20.7,
      20.6, 20.8,
    ],
    faixa_min: 18, // de acordo com o tipo de fermentação e receita
    faixa_max: 23,
    tipo: "IPA",
    estilo: "Ale",
    duracao: 14,
  },
  {
    nome: "Lote 098",
    data: [
      22.5, 22, 21, 20.5, 20, 19.7, 19.6, 19.1, 18.7, 18.2, 18.3, 18.9, 19,
      19.9,
    ],
    faixa_min: 18,
    faixa_max: 23,
    tipo: "IPA",
    estilo: "Ale",
    duracao: 14,
  },
  {
    nome: "Lote 094",
    data: [
      9, 9.2, 9.4, 9.5, 9.4, 9.8, 10.2, 10.4, 10.8, 11.1, 11.1, 11.7, 11.6,
      11.3, 11, 10.4, 10, 9.9, 9.9, 10, 10.5,
    ],
    faixa_temp: 8,
    faixa_max: 14,
    tipo: "Pilsen",
    estilo: "Lager",
    duracao: 21,
  },
];
// carregar opções dos selects
function carregarLotes() {
  select_lotes.innerHTML = "";
  for (let i = 0; i < exemplo_lotes.length; i++) {
    select_lotes.innerHTML += `<option value='${i}'>${exemplo_lotes[i].nome}</option>`;
  }
}
function carregarLotesComparativos() {
  let lote_principal = exemplo_lotes[select_lotes.value];
  select_lotes_comparativos.innerHTML = "";
  for (let i = 0; i < lotes_comparativos.length; i++) {
    if (lote_principal.tipo == lotes_comparativos[i].tipo) {
      select_lotes_comparativos.innerHTML += `<option value='${lotes_comparativos[i].nome}'>${lotes_comparativos[i].nome}</option>`;
    }
  }
}

// Definindo configuração (data, options) para criação do new Chart
function setupConfig(lote1, lote2, n_dias) {
  const labels = []; // rotulos do eixo x => dias/horas
  const faixa = { min: [], max: [] }; // definir quantidade de registros para exibição em relação aos dias/horas
  if (n_dias == 1) {
    // mostrar horas --> PRECISA BUSCAR OS DADOS DE REGISTROS POR HORA (OUTRO SELECT) PARA EXIBIÇÂO CORRETA
    for (let hora = 1; hora <= 24; hora++) {
      labels.push(hora + ":00");
      faixa.min.push(lote1.faixa_min);
      faixa.max.push(lote1.faixa_max);
    }
  } else {
    for (let dia = 1; dia <= n_dias; dia++) {
      labels.push("Dia " + dia);
      faixa.min.push(lote1.faixa_min);
      faixa.max.push(lote1.faixa_max);
    }
  }
  const config = {
    data: {
      labels: labels,
      datasets: [
        {
          type: "line",
          label: lote1.nome,
          data: lote1.data,
          backgroundColor: "#246",
          borderWidth: 2,
          borderColor: "#246",
          tension: 0.4,
          cubicInterpolationMode: "monotone",
        },
        {
          type: "line",
          label: lote2.nome,
          data: lote2.data,
          backgroundColor: "#C73",
          borderWidth: 2,
          borderColor: "#C73",
          borderDash: [4],
          tension: 0.4,
          cubicInterpolationMode: "monotone",
        },
        {
          type: "line",
          label: "Faixa Ideal",
          data: faixa.max,
          fill: 3,
          backgroundColor: "#EEE7",
          pointStyle: false,
          borderWidth: 0,
        },
        {
          type: "line",
          label: "",
          data: faixa.min,
          fill: false,
          pointStyle: false,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRattio: false,
      aspectRadio: 4,
      scales: {
        y: {
          min: faixa.min[0] - 3,
          max: faixa.max[0] + 3,
          step: 5,
          grid: { display: true },
        },
        x: {
          grid: { display: false },
        },
      },
      plugins: {
        legend: {
          labels: {
            filter: (item) => Boolean(item.text),
          },
          display: false,
        },
      },
    },
  };
  return config;
}

// CRIANDO O GRÁFICO
function newChart(lote1, lote2) {
  return new Chart(ctx, setupConfig(lote1, lote2, lote1.duracao));
}

// EXIBIR LEGENDAS EM OUTRA DIV
function exibirLegendas() {
  let legendas = [];
  let html = "";
  for (let i = 0; i < chart.legend.legendItems.length; i++) {
    let legenda = {
      titulo: chart.legend.legendItems[i].text,
      cor: chart.legend.legendItems[i].fillStyle,
      estiloLinha:
        chart.legend.legendItems[i].lineDash[0] > 0 ? "dashed" : "solid",
    };
    legendas.push(legenda);
  }
  for (let j = 0; j < legendas.length; j++) {
    html += `
                <div style="width: 3em; height: 0.1em; border: 0.15em ${legendas[j].estiloLinha} ${legendas[j].cor};" class="${legendas[j].titulo.replace(" ", "_").toLowerCase()}"></div>
                <p class="legenda_titulo">${legendas[j].titulo}</p>
                `;
  }

  div_legendas.innerHTML = html;
}
// Aplicar os valores dos lotes e tempo para exibição no chart.js (update)
function atualizarConfig() {
  const lote1 = exemplo_lotes[select_lotes.value];
  const lote2 = lotes_comparativos.find(
    (l) => l.nome === select_lotes_comparativos.value,
  );
  // filtros por dia/hora
  let active = document.getElementsByClassName("active");
  let id = active[0].id;
  let n_dias = 0;

  if (id == "tempo_real") n_dias = lote1.data.length;
  else if (id == "ultimas_24h") n_dias = 1;
  else if (id == "lote_completo")
    n_dias = lote1.duracao > lote2.duracao ? lote1.duracao : lote2.duracao;

  let nova_config = setupConfig(lote1, lote2, n_dias);
  chart.data = nova_config.data;
  chart.options = nova_config.options;
  chart.update("none");
  exibirLegendas();
}

// DEFINIÇÃO DE EVENTOS & LISTENERS
// carregando lotes nos selects, de acordo com os lotes disponíveis e lotes comparativos do mesmo tipo
carregarLotes();
carregarLotesComparativos();
// criando um novo chart
const chart = newChart(
  exemplo_lotes[0],
  lotes_comparativos[0],
  exemplo_lotes[0].duracao,
);
// evento ONCHANGE dos SELECTs
select_lotes.addEventListener("change", () => {
  carregarLotesComparativos();
  atualizarConfig();
});
select_lotes_comparativos.addEventListener("change", () => {
  atualizarConfig();
});
// evento ONCLICK no filtro de período
div_filtros_dia.addEventListener("click", (event) => {
  const id = event.target.id;

  if (id != div_filtros_dia.id) {
    for (let i = 0; i < div_filtros_dia.childElementCount; i++) {
      if (div_filtros_dia.children[i].id == id) {
        div_filtros_dia.children[i].classList.add("active");
      } else div_filtros_dia.children[i].classList.remove("active");
    }
  }
  atualizarConfig();
});
// exibir legendas de acordo com os lotes selecionados nos SELECTs
exibirLegendas();

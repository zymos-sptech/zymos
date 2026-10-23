// DEFINIÇÂO DOS ELEMENTOS HTML
const ctx = document.getElementById("canvas_grafico_historico");
const select_lotes = document.getElementById("grafico_historico_lote1");
const select_lotes_comparativos = document.getElementById("grafico_historico_lote2");
const div_legendas = document.getElementById("legenda_grafico_historico");
const div_filtros_dia = document.getElementById("filtros_dia");

// DEFINIÇÃO DOS DADOS MOCADOS
// definindo lotes principais (lotes disponíveis do cliente)
const exemplo_lotes = [
  {
    nome: "Lote 101-A",
    data: [22.2, 21.5, 21.9, 22.5, 23.6, 22.6, 22.5, 24.2],
    data_24h: [
      21.1, 21.5, 21.4, 21.7, 21.6, 21.9, 21.8, 22.1, 22.2, 22.3, 22.2, 22.0, 22.1, 24.2
    ],
    faixa_min: 18, // de acordo com o tipo de fermentação e receita
    faixa_max: 23,
    tipo: "IPA", // mudar para estilo
    estilo: "Ale",
    duracao: 14,
  }
];
// definindo lotes para comparação
const lotes_comparativos = [
  {
    nome: "Lote 099",
    data: [
      19.1, 19.6, 19.9, 20.3, 20.7, 21.3, 21.6, 21.5, 21.3, 21.2, 21, 20.7,
      20.6, 20.8,
    ],
    data_24h: [
      21.1, 21.2, 21.3, 21.3, 21.4, 21.4,
      21.5, 21.5, 21.5, 21.6, 21.6, 21.7,
      21.7, 21.6, 21.6, 21.5, 21.5, 21.4,
      21.4, 21.3, 21.3, 21.2, 21.1, 21.2
    ],
    faixa_min: 18,
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
    data_24h: [
      18.7, 18.8, 18.9, 18.9, 19.0, 19.0,
      19.1, 19.1, 19.1, 19.2, 19.2, 19.3,
      19.3, 19.2, 19.2, 19.1, 19.1, 19.0,
      19.0, 18.9, 18.9, 18.8, 18.7, 18.8
    ],
    faixa_min: 18,
    faixa_max: 23,
    tipo: "IPA",
    estilo: "Ale",
    duracao: 14,
  }
];
// carregar opções dos selects
function carregarLotes() {
  select_lotes.innerHTML = "";
  select_lotes.innerHTML += `<p>${exemplo_lotes[0].nome}</p>`;

}
function carregarLotesComparativos() {
  let lote_principal = exemplo_lotes[0];
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
  let data1 = lote1.data
  let data2 = lote2.data
  if (n_dias == 1) {
    data1 = lote1.data_24h
    data2 = lote2.data_24h
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
          data: data1,
          backgroundColor: "#426084",
          borderWidth: 2,
          borderColor: "#426084",
          tension: 0.4,
          cubicInterpolationMode: "monotone",
        },
        {
          type: "line",
          label: lote2.nome,
          data: data2,
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
          backgroundColor: "#e8efe6A5",
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
      maintainAspectRatio: false,
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
  const lote1 = exemplo_lotes[0];
  const lote2 = lotes_comparativos.find(
    (l) => l.nome === select_lotes_comparativos.value,
  );
  // filtros por dia/hora
  let filtro_escolhido = document.getElementsByClassName("active");
  let id = filtro_escolhido[0].id;
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

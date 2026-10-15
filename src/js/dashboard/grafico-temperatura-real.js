const graficoTempReal = document.getElementById("temperaturaRealGrafico");

// cores do global.css
const corLinha = "#426084"; // --color-blue-dark
const corFaixa = "#E7EEE3"; // --color-green-light

const labels = [
  "14:32:00",
  "14:32:02",
  "14:32:04",
  "14:32:06",
  "14:32:08",
  "14:32:10",
  "14:32:12",
  "14:32:14",
  "14:32:16",
  "14:32:18",
];

const temperaturas = [17, 18, 17, 18.5, 17.5, 25.2, 24.7, 25.5, 25.4, 25.2];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Temperatura real",
      data: temperaturas,
      borderColor: corLinha,
      borderWidth: 2,
      pointBackgroundColor: corLinha,
      pointBorderColor: corLinha,
      pointRadius: 4,
      fill: false,
      tension: 0.1,
    },
    {
      label: "Faixa máx.",
      data: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
      backgroundColor: corFaixa,
      borderWidth: 0,
      pointRadius: 0,
      fill: "+1",
    },
    {
      label: "Faixa mín.",
      data: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
      borderWidth: 0,
      pointRadius: 0,
      fill: false,
    },
  ],
};

new Chart(graficoTempReal, {
  type: "line",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 25, right: 20 },
    },
    scales: {
      y: {
        min: 12,
        max: 28,
      },
    },
    plugins: {
      legend: { display: false },
    },
  },
});

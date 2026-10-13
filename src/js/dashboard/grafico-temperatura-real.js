const graficoTempReal = document.getElementById("temperaturaRealGrafico");

const labels = [
  "09:44:13",
  "09:44:43",
  "09:45:13",
  "09:45:43",
  "09:46:13",
  "09:46:43",
  "09:47:13",
];

const data = {
  labels: labels,
  datasets: [
    {
      type: "line",
      label: "Temperatura real",
      data: [14, 14, 14, 18, 23, 12, 12],
      fill: false,
      borderColor: "#1F3F55",
      tension: 0.1,
    },
    {
      type: "line",
      label: "Faixa ideal",
      data: [18, 18, 18, 18, 18, 18, 18],
      borderColor: "rgba(255, 99, 132, 1)", // Cor da linha vermelha
      backgroundColor: "rgba(255, 99, 132, 0.3)", // Cor do preenchimento com transparência
      borderWidth: 2,
      fill: "+1", // TRANSFORMA EM GRÁFICO DE ÁREA
      tension: 0.4,
    },
    {
      type: "line",
      data: [8, 8, 8, 8, 8, 8, 8, 8],
      borderColor: "rgba(255, 99, 132, 1)", // Cor da linha vermelha
      backgroundColor: "rgba(255, 99, 132, 0.3)", // Cor do preenchimento com transparência
      borderWidth: 2,
      fill: false, // TRANSFORMA EM GRÁFICO DE ÁREA
      tension: 0.4,
    },
  ],
};

new Chart(graficoTempReal, {
  data: data,
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
      },
    },
    plugins: {

    },
  },
});

import userData from "../../MOCK_DATA/user.js";

const selectUnidade = document.getElementById("select-unidade");
const unidadeSelecionada = document.getElementById("unidade-ativa");

function renderizarUnidades() {
  for (let i = 0; i < userData.unidades.length; i++) {
    if (i === 0) {
      selectUnidade.innerHTML += `<option value="${userData.unidades[i].id}" selected>
    ${userData.unidades[i].nome}</option>`;
      unidadeSelecionada.textContent =
        selectUnidade.options[selectUnidade.selectedIndex].text;
    } else {
      selectUnidade.innerHTML += `<option value="${userData.unidades[i].id}">
    ${userData.unidades[i].nome}</option>`;
    }
  }
}

window.sltUnidade = () => {
  unidadeSelecionada.textContent =
    selectUnidade.options[selectUnidade.selectedIndex].text;
};

function getUnidadeSelecionada() {
  return selectUnidade.options[selectUnidade.selectedIndex].text;
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarUnidades();
});

export { getUnidadeSelecionada };

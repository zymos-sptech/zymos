// Seleção dos botões de quantidade de tanques
document.addEventListener("DOMContentLoaded", () => {
  const botoesTanque = document.querySelectorAll(
    ".contato-botao-opcao-tanque"
  );

  botoesTanque.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Remove a classe "selecionado" de todos os botões
      botoesTanque.forEach((outro) => {
        outro.classList.remove("selecionado");
      });

      // Adiciona a classe só no botão clicado
      botao.classList.add("selecionado");
    });
  });
});

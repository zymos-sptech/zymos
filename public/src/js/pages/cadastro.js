window.passwordVisible = function () {
  let inputPassword = document.getElementById("iptPassword");
  let iconVisible = document.getElementById("iconPasswordVisible");
  let iconInvisible = document.getElementById("iconPasswordInvisible");

  iconVisible.style.display = "block";
  iconInvisible.style.display = "none";
  inputPassword.type = "text";
};

window.passwordInvisible = function () {
  let inputPassword = document.getElementById("iptPassword");
  let iconVisible = document.getElementById("iconPasswordVisible");
  let iconInvisible = document.getElementById("iconPasswordInvisible");

  iconVisible.style.display = "none";
  iconInvisible.style.display = "block";
  inputPassword.type = "password";
};

window.confirmPasswordVisible = function () {
  let inputPassword = document.getElementById("iptConfirmPassword");
  let iconVisible = document.getElementById("iconConfirmPasswordVisible");
  let iconInvisible = document.getElementById("iconConfirmPasswordInvisible");

  iconVisible.style.display = "block";
  iconInvisible.style.display = "none";
  inputPassword.type = "text";
};

window.confirmPasswordInvisible = function () {
  let inputPassword = document.getElementById("iptConfirmPassword");
  let iconVisible = document.getElementById("iconConfirmPasswordVisible");
  let iconInvisible = document.getElementById("iconConfirmPasswordInvisible");

  iconVisible.style.display = "none";
  iconInvisible.style.display = "block";
  inputPassword.type = "password";
};

sessionStorage.CODIGO = "ZYM-AMB1-2026";
sessionStorage.CARGO = "administrador";

const codigo = document.getElementById("iptCodigo");
const username = document.getElementById("iptNome");
const email = document.getElementById("iptEmail");
const password = document.getElementById("iptPassword");
const confirmPasword = document.getElementById("iptConfirmPassword");

window.handleFormCadastro = () => {
  sessionStorage.removeItem("NOME_COMPLETO");
  sessionStorage.removeItem("EMAIL");
  sessionStorage.removeItem("PASSWORD");

  if (codigo.value !== sessionStorage.getItem("CODIGO")) {
    return alert("Código inválido");
  }

  if (username.value.length < 3) {
    return alert("Digite um nome válido");
  }

  if (!email.value.includes("@")) {
    return alert("Digite um email válido");
  }

  let senha = password.value;
  let confirmSenha = confirmPasword.value;
  if (senha.length < 8) {
    return alert("Digite uma senha mais forte");
  } else if (senha !== confirmSenha) {
    return alert("A senha e a confirmação de senha não conferem")
  }

  sessionStorage.NOME_COMPLETO = username.value.trim();
  sessionStorage.EMAIL = email.value.trim();
  sessionStorage.PASSWORD = senha;

  window.location = "../pages/login.html";
};

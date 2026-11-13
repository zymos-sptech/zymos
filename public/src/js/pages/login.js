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

const iptEmail = document.getElementById("iptEmail");
const iptPassword = document.getElementById("iptPassword");

const erroEmail = document.getElementById("erroEmail");
const erroSenha = document.getElementById("erroSenha");

iptEmail.addEventListener("input", () => {
  let msg = validarEmail(iptEmail.value);
  mostrarErro(iptEmail, erroEmail, msg);
});

iptPassword.addEventListener("input", () => {
  let msg = iptPassword.value.trim() === "" ? "" : "";
  mostrarErro(iptPassword, erroSenha, msg);
});

window.handleFormLogin = async () => {
  let emailVal = iptEmail.value.trim();
  let senhaVal = iptPassword.value;

  let tudoCerto = true;

  let msgEmail = validarEmail(emailVal);
  mostrarErro(iptEmail, erroEmail, msgEmail);
  if (msgEmail !== "") {
    tudoCerto = false;
  }

  let msgSenha = senhaVal === "" ? "Digite sua senha." : "";
  mostrarErro(iptPassword, erroSenha, msgSenha);
  if (msgSenha !== "") {
    tudoCerto = false;
  }

  if (!tudoCerto) {
    const primeiroInvalido = document.querySelector("login-input.invalido.");
    if (primeiroInvalido) {
      primeiroInvalido.focus();
    }
    return;
  }

  // const SESSION_EMAIL = sessionStorage.getItem("EMAIL");
  // const SESSION_PASSWORD = sessionStorage.getItem("PASSWORD");

  // if (!SESSION_EMAIL || !SESSION_PASSWORD) {
  //   mostrarErro(iptEmail, erroEmail, "Email ou senha incorretos.");
  //   iptEmail.focus();
  //   return;
  // }

  // if (emailVal !== SESSION_EMAIL || senhaVal !== SESSION_PASSWORD) {
  //   mostrarErro(iptEmail, erroEmail, "E-mail ou senha incorretos.");
  //   mostrarErro(iptPassword, erroSenha, "E-mail ou senha incorretos.");
  //   iptEmail.focus();
  //   return;
  // }

  await fetch("/usuarios/autenticar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailVal,
      senha: senhaVal,
    }),
  })
    .then(async function (response) {
      if (response.ok) {
        const data = await response.json();
        sessionStorage.ID_USUARIO = data.id;
        ((sessionStorage.NOME = data.nome),
          (sessionStorage.EMAIL = data.email));
        sessionStorage.CARGO = data.cargo;

        setTimeout(() => {
          window.location = "../pages/dashboard/visao-geral.html";
        }, 5000);
      } else {
        mostrarErro(iptEmail, erroEmail, "Email ou senha incorretos.");
        iptEmail.focus();
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mostrarErro(iptEmail, erroEmail, "Email ou senha incorretos.");
      iptEmail.focus();
    });
};

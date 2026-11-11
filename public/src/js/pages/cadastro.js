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

const iptCodigo = document.getElementById("iptCodigo");
const iptNome = document.getElementById("iptNome");
const iptEmail = document.getElementById("iptEmail");
const iptPassword = document.getElementById("iptPassword");
const iptConfirmPasword = document.getElementById("iptConfirmPassword");

const erroCodigo = document.getElementById("erroCodigo");
const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");
const erroSenha = document.getElementById("erroSenha");
const erroConfirmacao = document.getElementById("erroConfirmacao");

const divForca = document.getElementById("divForca");
const textoForca = document.getElementById("textoForca");
const reqTamanho = document.getElementById("reqTamanho");
const reqLetraMais = document.getElementById("reqLetraMais");
const reqLetraMinus = document.getElementById("reqLetraMinus");
const reqNumero = document.getElementById("reqNumero");
const reqSimbolo = document.getElementById("reqSimbolo");

if (iptCodigo) {
  iptCodigo.addEventListener("input", () => {
    let msgCodigo = validarCodigo(iptCodigo.value.trim());
    if (msgCodigo === "" && iptCodigo.value.trim() !== sessionStorage.getItem("CODIGO")) {
      msgCodigo = "Código inválido.";
    }
    mostrarErro(iptCodigo, erroCodigo, msgCodigo);
  });
}

if (iptNome) {
  iptNome.addEventListener("input", () => {
    let msg = validarNome(iptNome.value);
    mostrarErro(iptNome, erroNome, msg);
  });
}

if (iptEmail) {
  iptEmail.addEventListener("input", () => {
    let msg = validarEmail(iptEmail.value);
    mostrarErro(iptEmail, erroEmail, msg);
  });
}

if (iptPassword) {
  iptPassword.addEventListener("input", () => {
    let msg = validarSenha(iptPassword.value);
    mostrarErro(iptPassword, erroSenha, msg);
  });
}

if (iptConfirmPasword) {
  iptConfirmPasword.addEventListener("input", () => {
    conferirSenha();
  });
}

function mostrarForca(){
  let r = avaliarSenha(iptPassword.value);
  console.log(r)
  if(r.tamanho){reqTamanho.classList.add("ok");}else{reqTamanho.classList.remove("ok");}
  if(r.letraMais){reqLetraMais.classList.add("ok");}else{reqLetraMais.classList.remove("ok");}
  if(r.letraMinus){reqLetraMinus.classList.add("ok");}else{reqLetraMinus.classList.remove("ok");}
  if(r.numero){reqNumero.classList.add("ok");}else{reqNumero.classList.remove("ok");}
  if(r.especial){reqSimbolo.classList.add("ok");}else{reqSimbolo.classList.remove("ok");}

  if(r.nivel == 0){
    textoForca.textContent = "";
  }else if(r.nivel < 2){
    textoForca.textContent = "Senha fraca";
  }else if(r.nivel < 5){
    textoForca.textContent = "Senha média";
  }else{
    textoForca.textContent = "Senha forte";
  }

  divForca.dataset.nivel = Math.ceil(r.nivel/2);

  if(iptConfirmPasword.value !== ""){
    conferirSenha();
  }
}

function conferirSenha(){
  let mensagem = validarConfirmacao(iptPassword.value, iptConfirmPasword.value);
  mostrarErro(iptConfirmPasword, erroConfirmacao, mensagem);
}

window.handleFormCadastro = () => {
  let codigoVal = iptCodigo.value.trim();
  let nomeVal = iptNome.value.trim();
  let emailVal = iptEmail.value.trim();
  let senhaVal = iptPassword.value;
  let confirmVal = iptConfirmPasword.value;

  let tudoCerto = true;
  let msgCodigo = validarCodigo(codigoVal);
  
  if(codigoVal !== sessionStorage.getItem("CODIGO") && msgCodigo === ""){
    msgCodigo = "Código inválido.";
  }
  mostrarErro(iptCodigo, erroCodigo, msgCodigo);
  if(msgCodigo !== ""){tudoCerto = false;}

  let msgNome = validarNome(nomeVal);
  mostrarErro(iptNome, erroNome, msgNome);
  if (msgNome !== "") {tudoCerto = false;}

  let msgEmail = validarEmail(emailVal);
  mostrarErro(iptEmail, erroEmail, msgEmail);
  if (msgEmail !== "") {tudoCerto = false;}

  let msgSenha = validarSenha(senhaVal);
  mostrarErro(iptPassword, erroSenha, msgSenha);
  if(msgSenha !== "") {tudoCerto = false};

  let msgConfirmacao = validarConfirmacao(senhaVal, confirmVal);
  mostrarErro(iptConfirmPasword, erroConfirmacao, msgConfirmacao);
  if(msgConfirmacao !== "") {tudoCerto = false;} 
  
  if(!tudoCerto){
    const primeiroInvalido = document.querySelector(".cadastro-input.invalido");
    if(primeiroInvalido){
      primeiroInvalido.focus();
    }
    return;
  }

  sessionStorage.removeItem("NOME_COMPLETO");
  sessionStorage.removeItem("EMAIL");
  sessionStorage.removeItem("PASSWORD");

  sessionStorage.NOME_COMPLETO = nomeVal;
  sessionStorage.EMAIL = emailVal;
  sessionStorage.PASSWORD = senhaVal;

  window.location = "../pages/login.html";
};

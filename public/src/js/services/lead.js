let qtdTanques = "5 a 14";

const nomeCompleto = document.getElementById("iptNome");
const emailUser = document.getElementById("iptEmail");
const nomeEmpresa = document.getElementById("iptEmpresa");
const descricaoLead = document.getElementById("iptMensagem");
const chkConsentimento = document.getElementById("chkConsentimento");

const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");
const erroEmpresa = document.getElementById("erroEmpresa");
const erroConsentimento = document.getElementById("erroConsentimento");

function opcaoTanque(qtd) {
  qtdTanques = qtd;
}

if (nomeCompleto) {
  nomeCompleto.addEventListener("input", () => {
    let msg = validarNome(nomeCompleto.value);
    mostrarErro(nomeCompleto, erroNome, msg);
  });
}

if (emailUser) {
  emailUser.addEventListener("input", () => {
    let msg = validarEmail(emailUser.value);
    mostrarErro(emailUser, erroEmail, msg);
  });
}

if (nomeEmpresa) {
  nomeEmpresa.addEventListener("input", () => {
    let msg = validarEmpresa(nomeEmpresa.value);
    mostrarErro(nomeEmpresa, erroEmpresa, msg);
  });
}

if (chkConsentimento) {
  chkConsentimento.addEventListener("change", () => {
    let msg = chkConsentimento.checked
      ? ""
      : "Aceite o termo de consentimento.";
    mostrarErro(chkConsentimento, erroConsentimento, msg);
  });
}

async function criarLead() {
  let nome = nomeCompleto.value.trim();
  let email = emailUser.value.trim();
  let empresa = nomeEmpresa.value.trim();
  let msg = descricaoLead.value.trim();

  let tudoCerto = true;

  let msgNome = validarNome(nome);
  mostrarErro(nomeCompleto, erroNome, msgNome);
  if (msgNome !== "") {
    tudoCerto = false;
  }

  let msgEmail = validarEmail(email);
  mostrarErro(emailUser, erroEmail, msgEmail);
  if (msgEmail !== "") {
    tudoCerto = false;
  }

  let msgEmpresa = validarEmpresa(empresa);
  mostrarErro(nomeEmpresa, erroEmpresa, msgEmpresa);
  if (msgEmpresa !== "") {
    tudoCerto = false;
  }

  let msgConsentimento = chkConsentimento.checked
    ? ""
    : "Aceite o termo de consentimento.";
  mostrarErro(chkConsentimento, erroConsentimento, msgConsentimento);
  if (msgConsentimento !== "") {
    tudoCerto = false;
  }

  if (!tudoCerto) {
    const primeiroInvalido = document.querySelector(".campo-input.invalido");
    if (primeiroInvalido) {
      primeiroInvalido.focus();
    }
    return;
  }

  await fetch("/contato", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeLead: nome,
      emailLead: email,
      empresa: empresa,
      qtdTanques: qtdTanques,
      mensagem: msg,
    }),
  })
    .then(async function (response) {
      console.log(response);

      if (response.ok) {
        nomeCompleto.value = "";
        emailUser.value = "";
        nomeEmpresa.value = "";
        descricaoLead.value = "";
        chkConsentimento.checked = false;
        alert("Contato enviado com sucesso!");
      } else {
        const textoErro = await response.text();
        console.log("Erro ao enviar contato:", textoErro);
      }
    })

    .catch(function (erro) {
      alert("Erro ao enviar contato.");
      console.log(erro);
    });
}

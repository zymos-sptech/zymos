function validarCodigo (valor){
    const codigo = valor.trim();
    if(codigo === ""){
        return("Digite o código de ativação");
    }
    if(codigo.length > 20 || !/^[A-Za-z0-9-]+$/.test(codigo)){
        return("Código inválido. Use apenas letras, números e hífen.");
    }
    return ("");
}

function validarNome (valor){
    const nome = valor.trim();
    if(nome === ""){
        return "Digite seu nome completo.";
    }
    if(nome.split(/\s+/).length < 2){
        return("Digite nome e sobrenome.");
    }
    if(nome.length > 100){
        return("O nome pode ter no máximo 100 caracteres");
    }
    return("");
}

function validarEmail(valor){
    const email = valor.trim();
    if(email === ""){
        return("Digite seu e-amil.");
    }
    if(email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return("Digite um e-mail válido.");
    }
    return("");
}

function avaliarSenha(senha){
    const tamanho = senha.length >= 8;
    const letraMais = /[A-Z]/.test(senha);
    const letraMinus = /[a-z]/.test(senha);
    const numero = /[0-9]/.test(senha);
    const especial = /[!@#$%&*?;.,]/.test(senha);

    
    let nivel = 0;
    if(tamanho) nivel++
    if(letraMais) nivel++
    if(letraMinus) nivel++
    if(numero) nivel++
    if(especial) nivel++

    return{tamanho, letraMais, letraMinus, numero, nivel, especial};
}

function validarSenha(senha){
    if(senha === ""){
        return("Crie uma senha.");
    }
    if(!avaliarSenha(senha).nivel == 5){
        return("A senha precisa cumprir todos os requisitos.");
    }
    return("");
}

function validarConfirmacao(senha, confirmacao){
    if(confirmacao === ""){
        return("Confirme a senha.");
    }
    if(confirmacao !== senha){
        return("As senhas não coincidem.");
    }
    return("");
}

function mostrarErro(inputElement, erroElement, mensagem){
    erroElement.textContent = mensagem;
    inputElement.classList.toggle("invalido", mensagem !== "");
    inputElement.setAttribute("aria-invalid", mensagem !== "" ? "true" : "false");
}
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
    const letra = /[A-Za-zÁ-ÿ]/.test(senha);
    const numero = /[0-9]/.test(senha);
    const misturaLetras = /[a-zà-ÿ]/.test(senha) && /[A-ZÀ-Þ]/.test(senha);
    const especial = /[^A-Za-zÀ-ÿ0-9]/.test(senha);

    const atendeMinimo = tamanho && letra && numero;
    let nivel = 0;
    if(senha.length > 0){nivel = 1;}
    if(atendeMinimo){nivel = 2;}
    if(atendeMinimo && misturaLetras && especial){nivel = 3;}

    return{tamanho, letra, numero, atendeMinimo, nivel};
}

function validarSenha(senha){
    if(senha === ""){
        return("Crie uma senha.");
    }
    if(!avaliarSenha(senha).atendeMinimo){
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
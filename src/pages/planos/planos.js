function exibir(e) {
    const div_resposta = document.getElementById(`${e.id}-resp`)
    if (div_resposta.classList.contains('hide')) {
        div_resposta.classList.remove('hide')
    } else div_resposta.classList.add('hide')
}


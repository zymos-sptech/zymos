function exibir(e) {
    const resposta = document.getElementById(`${e.id}-resp`)
    if (!resposta) return
 
    const perguntas = document.getElementsByClassName('faq-pergunta')
 
   
    let i = 0
    while (i < perguntas.length) {
        const resp = perguntas[i].nextElementSibling
        const seta = perguntas[i].children[1]
 
      
        const abrir = resp.id === resposta.id && resp.classList.contains('hide')
 
        resp.classList.toggle('hide', !abrir)
 
        if (seta) {
            seta.classList.toggle('upside', abrir)
            seta.classList.toggle('downside', !abrir)
        }
        i++
    }
}
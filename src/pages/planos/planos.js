function exibir(e) {
    let ax_id = e.id
    const div_faqs = document.getElementsByClassName('faq-pergunta')
    const div_resposta = document.getElementById(`${ax_id}-resp`)
    const arrow_resposta = document.getElementById(`${ax_id}-i`)
    //loop de todas as divs pergunta
    let i = 0
    while (i < div_faqs.length) {
        let el_faq = div_faqs[i]
        let el_resp = el_faq.nextElementSibling
        let el_arrow = el_faq.childNodes[3]
        if (el_resp.id == div_resposta.id) {
            if (el_resp.classList.contains('hide')) {
                el_resp.classList.remove('hide')
                el_arrow.classList.remove('downside')
                el_arrow.classList.add('upside')
            } else {
                el_resp.classList.add('hide')
                el_arrow.classList.remove('upside')
                el_arrow.classList.add('downside')
            }
        } else {
            el_resp.classList.add('hide')
            el_arrow.classList.remove('upside')
            el_arrow.classList.add('downside')
        }
        i++
    }
}


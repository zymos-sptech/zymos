import userData from "../../MOCK_DATA/user.js"
import { tanqueData } from "../../MOCK_DATA/tanque.js";
import alertaData from "../../MOCK_DATA/alerta.js"

// ELEMENTOS
const tabela_status_body = document.getElementById('tabela_status_unidade_body')
const tabela_status_filtro = document.getElementById('tabela_status_filtro')
const span_numero_unidades = document.getElementById('tabela_status_span_todos')
const span_unidades_desvio = document.getElementById('tabela_status_span_desvios')
const span_unidades_estavel = document.getElementById('tabela_status_span_estaveis')

// DADOS MOCADOS
const lista_aderencia = [95.8, 96.4, 98.3]
let numero_unidades = 0
let unidades_desvios = 0
let unidades_estaveis = 0
let filtro = 0

// FUNCTIONS
function buscarInfoTanques(nome_unidade, tanque_data, alerta_data) {
    let alertas = 0
    let status_alerta = 'Estável'
    let tanques_unidade = {}
    let qtd_tanques_total = 0
    let tanques_em_uso = 0
    let numero_alertas = 0

    for (let i = 0; i < tanque_data.length; i++) {
        if (tanque_data[i].nomeUnidade == nome_unidade) {
            qtd_tanques_total++
            if (tanque_data[i].status != "Disponivel") tanques_em_uso++
            for (let j = 0; j < alerta_data.length; j++) {
                if (
                    tanque_data[i].nomeUnidade == alerta_data[j].nome_unidade &&
                    tanque_data[i].tanque == alerta_data[j].nome_tanque
                ) {
                    numero_alertas++
                    if (alerta_data[j].status == "aberto" || alerta_data[j].status == "iniciado") {
                        alertas++
                        status_alerta = 'Em desvio'
                    }
                }
            }
        }
    }
    
    tanques_unidade = {
        unidade: nome_unidade,
        qtd_tanques: qtd_tanques_total,
        qtd_tanques_uso: tanques_em_uso,
        alertas_aberto: alertas,
        status_unidade: status_alerta,
        aderencia: 0 // total de tempo do desvio em relação ao tempo total da fermentação
    }
    return tanques_unidade
}

// iterando nas unidades
function buscarInfoUnidades(user_data) {
    const info_unidades = []
    for (let i = 0; i < user_data.unidades.length; i++) {
        const dados_unidade = buscarInfoTanques(user_data.unidades[i].nome, tanqueData, alertaData)
        if (dados_unidade.status_unidade == 'Em desvio') unidades_desvios++
        info_unidades.push(dados_unidade)
    }
    numero_unidades = user_data.unidades.length
    unidades_estaveis = numero_unidades - unidades_desvios
    return info_unidades
}

function exibirDadosTabelados() {
    const data_unidades_total = buscarInfoUnidades(userData)
    numero_unidades = data_unidades_total.length
    unidades_desvios = 0
    unidades_estaveis = 0
    let data_unidades = []
    let linha = ''
    let tempo = 14
    let tempo_msg = ''
    let status_alerta = ''
    function tempoInfo(tempo) { return `<br><span class='tabela-status-tempo-alerta'>(há ${tempo} min)</span>` }

    if (filtro == 'desvios') {
        for (let i = 0; i < data_unidades_total.length; i++) {
            if (data_unidades_total[i].status_unidade == 'Em desvio') {
                data_unidades.push(data_unidades_total[i])
            }
        }
    } else if (filtro == 'estaveis') {
        for (let i = 0; i < data_unidades_total.length; i++) {
            if (data_unidades_total[i].status_unidade == 'Estável') {
                data_unidades.push(data_unidades_total[i])
            }
        }
    } else data_unidades = data_unidades_total
    
    for (let i = 0; i < data_unidades.length; i++) {
        if (data_unidades[i].alertas_aberto > 0) {
            tempo_msg = tempoInfo(tempo)
            status_alerta = 'em-desvio'
            unidades_desvios++
        } else unidades_estaveis++
        tempo += 30 + i
        linha += `
            <tr class='tabela-status-linha'>
                <td>${data_unidades[i].unidade}</td>
                <td><span class='tabela-status-qtd-tanques-uso'>${data_unidades[i].qtd_tanques_uso}</span>/${data_unidades[i].qtd_tanques}</td>
                <td>${lista_aderencia[i]}%</td>
                <td>${data_unidades[i].alertas_aberto} em aberto ${tempo_msg}</td>
                <td><div class='tabela-status-alerta ${status_alerta}'>${data_unidades[i].status_unidade}</div></td>
                <td><p class="tabela-status-link">Ver unidade <i class="fa-solid fa-arrow-right"></i></p></td>
        `
    }
    if (data_unidades.length == 0) linha = `<tr><td colspan="6" style="text-align:center;padding:20px;">Nenhuma unidade neste filtro</td></tr>`
    tabela_status_body.innerHTML = linha
    span_numero_unidades.innerHTML = data_unidades.length
    span_unidades_desvio.innerHTML = unidades_desvios
    span_unidades_estavel.innerHTML = unidades_estaveis
}

// EVENTS
const mapaFiltros = {
    'filtro_tabela_status_todos':    'todos',
    'filtro_tabela_status_desvios':  'desvios',
    'filtro_tabela_status_estaveis': 'estaveis'
}

tabela_status_filtro.addEventListener("click", (event) => {
    const id = event.target.closest('.filtros-opcoes')?.id
    if (!id || !mapaFiltros[id]) return
    filtro = mapaFiltros[id]

    for (const child of tabela_status_filtro.children) {
        child.classList.toggle("ativo", child.id === id)
    }

    exibirDadosTabelados()
})

exibirDadosTabelados()
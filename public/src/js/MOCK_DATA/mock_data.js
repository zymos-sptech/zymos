// ======================================================
// MOCK DATA - ZYMOS MVP V4
// Estrutura alinhada ao banco de dados V4
// ======================================================

const DATA_REFERENCIA = "2026-09-28T15:00:00";


// ======================================================
// 1. TABELAS DE DOMINIO
// ======================================================

const planosData = [
    { id: 1, nome: "Basico", tanques_min: 1, tanques_max: 9 },
    { id: 2, nome: "Padrão", tanques_min: 10, tanques_max: 49 },
    { id: 3, nome: "Industrial", tanques_min: 50, tanques_max: null }
];

const cargosData = [
    { id: 1, nome: "Administrador", permisionamento: 1 },
    { id: 2, nome: "Mestre Cervejeiro", permisionamento: 2 },
    { id: 3, nome: "Operador", permisionamento: 3 },
    { id: 4, nome: "Qualidade", permisionamento: 4 }
];

const tiposCervejaData = [
    { id: 1, tipo: "Ale" },
    { id: 2, tipo: "Lager" }
];

const levedurasData = [
    { id: 1, nome: "Saccharomyces cerevisiae" },
    { id: 2, nome: "Saccharomyces pastorianus" },
    { id: 3, nome: "Saccharomyces carlsbergensis" }
];

const statusTanqueData = [
    { id: 1, nome: "Disponivel" },
    { id: 2, nome: "Em uso" },
    { id: 3, nome: "Em limpeza" },
    { id: 4, nome: "Manutencao" },
    { id: 5, nome: "Indisponivel" }
];

const statusLoteData = [
    { id: 1, nome: "Em andamento" },
    { id: 2, nome: "Finalizado" },
    { id: 3, nome: "Cancelado" }
];

const statusUnidadeData = [
    { id: 1, nome: "Solicitada / Em Analise" },
    { id: 2, nome: "Aguardando Setup Hardware" },
    { id: 3, nome: "Ativa" },
    { id: 4, nome: "Inativa" }
];

const statusSensorData = [
    { id: 1, nome: "Ativo" },
    { id: 2, nome: "Inativo" },
    { id: 3, nome: "Manutencao" }
];

const statusContatoData = [
    { id: 1, nome: "Recebido" },
    { id: 2, nome: "Em atendimento" },
    { id: 3, nome: "Concluido" }
];

const tiposAlertaData = [
    { id: 1, nome: "Temperatura abaixo do limite" },
    { id: 2, nome: "Temperatura acima do limite" }
];

const statusChamadoData = [
    { id: 1, nome: "Aberto" },
    { id: 2, nome: "Em atendimento" },
    { id: 3, nome: "Resolvido" },
    { id: 4, nome: "Fechado" }
];


// ======================================================
// 2. EMPRESA
// ======================================================

const empresaData = {
    id: 1,
    fk_plano: 2,
    statuss: 1,
    nome: "Cervejaria Horizonte",
    cnpj: "12345678000190",
    dt_inicio_contrato: "2026-01-10"
};


// ======================================================
// 3. CODIGOS DE ATIVACAO
// ======================================================

const codigosAtivacaoData = [
    {
        id: 1,
        fk_empresa: 1,
        statuss: 1,
        codigo: "ZYMOS-HORIZ-2026",
        dt_geracao: "2026-01-10T10:00:00",
        dt_expiracao: "2026-12-31T23:59:59"
    }
];


// ======================================================
// 4. USUARIOS
// ======================================================

const usuariosData = [
    {
        id: 1,
        fk_empresa: 1,
        fk_cargo: 1,
        statuss: 1,
        nome: "Carlos Silva",
        email: "carlos.silva@cervejariahorizonte.com"
    }
];


// ======================================================
// 5. CONTATOS INSTITUCIONAIS
// ======================================================

const contatosData = [
    {
        id: 1,
        fk_status_contato: 1,
        qtdtanques: 10,
        nome: "Joao Mendes",
        email: "joao@email.com",
        mensagem: "Tenho interesse na plataforma Zymos.",
        dt_contato: "2026-09-20T10:00:00"
    }
];


// ======================================================
// 6. UNIDADES
// ======================================================

const unidadesData = [
    {
        id: 1,
        fk_empresa: 1,
        fk_usuario_criador: 1,
        fk_status_unidade: 3,
        quantidade_tanques: 4,
        cnpj: "12345678000270",
        nome: "Matriz Ribeirao Preto",
        logradouro: "Avenida das Cervejarias",
        numero: "1000",
        complemento: null,
        bairro: "Centro",
        cidade: "Ribeirao Preto",
        uf: "SP",
        cep: "14000000"
    },
    {
        id: 2,
        fk_empresa: 1,
        fk_usuario_criador: 1,
        fk_status_unidade: 3,
        quantidade_tanques: 7,
        cnpj: "12345678000350",
        nome: "Unidade Campinas",
        logradouro: "Avenida Industrial",
        numero: "500",
        complemento: null,
        bairro: "Distrito Industrial",
        cidade: "Campinas",
        uf: "SP",
        cep: "13000000"
    },
    {
        id: 3,
        fk_empresa: 1,
        fk_usuario_criador: 1,
        fk_status_unidade: 3,
        quantidade_tanques: 1,
        cnpj: "12345678000431",
        nome: "Unidade Sorocaba",
        logradouro: "Rodovia Raposo Tavares",
        numero: "2500",
        complemento: "Galpao B",
        bairro: "Zona Industrial",
        cidade: "Sorocaba",
        uf: "SP",
        cep: "18000000"
    }
];


// ======================================================
// 7. CERVEJAS
// ======================================================

const cervejasData = [
    {
        id: 1,
        fk_tipo_cerveja: 1,
        fk_levedura: 1,
        fk_usuario_criador: 1,
        nome: "IPA",
        temperatura_min: 15.0,
        temperatura_max: 24.0,
        tempo_fermentacao_dias: 14
    },
    {
        id: 2,
        fk_tipo_cerveja: 1,
        fk_levedura: 1,
        fk_usuario_criador: 1,
        nome: "Red Ale",
        temperatura_min: 15.0,
        temperatura_max: 24.0,
        tempo_fermentacao_dias: 14
    },
    {
        id: 3,
        fk_tipo_cerveja: 2,
        fk_levedura: 2,
        fk_usuario_criador: 1,
        nome: "Pilsen",
        temperatura_min: 8.0,
        temperatura_max: 14.0,
        tempo_fermentacao_dias: 21
    }
];


// ======================================================
// 8. TANQUES
// ======================================================

const tanquesData = [

    // MATRIZ RIBEIRAO PRETO
    { id: 1, fk_unidade: 1, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-01", capacidade: 10000 },
    { id: 2, fk_unidade: 1, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-02", capacidade: 10000 },
    { id: 3, fk_unidade: 1, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-03", capacidade: 10000 },
    { id: 4, fk_unidade: 1, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-04", capacidade: 10000 },

    // UNIDADE CAMPINAS
    { id: 5, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-05", capacidade: 10000 },
    { id: 6, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-06", capacidade: 10000 },
    { id: 7, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-07", capacidade: 10000 },
    { id: 8, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-08", capacidade: 10000 },
    { id: 9, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 1, nome: "TQ-09", capacidade: 10000 },
    { id: 10, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 1, nome: "TQ-10", capacidade: 10000 },
    { id: 11, fk_unidade: 2, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-11", capacidade: 10000 },

    // UNIDADE SOROCABA (SEM DESVIO)
    { id: 12, fk_unidade: 3, fk_usuario_criador: 1, fk_status_tanque: 2, nome: "TQ-12", capacidade: 10000 }
];


// ======================================================
// 9. SENSORES
// Sensor pertence a unidade, nao diretamente ao tanque.
// ======================================================

const sensoresData = [];

for (let i = 0; i < unidadesData.length; i++) {

    let quantidadeSensores = unidadesData[i].quantidade_tanques;

    for (let j = 0; j < quantidadeSensores; j++) {

        sensoresData.push({
            id: sensoresData.length + 1,
            fk_unidade: unidadesData[i].id,
            fk_status_sensor: 1,
            modelo: "LM35"
        });

    }
}


// ======================================================
// 10. LOTES
// ======================================================

const lotesData = [

    // MATRIZ RIBEIRAO PRETO
    {
        id: 100,
        codigo: "101-A",
        volume_litros: 8000,
        fk_cerveja: 1,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-23T08:00:00",
        dt_fim: null
    },
    {
        id: 101,
        codigo: "096",
        volume_litros: 7000,
        fk_cerveja: 2,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-23T08:00:00",
        dt_fim: null
    },
    {
        id: 102,
        codigo: "095",
        volume_litros: 6000,
        fk_cerveja: 3,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-25T08:00:00",
        dt_fim: null
    },
    {
        id: 103,
        codigo: "087",
        volume_litros: 7500,
        fk_cerveja: 1,
        fk_unidade: 1,
        fk_usuario_criador: 1,
        fk_status_lote: 2,
        dt_inicio: "2026-09-01T08:00:00",
        dt_fim: "2026-09-15T08:00:00"
    },

    // UNIDADE CAMPINAS
    {
        id: 104,
        codigo: "102",
        volume_litros: 9000,
        fk_cerveja: 3,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-20T08:00:00",
        dt_fim: null
    },
    {
        id: 105,
        codigo: "103",
        volume_litros: 8500,
        fk_cerveja: 1,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-22T08:00:00",
        dt_fim: null
    },
    {
        id: 106,
        codigo: "104",
        volume_litros: 6500,
        fk_cerveja: 2,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-24T08:00:00",
        dt_fim: null
    },
    {
        id: 107,
        codigo: "105",
        volume_litros: 7500,
        fk_cerveja: 3,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-26T08:00:00",
        dt_fim: null
    },
    {
        id: 108,
        codigo: "089",
        volume_litros: 7000,
        fk_cerveja: 1,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 2,
        dt_inicio: "2026-09-01T08:00:00",
        dt_fim: "2026-09-15T08:00:00"
    },
    {
        id: 109,
        codigo: "090",
        volume_litros: 5000,
        fk_cerveja: 2,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 2,
        dt_inicio: "2026-08-25T08:00:00",
        dt_fim: "2026-09-08T08:00:00"
    },
    {
        id: 110,
        codigo: "106",
        volume_litros: 6800,
        fk_cerveja: 1,
        fk_unidade: 2,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-28T08:00:00",
        dt_fim: null
    },

    // UNIDADE SOROCABA (SEM DESVIO)
    {
        id: 111,
        codigo: "107",
        volume_litros: 7200,
        fk_cerveja: 2,
        fk_unidade: 3,
        fk_usuario_criador: 1,
        fk_status_lote: 1,
        dt_inicio: "2026-09-24T08:00:00",
        dt_fim: null
    }
];


// ======================================================
// 11. PRODUCOES
// PK composta: fk_lote + fk_tanque
// O sensor e associado durante a producao.
// ======================================================

const producoesData = [

    // MATRIZ RIBEIRAO PRETO
    { fk_lote: 100, fk_tanque: 1, fk_sensor: 1, dt_entrada: "2026-09-23T08:00:00", dt_saida: null },
    { fk_lote: 101, fk_tanque: 2, fk_sensor: 2, dt_entrada: "2026-09-23T08:00:00", dt_saida: null },
    { fk_lote: 102, fk_tanque: 3, fk_sensor: 3, dt_entrada: "2026-09-25T08:00:00", dt_saida: null },
    { fk_lote: 103, fk_tanque: 4, fk_sensor: 4, dt_entrada: "2026-09-01T08:00:00", dt_saida: "2026-09-15T08:00:00" },

    // UNIDADE CAMPINAS
    { fk_lote: 104, fk_tanque: 5, fk_sensor: 5, dt_entrada: "2026-09-20T08:00:00", dt_saida: null },
    { fk_lote: 105, fk_tanque: 6, fk_sensor: 6, dt_entrada: "2026-09-22T08:00:00", dt_saida: null },
    { fk_lote: 106, fk_tanque: 7, fk_sensor: 7, dt_entrada: "2026-09-24T08:00:00", dt_saida: null },
    { fk_lote: 107, fk_tanque: 8, fk_sensor: 8, dt_entrada: "2026-09-26T08:00:00", dt_saida: null },
    { fk_lote: 108, fk_tanque: 9, fk_sensor: 9, dt_entrada: "2026-09-01T08:00:00", dt_saida: "2026-09-15T08:00:00" },
    { fk_lote: 109, fk_tanque: 10, fk_sensor: 10, dt_entrada: "2026-08-25T08:00:00", dt_saida: "2026-09-08T08:00:00" },
    { fk_lote: 110, fk_tanque: 11, fk_sensor: 11, dt_entrada: "2026-09-28T08:00:00", dt_saida: null },

    // UNIDADE SOROCABA (SEM DESVIO)
    { fk_lote: 111, fk_tanque: 12, fk_sensor: 12, dt_entrada: "2026-09-24T08:00:00", dt_saida: null }
];


// ======================================================
// 12. LEITURAS DOS SENSORES
// Todos os lotes com 11 leituras de 2 em 2 segundos (14:32:00 a 14:32:20),
// garantindo 10 pontos visiveis no grafico (14:32:02 a 14:32:20).
// ======================================================

const leiturasSensoresData = [

    // TQ-01 — Lote 101-A (id: 100 · Em andamento · IPA: 15.0 a 24.0 °C · 1 desvio resolvido + 1 aberto)
    { id: 1001, fk_lote: 100, fk_tanque: 1, temperatura: 19.4, dt_medicao: "2026-09-28T14:32:00" },
    { id: 1002, fk_lote: 100, fk_tanque: 1, temperatura: 19.8, dt_medicao: "2026-09-28T14:32:02" },
    { id: 1003, fk_lote: 100, fk_tanque: 1, temperatura: 25.3, dt_medicao: "2026-09-28T14:32:04" },
    { id: 1004, fk_lote: 100, fk_tanque: 1, temperatura: 24.3, dt_medicao: "2026-09-28T14:32:06" },
    { id: 1005, fk_lote: 100, fk_tanque: 1, temperatura: 23.0, dt_medicao: "2026-09-28T14:32:08" },
    { id: 1006, fk_lote: 100, fk_tanque: 1, temperatura: 21.8, dt_medicao: "2026-09-28T14:32:10" },
    { id: 1007, fk_lote: 100, fk_tanque: 1, temperatura: 21.2, dt_medicao: "2026-09-28T14:32:12" },
    { id: 1008, fk_lote: 100, fk_tanque: 1, temperatura: 22.9, dt_medicao: "2026-09-28T14:32:14" },
    { id: 1009, fk_lote: 100, fk_tanque: 1, temperatura: 24.6, dt_medicao: "2026-09-28T14:32:16" },
    { id: 1010, fk_lote: 100, fk_tanque: 1, temperatura: 25.2, dt_medicao: "2026-09-28T14:32:18" },
    { id: 1011, fk_lote: 100, fk_tanque: 1, temperatura: 24.9, dt_medicao: "2026-09-28T14:32:20" },

    // TQ-02 — Lote 096 (id: 101 · Em andamento · Red Ale: 15.0 a 24.0 °C · 1 desvio resolvido, atualmente estavel)
    { id: 2001, fk_lote: 101, fk_tanque: 2, temperatura: 18.6, dt_medicao: "2026-09-28T14:32:00" },
    { id: 2002, fk_lote: 101, fk_tanque: 2, temperatura: 19.2, dt_medicao: "2026-09-28T14:32:02" },
    { id: 2003, fk_lote: 101, fk_tanque: 2, temperatura: 20.1, dt_medicao: "2026-09-28T14:32:04" },
    { id: 2004, fk_lote: 101, fk_tanque: 2, temperatura: 21.4, dt_medicao: "2026-09-28T14:32:06" },
    { id: 2005, fk_lote: 101, fk_tanque: 2, temperatura: 22.2, dt_medicao: "2026-09-28T14:32:08" },
    { id: 2006, fk_lote: 101, fk_tanque: 2, temperatura: 21.9, dt_medicao: "2026-09-28T14:32:10" },
    { id: 2007, fk_lote: 101, fk_tanque: 2, temperatura: 21.2, dt_medicao: "2026-09-28T14:32:12" },
    { id: 2008, fk_lote: 101, fk_tanque: 2, temperatura: 20.6, dt_medicao: "2026-09-28T14:32:14" },
    { id: 2009, fk_lote: 101, fk_tanque: 2, temperatura: 25.0, dt_medicao: "2026-09-28T14:32:16" },
    { id: 2010, fk_lote: 101, fk_tanque: 2, temperatura: 22.8, dt_medicao: "2026-09-28T14:32:18" },
    { id: 2011, fk_lote: 101, fk_tanque: 2, temperatura: 21.7, dt_medicao: "2026-09-28T14:32:20" },

    // TQ-03 — Lote 095 (id: 102 · Em andamento · Pilsen: 8.0 a 14.0 °C · 1 desvio resolvido + 1 aberto abaixo)
    { id: 3001, fk_lote: 102, fk_tanque: 3, temperatura: 10.5, dt_medicao: "2026-09-28T14:32:00" },
    { id: 3002, fk_lote: 102, fk_tanque: 3, temperatura: 9.8,  dt_medicao: "2026-09-28T14:32:02" },
    { id: 3003, fk_lote: 102, fk_tanque: 3, temperatura: 7.0,  dt_medicao: "2026-09-28T14:32:04" },
    { id: 3004, fk_lote: 102, fk_tanque: 3, temperatura: 7.4,  dt_medicao: "2026-09-28T14:32:06" },
    { id: 3005, fk_lote: 102, fk_tanque: 3, temperatura: 8.5,  dt_medicao: "2026-09-28T14:32:08" },
    { id: 3006, fk_lote: 102, fk_tanque: 3, temperatura: 9.2,  dt_medicao: "2026-09-28T14:32:10" },
    { id: 3007, fk_lote: 102, fk_tanque: 3, temperatura: 8.6,  dt_medicao: "2026-09-28T14:32:12" },
    { id: 3008, fk_lote: 102, fk_tanque: 3, temperatura: 8.1,  dt_medicao: "2026-09-28T14:32:14" },
    { id: 3009, fk_lote: 102, fk_tanque: 3, temperatura: 7.5,  dt_medicao: "2026-09-28T14:32:16" },
    { id: 3010, fk_lote: 102, fk_tanque: 3, temperatura: 6.8,  dt_medicao: "2026-09-28T14:32:18" },
    { id: 3011, fk_lote: 102, fk_tanque: 3, temperatura: 7.1,  dt_medicao: "2026-09-28T14:32:20" },

    // TQ-04 — Lote 087 (id: 103 · Finalizado · IPA: 15.0 a 24.0 °C · estavel sem desvios)
    { id: 4001, fk_lote: 103, fk_tanque: 4, temperatura: 18.5, dt_medicao: "2026-09-15T07:59:40" },
    { id: 4002, fk_lote: 103, fk_tanque: 4, temperatura: 19.0, dt_medicao: "2026-09-15T07:59:42" },
    { id: 4003, fk_lote: 103, fk_tanque: 4, temperatura: 19.4, dt_medicao: "2026-09-15T07:59:44" },
    { id: 4004, fk_lote: 103, fk_tanque: 4, temperatura: 20.1, dt_medicao: "2026-09-15T07:59:46" },
    { id: 4005, fk_lote: 103, fk_tanque: 4, temperatura: 20.6, dt_medicao: "2026-09-15T07:59:48" },
    { id: 4006, fk_lote: 103, fk_tanque: 4, temperatura: 20.4, dt_medicao: "2026-09-15T07:59:50" },
    { id: 4007, fk_lote: 103, fk_tanque: 4, temperatura: 20.0, dt_medicao: "2026-09-15T07:59:52" },
    { id: 4008, fk_lote: 103, fk_tanque: 4, temperatura: 19.8, dt_medicao: "2026-09-15T07:59:54" },
    { id: 4009, fk_lote: 103, fk_tanque: 4, temperatura: 19.7, dt_medicao: "2026-09-15T07:59:56" },
    { id: 4010, fk_lote: 103, fk_tanque: 4, temperatura: 19.6, dt_medicao: "2026-09-15T07:59:58" },
    { id: 4011, fk_lote: 103, fk_tanque: 4, temperatura: 19.5, dt_medicao: "2026-09-15T08:00:00" },

    // TQ-05 — Lote 102 (id: 104 · Em andamento · Pilsen: 8.0 a 14.0 °C · 1 desvio aberto acima)
    { id: 5001, fk_lote: 104, fk_tanque: 5, temperatura: 11.2, dt_medicao: "2026-09-28T14:32:00" },
    { id: 5002, fk_lote: 104, fk_tanque: 5, temperatura: 11.6, dt_medicao: "2026-09-28T14:32:02" },
    { id: 5003, fk_lote: 104, fk_tanque: 5, temperatura: 12.0, dt_medicao: "2026-09-28T14:32:04" },
    { id: 5004, fk_lote: 104, fk_tanque: 5, temperatura: 12.5, dt_medicao: "2026-09-28T14:32:06" },
    { id: 5005, fk_lote: 104, fk_tanque: 5, temperatura: 13.1, dt_medicao: "2026-09-28T14:32:08" },
    { id: 5006, fk_lote: 104, fk_tanque: 5, temperatura: 13.6, dt_medicao: "2026-09-28T14:32:10" },
    { id: 5007, fk_lote: 104, fk_tanque: 5, temperatura: 13.9, dt_medicao: "2026-09-28T14:32:12" },
    { id: 5008, fk_lote: 104, fk_tanque: 5, temperatura: 14.3, dt_medicao: "2026-09-28T14:32:14" },
    { id: 5009, fk_lote: 104, fk_tanque: 5, temperatura: 14.8, dt_medicao: "2026-09-28T14:32:16" },
    { id: 5010, fk_lote: 104, fk_tanque: 5, temperatura: 15.4, dt_medicao: "2026-09-28T14:32:18" },
    { id: 5011, fk_lote: 104, fk_tanque: 5, temperatura: 15.1, dt_medicao: "2026-09-28T14:32:20" },

    // TQ-06 — Lote 103 (id: 105 · Em andamento · IPA: 15.0 a 24.0 °C · 1 desvio aberto acima)
    { id: 6001, fk_lote: 105, fk_tanque: 6, temperatura: 20.5, dt_medicao: "2026-09-28T14:32:00" },
    { id: 6002, fk_lote: 105, fk_tanque: 6, temperatura: 21.1, dt_medicao: "2026-09-28T14:32:02" },
    { id: 6003, fk_lote: 105, fk_tanque: 6, temperatura: 21.8, dt_medicao: "2026-09-28T14:32:04" },
    { id: 6004, fk_lote: 105, fk_tanque: 6, temperatura: 22.4, dt_medicao: "2026-09-28T14:32:06" },
    { id: 6005, fk_lote: 105, fk_tanque: 6, temperatura: 23.0, dt_medicao: "2026-09-28T14:32:08" },
    { id: 6006, fk_lote: 105, fk_tanque: 6, temperatura: 23.5, dt_medicao: "2026-09-28T14:32:10" },
    { id: 6007, fk_lote: 105, fk_tanque: 6, temperatura: 23.9, dt_medicao: "2026-09-28T14:32:12" },
    { id: 6008, fk_lote: 105, fk_tanque: 6, temperatura: 24.3, dt_medicao: "2026-09-28T14:32:14" },
    { id: 6009, fk_lote: 105, fk_tanque: 6, temperatura: 24.8, dt_medicao: "2026-09-28T14:32:16" },
    { id: 6010, fk_lote: 105, fk_tanque: 6, temperatura: 24.6, dt_medicao: "2026-09-28T14:32:18" },
    { id: 6011, fk_lote: 105, fk_tanque: 6, temperatura: 24.5, dt_medicao: "2026-09-28T14:32:20" },

    // TQ-07 — Lote 104 (id: 106 · Em andamento · Red Ale: 15.0 a 24.0 °C · 1 desvio aberto abaixo)
    { id: 7001, fk_lote: 106, fk_tanque: 7, temperatura: 19.0, dt_medicao: "2026-09-28T14:32:00" },
    { id: 7002, fk_lote: 106, fk_tanque: 7, temperatura: 18.4, dt_medicao: "2026-09-28T14:32:02" },
    { id: 7003, fk_lote: 106, fk_tanque: 7, temperatura: 17.8, dt_medicao: "2026-09-28T14:32:04" },
    { id: 7004, fk_lote: 106, fk_tanque: 7, temperatura: 17.1, dt_medicao: "2026-09-28T14:32:06" },
    { id: 7005, fk_lote: 106, fk_tanque: 7, temperatura: 16.4, dt_medicao: "2026-09-28T14:32:08" },
    { id: 7006, fk_lote: 106, fk_tanque: 7, temperatura: 15.8, dt_medicao: "2026-09-28T14:32:10" },
    { id: 7007, fk_lote: 106, fk_tanque: 7, temperatura: 15.2, dt_medicao: "2026-09-28T14:32:12" },
    { id: 7008, fk_lote: 106, fk_tanque: 7, temperatura: 14.6, dt_medicao: "2026-09-28T14:32:14" },
    { id: 7009, fk_lote: 106, fk_tanque: 7, temperatura: 13.5, dt_medicao: "2026-09-28T14:32:16" },
    { id: 7010, fk_lote: 106, fk_tanque: 7, temperatura: 13.8, dt_medicao: "2026-09-28T14:32:18" },
    { id: 7011, fk_lote: 106, fk_tanque: 7, temperatura: 14.1, dt_medicao: "2026-09-28T14:32:20" },

    // TQ-08 — Lote 105 (id: 107 · Em andamento · Pilsen: 8.0 a 14.0 °C · 1 desvio resolvido + 1 aberto abaixo)
    { id: 8001, fk_lote: 107, fk_tanque: 8, temperatura: 12.9, dt_medicao: "2026-09-28T14:32:00" },
    { id: 8002, fk_lote: 107, fk_tanque: 8, temperatura: 14.4, dt_medicao: "2026-09-28T14:32:02" },
    { id: 8003, fk_lote: 107, fk_tanque: 8, temperatura: 15.2, dt_medicao: "2026-09-28T14:32:04" },
    { id: 8004, fk_lote: 107, fk_tanque: 8, temperatura: 13.4, dt_medicao: "2026-09-28T14:32:06" },
    { id: 8005, fk_lote: 107, fk_tanque: 8, temperatura: 11.8, dt_medicao: "2026-09-28T14:32:08" },
    { id: 8006, fk_lote: 107, fk_tanque: 8, temperatura: 10.2, dt_medicao: "2026-09-28T14:32:10" },
    { id: 8007, fk_lote: 107, fk_tanque: 8, temperatura: 8.9,  dt_medicao: "2026-09-28T14:32:12" },
    { id: 8008, fk_lote: 107, fk_tanque: 8, temperatura: 7.8,  dt_medicao: "2026-09-28T14:32:14" },
    { id: 8009, fk_lote: 107, fk_tanque: 8, temperatura: 7.5,  dt_medicao: "2026-09-28T14:32:16" },
    { id: 8010, fk_lote: 107, fk_tanque: 8, temperatura: 7.6,  dt_medicao: "2026-09-28T14:32:18" },
    { id: 8011, fk_lote: 107, fk_tanque: 8, temperatura: 7.7,  dt_medicao: "2026-09-28T14:32:20" },

    // TQ-09 — Lote 089 (id: 108 · Finalizado · IPA: 15.0 a 24.0 °C · estavel sem desvios)
    { id: 9001, fk_lote: 108, fk_tanque: 9, temperatura: 18.8, dt_medicao: "2026-09-15T07:59:40" },
    { id: 9002, fk_lote: 108, fk_tanque: 9, temperatura: 19.0, dt_medicao: "2026-09-15T07:59:42" },
    { id: 9003, fk_lote: 108, fk_tanque: 9, temperatura: 19.4, dt_medicao: "2026-09-15T07:59:44" },
    { id: 9004, fk_lote: 108, fk_tanque: 9, temperatura: 19.1, dt_medicao: "2026-09-15T07:59:46" },
    { id: 9005, fk_lote: 108, fk_tanque: 9, temperatura: 18.6, dt_medicao: "2026-09-15T07:59:48" },
    { id: 9006, fk_lote: 108, fk_tanque: 9, temperatura: 18.2, dt_medicao: "2026-09-15T07:59:50" },
    { id: 9007, fk_lote: 108, fk_tanque: 9, temperatura: 17.9, dt_medicao: "2026-09-15T07:59:52" },
    { id: 9008, fk_lote: 108, fk_tanque: 9, temperatura: 17.6, dt_medicao: "2026-09-15T07:59:54" },
    { id: 9009, fk_lote: 108, fk_tanque: 9, temperatura: 17.1, dt_medicao: "2026-09-15T07:59:56" },
    { id: 9010, fk_lote: 108, fk_tanque: 9, temperatura: 16.6, dt_medicao: "2026-09-15T07:59:58" },
    { id: 9011, fk_lote: 108, fk_tanque: 9, temperatura: 16.2, dt_medicao: "2026-09-15T08:00:00" },

    // TQ-10 — Lote 090 (id: 109 · Finalizado · Red Ale: 15.0 a 24.0 °C · estavel sem desvios)
    { id: 10001, fk_lote: 109, fk_tanque: 10, temperatura: 20.2, dt_medicao: "2026-09-08T07:59:40" },
    { id: 10002, fk_lote: 109, fk_tanque: 10, temperatura: 20.5, dt_medicao: "2026-09-08T07:59:42" },
    { id: 10003, fk_lote: 109, fk_tanque: 10, temperatura: 21.1, dt_medicao: "2026-09-08T07:59:44" },
    { id: 10004, fk_lote: 109, fk_tanque: 10, temperatura: 20.8, dt_medicao: "2026-09-08T07:59:46" },
    { id: 10005, fk_lote: 109, fk_tanque: 10, temperatura: 20.3, dt_medicao: "2026-09-08T07:59:48" },
    { id: 10006, fk_lote: 109, fk_tanque: 10, temperatura: 19.8, dt_medicao: "2026-09-08T07:59:50" },
    { id: 10007, fk_lote: 109, fk_tanque: 10, temperatura: 19.5, dt_medicao: "2026-09-08T07:59:52" },
    { id: 10008, fk_lote: 109, fk_tanque: 10, temperatura: 19.3, dt_medicao: "2026-09-08T07:59:54" },
    { id: 10009, fk_lote: 109, fk_tanque: 10, temperatura: 19.1, dt_medicao: "2026-09-08T07:59:56" },
    { id: 10010, fk_lote: 109, fk_tanque: 10, temperatura: 19.0, dt_medicao: "2026-09-08T07:59:58" },
    { id: 10011, fk_lote: 109, fk_tanque: 10, temperatura: 18.9, dt_medicao: "2026-09-08T08:00:00" },

    // TQ-11 — Lote 106 (id: 110 · Iniciado no dia de referencia 2026-09-28 · IPA: 15.0 a 24.0 °C · estavel)
    { id: 11001, fk_lote: 110, fk_tanque: 11, temperatura: 18.4, dt_medicao: "2026-09-28T14:32:00" },
    { id: 11002, fk_lote: 110, fk_tanque: 11, temperatura: 18.7, dt_medicao: "2026-09-28T14:32:02" },
    { id: 11003, fk_lote: 110, fk_tanque: 11, temperatura: 19.1, dt_medicao: "2026-09-28T14:32:04" },
    { id: 11004, fk_lote: 110, fk_tanque: 11, temperatura: 19.5, dt_medicao: "2026-09-28T14:32:06" },
    { id: 11005, fk_lote: 110, fk_tanque: 11, temperatura: 20.0, dt_medicao: "2026-09-28T14:32:08" },
    { id: 11006, fk_lote: 110, fk_tanque: 11, temperatura: 20.3, dt_medicao: "2026-09-28T14:32:10" },
    { id: 11007, fk_lote: 110, fk_tanque: 11, temperatura: 20.6, dt_medicao: "2026-09-28T14:32:12" },
    { id: 11008, fk_lote: 110, fk_tanque: 11, temperatura: 20.9, dt_medicao: "2026-09-28T14:32:14" },
    { id: 11009, fk_lote: 110, fk_tanque: 11, temperatura: 21.0, dt_medicao: "2026-09-28T14:32:16" },
    { id: 11010, fk_lote: 110, fk_tanque: 11, temperatura: 21.1, dt_medicao: "2026-09-28T14:32:18" },
    { id: 11011, fk_lote: 110, fk_tanque: 11, temperatura: 21.2, dt_medicao: "2026-09-28T14:32:20" },

    // TQ-12 — Lote 107 (id: 111 · Unidade Sorocaba sem desvio · Red Ale: 15.0 a 24.0 °C · estavel)
    { id: 12001, fk_lote: 111, fk_tanque: 12, temperatura: 18.8, dt_medicao: "2026-09-28T14:32:00" },
    { id: 12002, fk_lote: 111, fk_tanque: 12, temperatura: 19.0, dt_medicao: "2026-09-28T14:32:02" },
    { id: 12003, fk_lote: 111, fk_tanque: 12, temperatura: 19.4, dt_medicao: "2026-09-28T14:32:04" },
    { id: 12004, fk_lote: 111, fk_tanque: 12, temperatura: 19.8, dt_medicao: "2026-09-28T14:32:06" },
    { id: 12005, fk_lote: 111, fk_tanque: 12, temperatura: 20.1, dt_medicao: "2026-09-28T14:32:08" },
    { id: 12006, fk_lote: 111, fk_tanque: 12, temperatura: 19.9, dt_medicao: "2026-09-28T14:32:10" },
    { id: 12007, fk_lote: 111, fk_tanque: 12, temperatura: 19.7, dt_medicao: "2026-09-28T14:32:12" },
    { id: 12008, fk_lote: 111, fk_tanque: 12, temperatura: 19.5, dt_medicao: "2026-09-28T14:32:14" },
    { id: 12009, fk_lote: 111, fk_tanque: 12, temperatura: 19.3, dt_medicao: "2026-09-28T14:32:16" },
    { id: 12010, fk_lote: 111, fk_tanque: 12, temperatura: 19.2, dt_medicao: "2026-09-28T14:32:18" },
    { id: 12011, fk_lote: 111, fk_tanque: 12, temperatura: 19.1, dt_medicao: "2026-09-28T14:32:20" }
];


// ======================================================
// 13. ALERTAS
// O status e derivado de dt_resolucao.
// O tipo e identificado por fk_tipo_alerta.
// Cada alerta aponta para a leitura de pico do episodio.
// ======================================================

const alertasData = [

    // Lote 101-A (id: 100):
    // Episodio 1: abriu em 14:32:04 (25.3 °C - pico), seguiu fora em 14:32:06 (24.3 °C), resolveu em 14:32:08 (23.0 °C)
    {
        id: 1,
        fk_leitura: 1003,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-28T14:32:04",
        dt_resolucao: "2026-09-28T14:32:08"
    },
    // Episodio 2: abriu em 14:32:16 (24.6 °C), atingiu pico em 14:32:18 (25.2 °C), segue aberto em 14:32:20 (24.9 °C)
    {
        id: 2,
        fk_leitura: 1010,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-28T14:32:16",
        dt_resolucao: null
    },

    // Lote 096 (id: 101):
    // Abriu em 14:32:16 (25.0 °C - pico) e resolveu em 14:32:18 (22.8 °C)
    {
        id: 3,
        fk_leitura: 2009,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-28T14:32:16",
        dt_resolucao: "2026-09-28T14:32:18"
    },

    // Lote 095 (id: 102):
    // Episodio 1: abriu em 14:32:04 (7.0 °C - pico), resolveu em 14:32:08 (8.5 °C)
    {
        id: 4,
        fk_leitura: 3003,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (8.0 graus C)",
        dt_alerta: "2026-09-28T14:32:04",
        dt_resolucao: "2026-09-28T14:32:08"
    },
    // Episodio 2: abriu em 14:32:16 (7.5 °C), pico em 14:32:18 (6.8 °C), segue aberto
    {
        id: 5,
        fk_leitura: 3010,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (8.0 graus C)",
        dt_alerta: "2026-09-28T14:32:16",
        dt_resolucao: null
    },

    // Lote 102 (id: 104):
    // Abriu em 14:32:14 (14.3 °C), pico em 14:32:18 (15.4 °C), segue aberto
    {
        id: 6,
        fk_leitura: 5010,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (14.0 graus C)",
        dt_alerta: "2026-09-28T14:32:14",
        dt_resolucao: null
    },

    // Lote 103 (id: 105):
    // Abriu em 14:32:14 (24.3 °C), pico em 14:32:16 (24.8 °C), segue aberto
    {
        id: 7,
        fk_leitura: 6009,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (24.0 graus C)",
        dt_alerta: "2026-09-28T14:32:14",
        dt_resolucao: null
    },

    // Lote 104 (id: 106):
    // Abriu em 14:32:14 (14.6 °C), pico em 14:32:16 (13.5 °C), segue aberto
    {
        id: 8,
        fk_leitura: 7009,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (15.0 graus C)",
        dt_alerta: "2026-09-28T14:32:14",
        dt_resolucao: null
    },

    // Lote 105 (id: 107):
    // Episodio 1: abriu em 14:32:02 (14.4 °C), pico em 14:32:04 (15.2 °C), resolveu em 14:32:06 (13.4 °C)
    {
        id: 9,
        fk_leitura: 8003,
        fk_tipo_alerta: 2,
        descricao: "Temperatura acima do limite maximo (14.0 graus C)",
        dt_alerta: "2026-09-28T14:32:02",
        dt_resolucao: "2026-09-28T14:32:06"
    },
    // Episodio 2: abriu em 14:32:14 (7.8 °C), pico em 14:32:16 (7.5 °C), segue aberto
    {
        id: 10,
        fk_leitura: 8009,
        fk_tipo_alerta: 1,
        descricao: "Temperatura abaixo do limite minimo (8.0 graus C)",
        dt_alerta: "2026-09-28T14:32:14",
        dt_resolucao: null
    }
];


// ======================================================
// 14. CHAMADOS DE SUPORTE
// ======================================================

const chamadosData = [
    {
        id: 1,
        fk_usuario: 1,
        fk_status_chamado: 1,
        assunto: "Duvida sobre monitoramento",
        descricao: "Gostaria de entender melhor o funcionamento dos alertas.",
        dt_abertura: "2026-09-27T10:00:00",
        dt_atualizacao: "2026-09-27T10:00:00"
    }
];


// ======================================================
// EXPORTACAO
// ======================================================

export {
    DATA_REFERENCIA,

    planosData,
    cargosData,
    tiposCervejaData,
    levedurasData,
    statusTanqueData,
    statusLoteData,
    statusUnidadeData,
    statusSensorData,
    statusContatoData,
    tiposAlertaData,
    statusChamadoData,

    empresaData,
    codigosAtivacaoData,
    usuariosData,
    contatosData,
    unidadesData,
    cervejasData,
    tanquesData,
    sensoresData,
    lotesData,
    producoesData,
    leiturasSensoresData,
    alertasData,
    chamadosData
};
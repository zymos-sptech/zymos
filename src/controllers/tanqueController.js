var tanqueModel = require("../models/tanqueModel");

const STATUS_MINIMO = 1;
const STATUS_MAXIMO = 5;
const STATUS_EM_USO = 2;
const STATUS_UNIDADE_INATIVA = 4;
const SEM_TANQUE = 0;

function naoEInteiro(valor) {
    return valor === "" || valor * 1 != valor || valor % 1 != 0;
}

function nomeInvalido(nome) {
    var texto = nome + "";

    return texto.length < 1 || texto.length > 30 || texto.split("'").length > 1 || texto.split("\\").length > 1;
}

function erroNosDados(nome, capacidade) {
    if (nome == undefined || nomeInvalido(nome)) {
        return "O nome deve ter de 1 a 30 caracteres e não pode conter ' ou \\ !";
    }

    if (capacidade == undefined || naoEInteiro(capacidade) || capacidade <= 0) {
        return "A capacidade deve ser um número inteiro maior que zero!";
    }

    return null;
}

function tratarErro(res, acao) {
    return function (erro) {
        console.log(erro);
        console.log("Houve um erro ao " + acao + ": ", erro.sqlMessage);
        return res.status(500).json(erro.sqlMessage);
    };
}

function cadastrar(req, res) {
    var idUnidade = req.body.idUnidade;
    var nome = req.body.nome;
    var capacidade = req.body.capacidade;
    var erroDados = erroNosDados(nome, capacidade);

    if (idUnidade == undefined || naoEInteiro(idUnidade)) {
        return res.status(400).send("O id da unidade é inválido!");
    }

    if (erroDados) {
        return res.status(400).send(erroDados);
    }

    tanqueModel.buscarUnidade(idUnidade).then(function (unidade) {
        if (unidade.length == 0) {
            return res.status(404).send("Unidade não encontrada!");
        }

        if (unidade[0].fk_status_unidade == STATUS_UNIDADE_INATIVA) {
            return res.status(409).send("Unidade inativa! Tanque não cadastrado.");
        }

        if (unidade[0].tanques_unidade >= unidade[0].quantidade_tanques) {
            return res.status(409).send("A unidade já atingiu a quantidade de tanques contratada!");
        }

        if (unidade[0].tanques_max != undefined && unidade[0].tanques_empresa >= unidade[0].tanques_max) {
            return res.status(409).send("A empresa já atingiu o limite de tanques do plano!");
        }

        return tanqueModel.buscarPorNome(idUnidade, nome, SEM_TANQUE).then(function (existe) {
            if (existe.length > 0) {
                return res.status(409).send("Já existe um tanque com esse nome na unidade!");
            }

            return tanqueModel.cadastrar(idUnidade, nome, capacidade).then(function (resultado) {
                return res.status(201).json({ idTanque: resultado.insertId });
            });
        });
    }).catch(tratarErro(res, "cadastrar o tanque"));
}

function listarPorUnidade(req, res) {
    var idUnidade = req.params.idUnidade;

    if (naoEInteiro(idUnidade)) {
        return res.status(400).send("O id da unidade é inválido!");
    }

    tanqueModel.buscarUnidade(idUnidade).then(function (unidade) {
        if (unidade.length == 0) {
            return res.status(404).send("Unidade não encontrada!");
        }

        return tanqueModel.listarPorUnidade(idUnidade).then(function (resultado) {
            if (resultado.length == 0) {
                return res.status(204).send();
            }

            return res.status(200).json(resultado);
        });
    }).catch(tratarErro(res, "buscar os tanques"));
}

function listarPorTanque(req, res) {
    var idUnidade = req.params.idUnidade;
    var idTanque = req.params.idTanque;

    if (naoEInteiro(idUnidade) || naoEInteiro(idTanque)) {
        return res.status(400).send("O id da unidade ou do tanque é inválido!");
    }

    tanqueModel.listarPorTanque(idUnidade, idTanque).then(function (resultado) {
        if (resultado.length == 0) {
            return res.status(404).send("Tanque não encontrado nessa unidade!");
        }

        return res.status(200).json(resultado[0]);
    }).catch(tratarErro(res, "buscar o tanque"));
}




function editar(req, res) {
    var idTanque = req.params.idTanque;
    var nome = req.body.nome;
    var capacidade = req.body.capacidade;
    var idStatusTanque = req.body.idStatusTanque;
    var erroDados = erroNosDados(nome, capacidade);

    if (naoEInteiro(idTanque)) {
        return res.status(400).send("O id do tanque é inválido!");
    }

    if (erroDados) {
        return res.status(400).send(erroDados);
    }

    if (idStatusTanque == undefined || naoEInteiro(idStatusTanque) || idStatusTanque < STATUS_MINIMO || idStatusTanque > STATUS_MAXIMO) {
        return res.status(400).send("O status do tanque deve ser um número de " + STATUS_MINIMO + " a " + STATUS_MAXIMO + "!");
    }

    tanqueModel.buscarPorId(idTanque).then(function (tanque) {
        if (tanque.length == 0) {
            return res.status(404).send("Tanque não encontrado!");
        }

        if (tanque[0].lotes_ativos > 0 && idStatusTanque != STATUS_EM_USO) {
            return res.status(409).send("O tanque tem um lote em andamento e precisa continuar 'Em uso'!");
        }

        return tanqueModel.buscarPorNome(tanque[0].fk_unidade, nome, idTanque).then(function (existe) {
            if (existe.length > 0) {
                return res.status(409).send("Já existe um tanque com esse nome na unidade!");
            }

            return tanqueModel.editar(idTanque, nome, capacidade, idStatusTanque).then(function () {
                return res.status(200).send("Tanque atualizado com sucesso!");
            });
        });
    }).catch(tratarErro(res, "editar o tanque"));
}

function deletar(req, res) {
    var idTanque = req.params.idTanque;

    if (naoEInteiro(idTanque)) {
        return res.status(400).send("O id do tanque é inválido!");
    }

    tanqueModel.buscarPorId(idTanque).then(function (tanque) {
        if (tanque.length == 0) {
            return res.status(404).send("Tanque não encontrado!");
        }

        if (tanque[0].producoes > 0) {
            return res.status(409).send("O tanque possui histórico de produção e não pode ser deletado!");
        }

        if (tanque[0].sensores > 0) {
            return res.status(409).send("O tanque possui sensor vinculado e não pode ser deletado!");
        }

        return tanqueModel.deletar(idTanque).then(function () {
            return res.status(200).send("Tanque deletado com sucesso!");
        });
    }).catch(tratarErro(res, "deletar o tanque"));
}

module.exports = {
    cadastrar,
    listarPorUnidade,
    listarPorTanque,
    editar,
    deletar
}

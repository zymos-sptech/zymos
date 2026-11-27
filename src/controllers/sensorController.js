var sensorModel = require("../models/sensorModel");

//  1 = Ativo, 2 = Inativo, 3 = Manutencao
const STATUS_SENSOR_MINIMO = 1;
const STATUS_SENSOR_MAXIMO = 3;
const STATUS_SENSOR_ATIVO = 1;
const STATUS_UNIDADE_INATIVA = 4;

function naoEInteiro(valor) {
    return valor === "" || valor * 1 != valor || valor % 1 != 0;
}

function tratarErro(res, acao) {
    return function (erro) {
        console.log(erro);
        console.log("Houve um erro ao " + acao + ": ", erro.sqlMessage);
        return res.status(500).json(erro.sqlMessage);
    };
}

function cadastrar(req, res) {
    var idUnidade = req.body.idUnidade || req.body.fkUnidade;
    var modelo = req.body.modelo || "LM35";

    if (idUnidade == undefined || naoEInteiro(idUnidade)) {
        return res.status(400).send("O id da unidade é inválido!");
    }

    sensorModel.buscarUnidade(idUnidade).then(function (unidade) {
        if (unidade.length == 0) {
            return res.status(404).send("Unidade não encontrada!");
        }

        if (unidade[0].fk_status_unidade == STATUS_UNIDADE_INATIVA) {
            return res.status(409).send("Unidade inativa! Sensor não cadastrado.");
        }

        return sensorModel.cadastrar(idUnidade, modelo).then(function (resultado) {
            return res.status(201).json({ idSensor: resultado.insertId });
        });
    }).catch(tratarErro(res, "cadastrar o sensor"));
}

function listarPorUnidade(req, res) {
    var idUnidade = req.params.idUnidade;

    if (naoEInteiro(idUnidade)) {
        return res.status(400).send("O id da unidade é inválido!");
    }

    sensorModel.listarPorUnidade(idUnidade).then(function (resultado) {
        if (resultado.length == 0) {
            return res.status(204).send();
        }

        return res.status(200).json(resultado);
    }).catch(tratarErro(res, "buscar os sensores"));
}

function listarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (naoEInteiro(idEmpresa)) {
        return res.status(400).send("O id da empresa é inválido!");
    }

    sensorModel.listarPorEmpresa(idEmpresa).then(function (resultado) {
        if (resultado.length == 0) {
            return res.status(204).send();
        }

        return res.status(200).json(resultado);
    }).catch(tratarErro(res, "buscar os sensores da empresa"));
}

function alterarStatus(req, res) {
    var idSensor = req.params.idSensor;
    var statusSensor = req.body.fkStatusSensor;

    if (naoEInteiro(idSensor)) {
        return res.status(400).send("O id do sensor é inválido!");
    }

    if (statusSensor == undefined || naoEInteiro(statusSensor)) {
        return res.status(400).send("O status do sensor é inválido!");
    }

    sensorModel.buscarStatusSensor(statusSensor).then(function (statusExiste) {
        if (statusExiste.length == 0) {
            return res.status(404).send("Status do sensor não encontrado!");
        }

        return sensorModel.buscarPorId(idSensor).then(function (sensor) {
            if (sensor.length == 0) {
                return res.status(404).send("Sensor não encontrado!");
            }

            if (statusSensor != STATUS_SENSOR_ATIVO && sensor[0].producoes_ativas > 0) {
                return res.status(409).send(
                    "O sensor está vinculado a uma produção em andamento e precisa continuar Ativo!"
                );
            }

            return sensorModel.alterarStatus(idSensor, statusSensor).then(function () {
                return res.status(200).send("Status do sensor atualizado com sucesso!");
            });
        });
    }).catch(tratarErro(res, "alterar o status do sensor"));
}

function deletar(req, res) {
    var idSensor = req.params.idSensor;

    if (naoEInteiro(idSensor)) {
        return res.status(400).send("O id do sensor é inválido!");
    }

    sensorModel.buscarPorId(idSensor).then(function (sensor) {
        if (sensor.length == 0) {
            return res.status(404).send("Sensor não encontrado!");
        }

        if (sensor[0].leituras > 0) {
            return res.status(409).send("O sensor possui leituras registradas e não pode ser deletado! Inative-o.");
        }

        if (sensor[0].producoes_historico > 0) {
            return res.status(409).send("O sensor possui histórico de produção e não pode ser deletado!");
        }

        return sensorModel.deletar(idSensor).then(function () {
            return res.status(200).send("Sensor deletado com sucesso!");
        });
    }).catch(tratarErro(res, "deletar o sensor"));
}

module.exports = {
    cadastrar,
    listarPorUnidade,
    listarPorEmpresa,
    alterarStatus,
    deletar
}

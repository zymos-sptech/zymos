var sensorModel = require("../models/sensorModel");

const STATUS_SENSOR_INATIVO = 0;
const STATUS_SENSOR_ATIVO = 1;

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
    var idTanque = req.body.idTanque;

    if (idTanque == undefined || naoEInteiro(idTanque)) {
        return res.status(400).send("O id do tanque é inválido!");
    }

    sensorModel.buscarTanque(idTanque).then(function (tanque) {
        if (tanque.length == 0) {
            return res.status(404).send("Tanque não encontrado!");
        }

        if (tanque[0].sensores_ativos > 0) {
            return res.status(409).send("O tanque já possui um sensor ativo!");
        }

        return sensorModel.cadastrar(tanque[0].fk_unidade, idTanque).then(function (resultado) {
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

function alterarStatus(req, res) {
    var idSensor = req.params.idSensor;
    var statusSensor = req.body.statusSensor;

    if (naoEInteiro(idSensor)) {
        return res.status(400).send("O id do sensor é inválido!");
    }

    if (statusSensor == undefined || naoEInteiro(statusSensor) || statusSensor < STATUS_SENSOR_INATIVO || statusSensor > STATUS_SENSOR_ATIVO) {
        return res.status(400).send("O status do sensor deve ser " + STATUS_SENSOR_INATIVO + " (inativo) ou " + STATUS_SENSOR_ATIVO + " (ativo)!");
    }

    sensorModel.buscarPorId(idSensor).then(function (sensor) {
        if (sensor.length == 0) {
            return res.status(404).send("Sensor não encontrado!");
        }

        if (statusSensor == STATUS_SENSOR_ATIVO && sensor[0].outros_ativos > 0) {
            return res.status(409).send("O tanque já possui outro sensor ativo!");
        }

        return sensorModel.alterarStatus(idSensor, statusSensor).then(function () {
            return res.status(200).send("Status do sensor atualizado com sucesso!");
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

        if (sensor[0].tanques_vinculados > 0) {
            return res.status(409).send("O sensor está vinculado a um tanque e não pode ser deletado!");
        }

        return sensorModel.deletar(idSensor).then(function () {
            return res.status(200).send("Sensor deletado com sucesso!");
        });
    }).catch(tratarErro(res, "deletar o sensor"));
}

module.exports = {
    cadastrar,
    listarPorUnidade,
    alterarStatus,
    deletar
}

var leituraSensorModel = require("../models/leituraSensorModel");

const limite_linhas = 100;


function naoENumero(valor) {
  return valor === "" || valor * 1 != valor;
}

function cadastrar(req, res) {
  var idSensor = req.body.idSensor;
  var temperatura = req.body.temperatura;

  if (idSensor == undefined) {
    res.status(400).send("O id do sensor está undefined!");
  } else if (temperatura == undefined) {
    res.status(400).send("A temperatura está undefined!");
  } else if (naoENumero(idSensor)) {
    res.status(400).send("O id do sensor é inválido!");
  } else if (naoENumero(temperatura) || temperatura < -55 || temperatura > 150) {
    res.status(400).send("A temperatura deve ser um número entre -55 e 150!");
  } else {
    leituraSensorModel.buscarSensor(idSensor)
      .then(
        function (sensor) {
          if (sensor.length == 0) {
            res.status(404).send("Sensor não encontrado!");
          } else if (sensor[0].status_sensor != 1) {
            res.status(403).send("Sensor inativo! Leitura não registrada.");
          } else {
            return registrarLeitura(res, idSensor, temperatura);
          }
        }
      ).catch(
        function (erro) {
          console.log(erro);
          console.log("Houve um erro ao registrar a leitura: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        }
      );
  }
}


function registrarLeitura(res, idSensor, temperatura) {
  return leituraSensorModel.cadastrar(idSensor, temperatura)
    .then(
      function (resultado) {
        var idLeitura = resultado.insertId;

        return leituraSensorModel.buscarLoteAtivo(idSensor, temperatura)
          .then(
            function (lotes) {
              if (lotes.length == 0 || lotes[0].tipo_alerta == 0) {
                res.status(201).json({ idLeitura: idLeitura, alerta: null });
              } else {
                var lote = lotes[0];
                var descricao = "Temperatura abaixo do limite mínimo (" + lote.temperatura_min + "°C)";

                if (lote.tipo_alerta == 1) {
                  descricao = "Temperatura acima do limite máximo (" + lote.temperatura_max + "°C)";
                }

                return leituraSensorModel.cadastrarAlerta(idLeitura, lote.tipo_alerta, descricao)
                  .then(
                    function () {
                      res.status(201).json({
                        idLeitura: idLeitura,
                        alerta: {
                          tipoAlerta: lote.tipo_alerta,
                          descricao: descricao,
                          lote: lote.lote,
                          tanque: lote.tanque
                        }
                      });
                    }
                  );
              }
            }
          ).catch(
            function (erro) {
              console.log(erro);
              console.log("Houve um erro ao gerar o alerta: ", erro.sqlMessage);
              res.status(201).json({
                idLeitura: idLeitura,
                alerta: null,
                aviso: "Leitura registrada, mas houve erro ao avaliar/gerar o alerta."
              });
            }
          );
      }
    );
}

function listar(req, res) {
  leituraSensorModel.listar(limite_linhas)
    .then(
      function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado);
        } else {
          res.status(204).send("Nenhum resultado encontrado!");
        }
      }
    ).catch(
      function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as leituras: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function buscarPorId(req, res) {
  var idLeitura = req.params.idLeitura;

  if (naoENumero(idLeitura)) {
    res.status(400).send("O id da leitura é inválido!");
  } else {
    leituraSensorModel.buscarPorId(idLeitura)
      .then(
        function (resultado) {
          if (resultado.length > 0) {
            res.status(200).json(resultado[0]);
          } else {
            res.status(404).send("Leitura não encontrada!");
          }
        }
      ).catch(
        function (erro) {
          console.log(erro);
          console.log("Houve um erro ao buscar a leitura: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        }
      );
  }
}

function buscarUltimaPorSensor(req, res) {
  var idSensor = req.params.idSensor;

  if (naoENumero(idSensor)) {
    res.status(400).send("O id do sensor é inválido!");
  } else {
    leituraSensorModel.buscarSensor(idSensor)
      .then(
        function (sensor) {
          if (sensor.length == 0) {
            res.status(404).send("Sensor não encontrado!");
          } else {
            return leituraSensorModel.buscarUltimaPorSensor(idSensor)
              .then(
                function (resultado) {
                  if (resultado.length > 0) {
                    res.status(200).json(resultado[0]);
                  } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                  }
                }
              );
          }
        }
      ).catch(
        function (erro) {
          console.log(erro);
          console.log("Houve um erro ao buscar a última leitura: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        }
      );
  }
}


function listarLeituras(res, id, nome, buscarExistente, buscarLeituras) {
  if (naoENumero(id)) {
    res.status(400).send("O id do " + nome + " é inválido!");
  } else {
    buscarExistente(id)
      .then(
        function (existe) {
          if (existe.length == 0) {
            res.status(404).send("O " + nome + " não foi encontrado!");
          } else {
            return buscarLeituras(id, limite_linhas)
              .then(
                function (resultado) {
                  if (resultado.length > 0) {
                    res.status(200).json(resultado);
                  } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                  }
                }
              );
          }
        }
      ).catch(
        function (erro) {
          console.log(erro);
          console.log("Houve um erro ao buscar as leituras do " + nome + ": ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        }
      );
  }
}

function listarPorSensor(req, res) {
  listarLeituras(res, req.params.idSensor, "sensor", leituraSensorModel.buscarSensor, leituraSensorModel.listarPorSensor);
}

function listarPorTanque(req, res) {
  listarLeituras(res, req.params.idTanque, "tanque", leituraSensorModel.buscarTanque, leituraSensorModel.listarPorTanque);
}

function listarPorLote(req, res) {
  listarLeituras(res, req.params.idLote, "lote", leituraSensorModel.buscarLote, leituraSensorModel.listarPorLote);
}

module.exports = {
  cadastrar,
  listar,
  buscarPorId,
  buscarUltimaPorSensor,
  listarPorSensor,
  listarPorTanque,
  listarPorLote
}

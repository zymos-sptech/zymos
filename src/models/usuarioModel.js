var database = require("../database/config");

async function criarUsuario(nome, email, senha, cargoId, empresaId) {
  var sql = `
    INSERT INTO usuario (nome, email, senha, fk_cargo, fk_empresa, status) VALUES
    ("${nome}", "${email}", SHA2("${senha}", 256), ${cargoId}, ${empresaId}, 1)
    `;

  return database.executar(sql);
}

async function buscarUsuario(usuarioId, email, nome) {
  let valores = [];

  if (usuarioId !== null) {
    valores.push(`u.id = ${usuarioId}`);
  }

  if (email !== null) {
    valores.push(`u.email = "${email}"`);
  }

  if (nome !== null) {
    valores.push(`u.nome = "${nome}"`);
  }

  var sql = `
      SELECT 
        u.id, u.nome, u.email, c.nome cargo, p.nome plano, u.nome empresa,
        COUNT(un.id) qtd_unidade
      FROM usuario u
        LEFT JOIN cargo c
      ON c.id = u.fk_cargo
        LEFT JOIN empresa e
      ON e.id = u.fk_empresa
        LEFT JOIN plano p
      ON p.id = e.fk_plano
        LEFT JOIN unidade un
      ON e.id = un.fk_empresa   
      WHERE ${valores}
      GROUP BY u.id, u.nome, u.email, c.nome, e.nome;`;

  return database.executar(sql);
}

async function autenticar(email, senha) {
  console.log(email, senha, "ema senh");
  var sqlAutenticar = `
      SELECT id FROM usuario WHERE email = "${email}" AND senha = SHA2("${senha}", 256);
      `;

  const validarUsuario = await database.executar(sqlAutenticar);
  console.log()
  if (validarUsuario.length > 0) {
    const dados = await buscarUsuario(validarUsuario[0].id, null, null);
    console.log(dados, "dados do usuario.");
    return dados[0];
  }

  return false;
}

async function atualizarUsuario(usuarioId, nome, email, cargoId, empresaId) {
  var sqlAtualizar = `
    UPDATE usuario SET 
    nome = "${nome}", email = "${email}", fk_cargo = ${cargoId}, fk_empresa = ${empresaId}
    WHERE id = ${usuarioId};
  `;

  const atualizarUsuario = await database.executar(sqlAtualizar);

  if (atualizarUsuario.affectedRows > 0) {
    return buscarUsuario(usuarioId, null, null);
  }
}

module.exports = {
  criarUsuario,
  autenticar,
  buscarUsuario,
  atualizarUsuario,
};

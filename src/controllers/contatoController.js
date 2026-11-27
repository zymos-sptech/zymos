async function criarContato(req, res) {
  const data = req.body;
  const nomeLead = data.nomeLead;
  const emailLead = data.emailLead;
  const empresa = data.empresa;
  const qtdTanques = data.qtdTanques;
  const mensagem = data.mensagem;

  if (nomeLead == undefined || emailLead == undefined || empresa == undefined) {
    return res.status(400).send("Campos obrigatórios undefined.");
  }

  if (nomeLead.trim().length < 3) {
    return res.status(400).send("O nome precisa ter pelo menos 3 caracteres.");
  }

  if (nomeLead.trim().length > 100) {
    return res.status(400).send("O nome pode ter no máximo 100 caracteres.");
  }

  if (!emailLead.includes("@") || !emailLead.includes(".")) {
    return res.status(400).send("Email inválido.");
  }

  if (empresa.trim().length < 2 || empresa.trim().length > 100) {
    return res
      .status(400)
      .send("O nome da empresa precisa ter entre 2 e 100 caracteres.");
  }

  const projectJira = process.env.JIRA_PROJECT_KEY;
  const dominio = process.env.JIRA_DOMAIN;
  const emailJira = process.env.JIRA_EMAIL;
  const tokenJira = process.env.JIRA_TOKEN_LEAD;

// https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-events-get

  const bodyData = {
    fields: {
      project: {
        key: projectJira,
      },
      issuetype: {
        name: "Tarefa",
      },
      summary: `Novo Lead: ${nomeLead} - ${empresa}`,
      labels: ["lead", "site"],
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `Nome: ${nomeLead}\nE-mail: ${emailLead}\nEmpresa: ${empresa}\nQuantidade de Tanques: ${qtdTanques}\n\nMensagem:\n${mensagem}`,
              },
            ],
          },
        ],
      },
    },
  };

 await fetch(`https://${dominio}/rest/api/3/issue`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${emailJira}:${tokenJira}`).toString(
        "base64",
      )}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      res.status(201).send("Entrou em contato com sucesso!");
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
}

module.exports = {
  criarContato,
};

# AGENTS.md

## Visão geral

Esse aqui é o meu projeto de faculdade (SPTech), baseado no web-data-viz. O objetivo da aplicação é ser um site com tela de início, login, cadastro, simulador financeiro e uma dashboard com gráficos para mostrar dados.

## Tecnologias

- **Front-end:** HTML, CSS e JavaScript puro (Vanilla JS)
- **Gráficos:** Chart.js
- **Back-end:** Node.js com Express
- **Banco de Dados:** MySQL (e SQL Server caso precise)
- **Outras libs:** dotenv para variáveis de ambiente

## Comandos

Para rodar o projeto na máquina:

- `npm i` ou `npm install` (só na primeira vez pra baixar as pastas)
- `npm start` (para iniciar o servidor do projeto)

*Obs: o servidor roda na porta 3333 por padrão, então abre no navegador em `http://localhost:3333`.*

## Arquitetura

O projeto é dividido em front-end na pasta `public` e back-end na pasta `src`. A ideia é seguir o padrão que os professores ensinaram na aula:

- `public/`: aqui ficam as telas em HTML, as folhas de estilo dentro de `css/` e os scripts do front na pasta `js/`. Quando o usuário clica num botão, o JS da página faz uma requisição com `fetch()`.
- `app.js`: é o arquivo principal que inicia o servidor Express e importa as rotas.
- `src/routes/`: onde ficam as rotas da API (ex: `usuarios.js`). Elas recebem a URL e chamam o controller certo.
- `src/controllers/`: recebe a requisição (`req`), pega os dados do `body` ou `params`, faz validações simples (ex: se o campo tá vazio) e chama a model. Depois devolve a resposta (`res.json`).
- `src/models/`: onde ficam os comandos SQL (`SELECT`, `INSERT`, etc). É a camada que fala com o banco de dados.
- `src/database/`: tem a conexão do banco (`config.js`) e os scripts de criação de tabelas (`script-tabelas.sql`).

**Fluxo de uma funcionalidade:**
HTML (tela) -> `fetch()` no JS -> Rota (`src/routes`) -> Controller (`src/controllers`) -> Model (`src/models`) -> Banco de dados -> Devolve resposta pro front.

## Padrões de desenvolvimento

- Tentar usar nomes fáceis de entender para funções e variáveis em português, em `camelCase` (ex: `cadastrarUsuario`).
- Na model, montar as queries SQL com template string ou concatenação com cuidado pra não esquecer as aspas simples nos textos.
- Usar `console.log` para ajudar a testar quando algo der erro no terminal.
- Comentar no código o que as funções principais estão fazendo para não se perder na hora da apresentação.

## Cuidados e restrições

- **Não usar frameworks complexos:** Não colocar React, Angular, Vue, Tailwind ou Bootstrap. Tem que ser HTML, CSS e JS puro.
- **Não alterar o package.json:** Evitar instalar novas dependências sem necessidade.
- **Configuração do ambiente:** Prestar atenção no `app.js` se a variável `ambiente_processo` está como `'desenvolvimento'` para rodar local.
- **Credenciais do banco:** Configurar o arquivo `.env` com a senha do MySQL local e nunca deixar a senha exposta no código.
- Sempre que criar uma rota nova, lembrar de registrar ela no `app.js` com o `app.use()`, senão dá erro 404.

## Regra geral

Sempre siga a estrutura de pastas existente. Se for criar algo novo (como uma tabela ou tela nova), faça seguindo o mesmo estilo dos arquivos que já existem de exemplo no projeto (como o cadastro/login de usuário).

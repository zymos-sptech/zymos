-- ============================================================
-- BANCO DE DADOS ZYMOS - MVP V4
-- Revisao de relacionamentos e integridade referencial
-- Base: ZYMOS MVP V3
-- ============================================================

DROP DATABASE IF EXISTS zymos;
CREATE DATABASE zymos;
USE zymos;

-- ============================================================
-- 1. TABELAS DE DOMINIO
-- ============================================================

CREATE TABLE plano (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL,
    tanques_min INT NOT NULL,
    tanques_max INT NULL,
    valor_setup_tanque DECIMAL(8,2) NOT NULL,
    valor_mensal_tanque DECIMAL(8,2) NOT NULL
);

CREATE TABLE cargo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    permissionamento TINYINT NOT NULL
);

CREATE TABLE tipo_cerveja (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(20) NOT NULL
);

CREATE TABLE levedura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE status_tanque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE status_lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL
);

CREATE TABLE status_unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE status_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE status_contato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

CREATE TABLE tipo_alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE status_chamado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL
);

-- ============================================================
-- 2. EMPRESA E USUARIO
-- ============================================================

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_plano INT NOT NULL,
    statuss TINYINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cnpj CHAR(14) UNIQUE NOT NULL,
    dt_inicio_contrato DATE NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_empresa_plano
        FOREIGN KEY (fk_plano) REFERENCES plano(id)
);

CREATE TABLE codigo_ativacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    statuss TINYINT NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    dt_geracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_expiracao DATETIME NULL,

    CONSTRAINT fk_codigo_empresa
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id)
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    fk_cargo INT NOT NULL,
    statuss TINYINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id),
    CONSTRAINT fk_usuario_cargo
        FOREIGN KEY (fk_cargo) REFERENCES cargo(id)
);

-- ============================================================
-- 3. CONTATO INSTITUCIONAL E UNIDADES
-- ============================================================

-- Contato e utilizado pelo formulario do site institucional.
-- Nao exige usuario autenticado.
CREATE TABLE contato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_status_contato INT NOT NULL DEFAULT 1,
    qtdtanques INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensagem VARCHAR(500) NULL,
    dt_contato DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_contato_status
        FOREIGN KEY (fk_status_contato) REFERENCES status_contato(id)
);

CREATE TABLE unidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    fk_usuario_criador INT NOT NULL,
    fk_status_unidade INT NOT NULL DEFAULT 1,
    quantidade_tanques INT NOT NULL DEFAULT 1,
    cnpj CHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    uf CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_unidade_empresa
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id),
    CONSTRAINT fk_unidade_usuario_criador
        FOREIGN KEY (fk_usuario_criador) REFERENCES usuario(id),
    CONSTRAINT fk_unidade_status_unidade
        FOREIGN KEY (fk_status_unidade) REFERENCES status_unidade(id)
);

-- ============================================================
-- 4. CERVEJAS
-- Cada cerveja pertence ao usuario que realizou seu cadastro.
-- A empresa pode ser identificada por meio do usuario.
-- ============================================================

CREATE TABLE cerveja (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_tipo_cerveja INT NOT NULL,
    fk_levedura INT NOT NULL,
    fk_usuario_criador INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    temperatura_min DECIMAL(4,1) NOT NULL,
    temperatura_max DECIMAL(4,1) NOT NULL,
    tempo_fermentacao_dias INT NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cerveja_tipo
        FOREIGN KEY (fk_tipo_cerveja) REFERENCES tipo_cerveja(id),
    CONSTRAINT fk_cerveja_levedura
        FOREIGN KEY (fk_levedura) REFERENCES levedura(id),
    CONSTRAINT fk_cerveja_usuario_criador
        FOREIGN KEY (fk_usuario_criador) REFERENCES usuario(id)
);

-- ============================================================
-- 5. SENSORES E TANQUES
-- O sensor pertence a uma unidade, mas nao possui FK permanente
-- para tanque. A associacao operacional ocorre em producao.
-- ============================================================

CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_unidade INT NOT NULL,
    fk_status_sensor INT NOT NULL,
    modelo VARCHAR(20) NOT NULL DEFAULT 'LM35',
    dt_instalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_sensor_unidade
        FOREIGN KEY (fk_unidade) REFERENCES unidade(id),
    CONSTRAINT fk_sensor_status
        FOREIGN KEY (fk_status_sensor) REFERENCES status_sensor(id)
);

CREATE TABLE tanque (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_unidade INT NOT NULL,
    fk_usuario_criador INT NOT NULL,
    fk_status_tanque INT NOT NULL DEFAULT 1,
    nome VARCHAR(30) NOT NULL,
    capacidade INT NOT NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tanque_unidade
        FOREIGN KEY (fk_unidade) REFERENCES unidade(id),
    CONSTRAINT fk_tanque_usuario_criador
        FOREIGN KEY (fk_usuario_criador) REFERENCES usuario(id),
    CONSTRAINT fk_tanque_status
        FOREIGN KEY (fk_status_tanque) REFERENCES status_tanque(id),
    CONSTRAINT uq_tanque_unidade
        UNIQUE (fk_unidade, nome)
);

-- ============================================================
-- 6. LOTES
-- Lote e unico: quando finalizado, nao sera reutilizado.
-- ============================================================

CREATE TABLE lote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    volume_litros INT NOT NULL,
    fk_cerveja INT NOT NULL,
    fk_unidade INT NOT NULL,
    fk_usuario_criador INT NOT NULL,
    fk_status_lote INT NOT NULL DEFAULT 1,
    dt_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_fim DATETIME NULL,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lote_cerveja
        FOREIGN KEY (fk_cerveja) REFERENCES cerveja(id),
    CONSTRAINT fk_lote_unidade
        FOREIGN KEY (fk_unidade) REFERENCES unidade(id),
    CONSTRAINT fk_lote_usuario
        FOREIGN KEY (fk_usuario_criador) REFERENCES usuario(id),
    CONSTRAINT fk_lote_status
        FOREIGN KEY (fk_status_lote) REFERENCES status_lote(id)
) AUTO_INCREMENT = 100;

-- ============================================================
-- 7. PRODUCAO - TABELA ASSOCIATIVA N:M ENTRE LOTE E TANQUE
-- PK composta: o mesmo lote nao sera associado novamente ao
-- mesmo tanque. Um sensor pode ser reutilizado em outras producoes
-- ao longo do tempo; o backend valida conflitos simultaneos.
-- ============================================================

CREATE TABLE producao (
    fk_lote INT NOT NULL,
    fk_tanque INT NOT NULL,
    fk_sensor INT NOT NULL,
    dt_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_saida DATETIME NULL,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (fk_lote, fk_tanque),

    CONSTRAINT fk_producao_lote
        FOREIGN KEY (fk_lote) REFERENCES lote(id),
    CONSTRAINT fk_producao_tanque
        FOREIGN KEY (fk_tanque) REFERENCES tanque(id),
    CONSTRAINT fk_producao_sensor
        FOREIGN KEY (fk_sensor) REFERENCES sensor(id)
);

-- ============================================================
-- 8. LEITURAS DE SENSORES
-- Cada leitura aponta para a producao (lote + tanque) em que
-- foi registrada, por meio de uma FK composta.
-- ============================================================

CREATE TABLE leitura_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_lote INT NOT NULL,
    fk_tanque INT NOT NULL,
    temperatura DECIMAL(4,1) NOT NULL,
    dt_medicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leitura_producao
        FOREIGN KEY (fk_lote, fk_tanque)
        REFERENCES producao(fk_lote, fk_tanque)
);

-- ============================================================
-- 9. ALERTAS
-- ============================================================

CREATE TABLE alerta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_leitura INT NOT NULL,
    fk_tipo_alerta INT NOT NULL,
    descricao VARCHAR(255) NULL,
    dt_alerta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dt_resolucao DATETIME NULL,

    CONSTRAINT fk_alerta_leitura
        FOREIGN KEY (fk_leitura) REFERENCES leitura_sensor(id),
    CONSTRAINT fk_alerta_tipo
        FOREIGN KEY (fk_tipo_alerta) REFERENCES tipo_alerta(id)
);

-- ============================================================
-- 10. SUPORTE DA PLATAFORMA
-- Chamado exige usuario autenticado. Nao ha historico de mensagens.
-- ============================================================

CREATE TABLE chamado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    fk_status_chamado INT NOT NULL DEFAULT 1,
    assunto VARCHAR(120) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    dt_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_chamado_usuario
        FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    CONSTRAINT fk_chamado_status
        FOREIGN KEY (fk_status_chamado) REFERENCES status_chamado(id)
);

-- ============================================================
-- 11. DADOS DE DOMINIO
-- ============================================================

INSERT INTO plano (nome, tanques_min, tanques_max, valor_setup_tanque, valor_mensal_tanque) VALUES
('Basico', 1, 9, 1200.00, 290.00),
('Padrao', 10, 49, 900.00, 240.00),
('Industrial', 50, NULL, 600.00, 190.00);

INSERT INTO cargo (nome, permisionamento) VALUES
('Administrador', 1),
('Mestre Cervejeiro', 2),
('Operador', 3),
('Qualidade', 4);

INSERT INTO tipo_cerveja (tipo) VALUES
('Ale'),
('Lager');

INSERT INTO levedura (nome) VALUES
('Saccharomyces cerevisiae'),
('Saccharomyces pastorianus'),
('Saccharomyces carlsbergensis');

INSERT INTO status_tanque (nome) VALUES
('Disponivel'),
('Em uso'),
('Em limpeza'),
('Manutencao'),
('Indisponivel');

INSERT INTO status_lote (nome) VALUES
('Em andamento'),
('Finalizado'),
('Cancelado');

INSERT INTO status_unidade (nome) VALUES
('Solicitada / Em Analise'),
('Aguardando Setup Hardware'),
('Ativa'),
('Inativa');

INSERT INTO status_sensor (nome) VALUES
('Ativo'),
('Inativo'),
('Manutencao');

INSERT INTO status_contato (nome) VALUES
('Recebido'),
('Em atendimento'),
('Concluido');

INSERT INTO tipo_alerta (nome) VALUES
('Temperatura abaixo do limite'),
('Temperatura acima do limite');

INSERT INTO status_chamado (nome) VALUES
('Aberto'),
('Em atendimento'),
('Resolvido'),
('Fechado');

-- ============================================================
-- 12. DADOS DE EXEMPLO
-- Os registros abaixo sao demonstrativos, herdados e adaptados
-- dos exemplos da V3. Nao representam necessariamente dados
-- reais atuais da dashboard do projeto.
-- ============================================================

INSERT INTO empresa (fk_plano, statuss, nome, cnpj, dt_inicio_contrato) VALUES
(2, 1, 'Cervejaria Horizonte', '12345678000190', '2026-01-10');

INSERT INTO codigo_ativacao (fk_empresa, statuss, codigo, dt_expiracao) VALUES
(1, 1, 'ZYMOS-HORIZ-2026', '2026-12-31 23:59:59'),
(1, 0, 'ZYMOS-TESTE-0001', '2026-01-31 23:59:59');

INSERT INTO usuario (fk_empresa, fk_cargo, statuss, nome, email, senha) VALUES
(1, 1, 1, 'Carlos Silva', 'carlos.silva@cervejariahorizonte.com', 'SUBSTITUIR_POR_HASH_SEGURO');

INSERT INTO unidade (fk_empresa, fk_usuario_criador, fk_status_unidade, quantidade_tanques, cnpj, nome, logradouro, numero, bairro, cidade, uf, cep) VALUES
(1, 1, 3, 4, '12345678000270', 'Matriz Ribeirao Preto', 'Avenida das Cervejarias', '1000', 'Centro', 'Ribeirao Preto', 'SP', '14000000'),
(1, 1, 3, 6, '12345678000350', 'Unidade Campinas', 'Avenida Industrial', '500', 'Distrito Industrial', 'Campinas', 'SP', '13000000');

INSERT INTO cerveja (fk_tipo_cerveja, fk_levedura, fk_usuario_criador, nome, temperatura_min, temperatura_max, tempo_fermentacao_dias) VALUES
(1, 1, 1, 'IPA', 15.0, 24.0, 14),
(1, 1, 1, 'Red Ale', 15.0, 24.0, 14),
(2, 2, 1, 'Pilsen', 8.0, 14.0, 21);

INSERT INTO tanque (fk_unidade, fk_usuario_criador, fk_status_tanque, nome, capacidade) VALUES
(1, 1, 2, 'TQ-01', 10000),
(1, 1, 2, 'TQ-02', 10000),
(1, 1, 1, 'TQ-03', 10000),
(1, 1, 2, 'TQ-04', 10000),
(2, 1, 1, 'TQ-05', 10000),
(2, 1, 1, 'TQ-06', 10000),
(2, 1, 1, 'TQ-07', 10000),
(2, 1, 1, 'TQ-08', 10000),
(2, 1, 1, 'TQ-09', 10000),
(2, 1, 1, 'TQ-10', 10000);

INSERT INTO sensor (fk_unidade, fk_status_sensor, modelo) VALUES
(1, 1, 'LM35'),
(1, 1, 'LM35'),
(1, 1, 'LM35'),
(1, 1, 'LM35'),
(2, 1, 'LM35'),
(2, 1, 'LM35'),
(2, 1, 'LM35'),
(2, 1, 'LM35'),
(2, 1, 'LM35'),
(2, 1, 'LM35');

INSERT INTO lote (codigo, volume_litros, fk_cerveja, fk_unidade, fk_usuario_criador, fk_status_lote, dt_inicio, dt_fim) VALUES
('101-A', 8000, 1, 1, 1, 1, '2026-09-23 08:00:00', NULL),
('096',   7000, 2, 1, 1, 1, '2026-09-23 08:00:00', NULL),
('095',   6000, 3, 1, 1, 1, '2026-09-25 08:00:00', NULL),
('087',   7500, 1, 1, 1, 2, '2026-09-01 08:00:00', '2026-09-15 08:00:00');

INSERT INTO producao (fk_lote, fk_tanque, fk_sensor, dt_entrada, dt_saida) VALUES
(100, 1, 1, '2026-09-23 08:00:00', NULL),
(101, 2, 2, '2026-09-23 08:00:00', NULL),
(102, 3, 3, '2026-09-25 08:00:00', NULL),
(103, 4, 4, '2026-09-01 08:00:00', '2026-09-15 08:00:00');

INSERT INTO leitura_sensor (fk_lote, fk_tanque, temperatura, dt_medicao) VALUES
(100, 1, 25.2, '2026-09-28 14:32:10'),
(100, 1, 23.8, '2026-09-28 15:00:00');

INSERT INTO alerta (fk_leitura, fk_tipo_alerta, descricao, dt_alerta, dt_resolucao) VALUES
(1, 2, 'Temperatura acima do limite maximo (24.0 graus C)', '2026-09-28 14:32:10', NULL);

-- ============================================================
-- 13. CONSULTAS DE EXEMPLO
-- ============================================================

-- 13.1. Consultar empresa, plano e unidades
SELECT
    e.nome AS empresa,
    p.nome AS plano,
    u.nome AS unidade,
    u.cnpj,
    u.quantidade_tanques,
    u.cidade,
    u.uf,
    su.nome AS status_unidade
FROM empresa AS e
JOIN plano AS p ON p.id = e.fk_plano
JOIN unidade AS u ON u.fk_empresa = e.id
JOIN status_unidade AS su ON su.id = u.fk_status_unidade
ORDER BY u.nome;

-- 13.2. Consultar tanques e unidades
SELECT
    u.nome AS unidade,
    t.nome AS tanque,
    t.capacidade,
    st.nome AS status_tanque
FROM tanque AS t
JOIN unidade AS u ON u.id = t.fk_unidade
JOIN status_tanque AS st ON st.id = t.fk_status_tanque
ORDER BY u.nome, t.nome;

-- 13.3. Consultar lotes, cervejas, tanques e status
SELECT
    l.codigo AS lote,
    c.nome AS cerveja,
    t.nome AS tanque,
    l.volume_litros,
    sl.nome AS status_lote,
    p.dt_entrada,
    p.dt_saida,
    l.dt_inicio,
    l.dt_fim
FROM lote AS l
JOIN cerveja AS c ON c.id = l.fk_cerveja
JOIN status_lote AS sl ON sl.id = l.fk_status_lote
JOIN producao AS p ON p.fk_lote = l.id
JOIN tanque AS t ON t.id = p.fk_tanque
ORDER BY l.dt_inicio DESC;

-- 13.4. vw_temp_atual_por_sensor --> Consultar historico de temperatura do sensor
SELECT
    l.codigo AS lote,
    c.nome AS cerveja,
    t.nome AS tanque,
    s.modelo AS sensor,
    ls.temperatura,
    ls.dt_medicao
FROM leitura_sensor AS ls
JOIN producao AS p
    ON p.fk_lote = ls.fk_lote
   AND p.fk_tanque = ls.fk_tanque
JOIN lote AS l ON l.id = p.fk_lote
JOIN cerveja AS c ON c.id = l.fk_cerveja
JOIN tanque AS t ON t.id = p.fk_tanque
JOIN sensor AS s ON s.id = p.fk_sensor
WHERE s.id = 1 			-- placeholder ${}
ORDER BY ls.dt_medicao DESC limit 1; -- placeholder

-- 13.5. Consultar alertas do tanque TQ-01
SELECT
    t.nome AS tanque,
    l.codigo AS lote,
    ls.temperatura,
    ta.nome AS tipo_alerta,
    a.descricao,
    a.dt_alerta,
    a.dt_resolucao,
    CASE
        WHEN a.dt_resolucao IS NULL THEN 'Aberto'
        ELSE 'Resolvido'
    END AS status_alerta
FROM alerta AS a
JOIN tipo_alerta AS ta ON ta.id = a.fk_tipo_alerta
JOIN leitura_sensor AS ls ON ls.id = a.fk_leitura
JOIN producao AS p
    ON p.fk_lote = ls.fk_lote
   AND p.fk_tanque = ls.fk_tanque
JOIN tanque AS t ON t.id = p.fk_tanque
JOIN lote AS l ON l.id = p.fk_lote
WHERE t.id = 1 				-- placeholder
ORDER BY a.dt_alerta DESC;

-- 13.6. Consultar chamados e seus status
SELECT
    ch.id AS chamado,
    u.nome AS usuario,
    ch.assunto,
    ch.descricao,
    sc.nome AS status_chamado,
    ch.dt_abertura,
    ch.dt_atualizacao
FROM chamado AS ch
JOIN usuario AS u ON u.id = ch.fk_usuario
JOIN status_chamado AS sc ON sc.id = ch.fk_status_chamado
ORDER BY ch.dt_abertura DESC;

-- ============================================================
-- FIM DO SCRIPT ZYMOS MVP V4
-- ============================================================
-- INTEGRAÇÃO SENSOR - BACK - FRONT

select * from sensor;
select * from producao;
select * from leitura_sensor;
select * from lote;
select * from tanque;

-- vw_faixa_por_sensor exibir faixa por sensor (dat-aqu-ino)
SELECT
	l.id AS idLote,
	-- l.codigo AS lote,
	t.id AS idTanque,
    -- t.nome AS tanque,
	c.temperatura_min,
	c.temperatura_max
FROM sensor s
	INNER JOIN producao p
		ON p.fk_sensor = s.id
	INNER JOIN lote l
		ON l.id = p.fk_lote
	INNER JOIN tanque t
		ON t.id = p.fk_tanque
	INNER JOIN cerveja c
		ON c.id = l.fk_cerveja
WHERE s.id = 1		-- placeholder
	AND l.fk_status_lote = 1
	AND p.dt_entrada <= NOW()
	AND (p.dt_saida IS NULL OR p.dt_saida >= NOW())
ORDER BY p.dt_entrada DESC LIMIT 1;

-- DAT-AQU-INO:
-- 	insert leitura_sensor

-- WEB-DATA-VIZ
-- placeholder ${sensorId}
-- select view vw_faixa_por_sensor				GET
-- select vw_temp_atual_por_sensor				GET
-- 	se alerta	insert alerta (se necessario)	POST
-- 	se voltar pra ideal	update alerta 			PATCH (inserir dt_resolucao --> NOW() )



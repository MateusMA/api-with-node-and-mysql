CREATE DATABASE db_funcionarios;

USE db_funcionarios;

CREATE TABLE tbl_usuarios (
    id int primary key auto_increment,
    nome varchar(255) UNIQUE NOT NULL,
    cargo varchar(255) NOT NULL,
    nivel_acesso boolean default 0 NOT NULL,
    senha varchar(255) NOT NULL
);

CREATE TABLE tbl_tarefas (
    id int primary key auto_increment,
    categoria varchar(40),
    descricao varchar(40),
    data_ini DATE NOT NULL,
    data_prazo DATE NOT NULL,
    data_fim DATE,
	nome varchar(255) NOT NULL,
    nome2 varchar(255),
    nome3 varchar(255),
    nome4 varchar(255),
    status varchar(100),
    cliente varchar(255),
    local varchar(50),
    visibility varchar(10),
    boss_check boolean default 0
);

CREATE TABLE tbl_relatorios(
    nome varchar(255) NOT NULL,
    concluido int default 0,
    pendente int default 0,
    porcentual varchar(4)
);


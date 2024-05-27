# Software description, 2024:
    O objetivo deste software é realizar uma consulta na tabela de usuarios de um banco de dados MySQL.
    Serve apenas para exemplificar a função de uma api em um projeto acadêmico.

# Funcionalities:
    - Criar uma conexão com o banco de dados MySQL,
    - Consultar a tabela de usuarios,
    - Enviar como resposta a requisição uma lista em javascript(JSON).

# Tecnologies:
    - Javascript,
    - Node,
    - MySQL.

# Usage:
    Você deve ter o node e o MySQL instalados no seu computador, dentro do prompt de comando do MySQL insira o seguinte código em SQL:

        CREATE DATABASE databse_name;

        USE databse_name;

        CREATE TABLE table_name (
            id int primary key auto_increment,
            name varchar(255),
            email varchar(255),
            password varchar(255)
        );

        INSERT INTO table_name (name, email, password) VALUES (
            "name", "name@yahoo.com", "password"
        );

    Após instalar as dependências do projeto, crie um arquivo .env caso ele não tenha sido criado previamente pelo instalador de pacotes e popule os dados das variaveis: 
        PORT, SERVER_HOST, DB_PASSWORD, DB_HOST, DB_USER, DB_NAME com os informações correspondentes na sua máquina local.

    Para iniciar o software vá no powershell e na pasta do projeto insira o comando: node .
    

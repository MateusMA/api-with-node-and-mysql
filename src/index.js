// Importa a biblioteca que permite o uso das variaveis do arquivo .env
require('dotenv').config()

// O segundo parenteses serve para chamar a funcao express()
const app = require('express')()
const mysql = require('mysql2')

// Essa funcao realiza uma conexao com o MySQL, geralmente essas conexoes
// sao feitas de forma assincrona atraves de uma promise com await e try catch 
const connection = mysql.createConnection({

    // As credenciais vem de um arquivo .env para evitar o commit de dados sensiveis
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {
    
    if(!err){
        console.log('conexão realizada com sucesso')
    }else{
        console.log('falha ao conectar')
    }
})

app.get('/categorias', (req, res) => {
    
    // A query tambem pode retornar 'fields' alem das colunas
    connection.query('SELECT name, email FROM tbl_user', (err, rows) => {
        if(!err){
            res.send(rows)
        }else{
            res.send({error: 'Usuário não encontrado'})
        }
    })
})

app.listen(process.env.SERVER_HOST)


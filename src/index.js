require('dotenv').config()
require('dotenv-safe').config({
    allowEmptyValues: true
});

const jwt = require('jsonwebtoken');
const app = require('express')();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

app.use(bodyParser.json())
app.use(cors())

let name = ''
let cargo = ''
let access_level = ''
let password = ''

const connection = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err) => {

    if (!err) {
        console.log('conexão realizada com sucesso')
    } else {
        console.log('falha ao conectar')
    }
})

function verifyJWT(req, res, next) {

    const token = req.headers['x-acess-token'];

    if (!token) return res.status(401).json({ auth: false, message: 'Sem token valido.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(401).json({ auth: false, message: 'Falha ao Autenticar.' });

        req.userName = decoded.name;
        next();
    });
}

// app.get('/categorias', verifyJWT, (req, res) => {
app.get('/adminTarefas', (req, res) => {

    let sql = "SELECT * FROM tbl_tarefas WHERE visibility = 'visible'"
    + " ORDER BY id DESC"

    connection.query(sql, (err, rows) => {
        if (!err) {
            res.send(rows)
        } else {
            res.send({ error: 'Usuário não encontrado' })
        }
    })
})

app.post('/cadastrar', (req, res) => {

    name = req.body.name
    cargo = req.body.cargo
    access_level = req.body.access_level
    password = req.body.password

    let sql = "INSERT INTO tbl_usuarios(nome, cargo, nivel_acesso, senha)" +
        " VALUES ('" + name + "','" + cargo + "', '" + access_level + "','" + password + "');"

    if (name != '' && cargo != '' && access_level != '' && password != '') {
        connection.query(sql, function (err) {
            if (!err) {
                res.status(201).send({"message": "Usuário criado"})
            } else {
                res.status(400).send({"message": err})
            }
        })
    }
})

app.get('/myAgenda/:name', (req, res) => {

    let reqName = req.params.name

    let sql = "SELECT * FROM tbl_tarefas " +
    "WHERE nome = '" + reqName + "' AND visibility = 'visible' OR nome2 = '" 
    + reqName + "' AND visibility = 'visible'" +
    " OR nome3 = '" + reqName + "' AND visibility = 'visible' OR nome4 = '" 
    + reqName + "' AND visibility = 'visible' ORDER BY id DESC;"

    connection.query(sql, (err, rows) => {
        if (!err && rows[0] != null) {
            res.send(rows)
        } else {
            res.send({ error: 'Nenhuma tarefa foi atribuida a você', id: '009' })
        }
    })
})

// app.get('/reportTeams/', () => {
    
// })

app.get('/myTask/:id', (req, res) => {

    let reqId = req.params.id

    let sql = "SELECT * FROM tbl_tarefas " +
    "WHERE id = " + reqId + ";"

    connection.query(sql, (err, rows) => {
        if (!err && rows[0] != null) {
            res.send(rows)
        } else {
            res.send({ error: err })
        }
    })
})

app.put('/check', (req, res) => {
    
    let id = req.body.id

    let sql = "UPDATE tbl_tarefas SET boss_check = 1 WHERE id = " + id

    connection.query(sql, (err, rows) => {
        if (!err && rows[0] != null) {
            res.send({message: 'Objeto alterado'})
        } else {
            res.send({message: 'Falha ao alterar' })
        }
    })

})

app.put('/setStatus', (req, res) => {

    let id = req.body.id
    let status = req.body.status
    let date_end = req.body.data_fim

    let sql = "UPDATE tbl_tarefas SET status = '" + status + "', data_fim = '" + date_end 
    + "' WHERE id = " + id + ";";

    connection.query(sql, (err) => {
        if (!err) {
            res.send({message: 'Status da tarefa alterada'})
        } else {
            res.send({message: 'Falha ao alterar' })
        }
    })
})

app.put('/alterTask', (req, res) => {

    let id = req.body.id
    let categoria = req.body.categoria
    let descricao = req.body.descricao
    let data_ini = req.body.data_ini
    let data_prazo = req.body.data_prazo
    let nome = req.body.nome
    let nome2 = req.body.nome2
    let nome3 = req.body.nome3
    let nome4 = req.body.nome4
    let cliente = req.body.cliente
    let local = req.body.local

    let sql = "UPDATE tbl_tarefas SET categoria = '"+ categoria +"', descricao = '"+ descricao +
    "', data_ini = '"+ data_ini +"', data_prazo = '"+ data_prazo +"', nome = '"+ nome +
    "', nome2 = '"+ nome2 +"', nome3 = '"+ nome3 +"', nome4 = '"+ nome4 +
    "', cliente = '"+ cliente +"', local = '"+ local +"' WHERE id = " + id + ";"

    connection.query(sql, (err) => {
        if (!err) {
            res.send({message: 'Tarefa alterado com sucesso'})
        } else {
            res.send({message: 'Nenhum campo foi alterado' })
        }
    })

})

app.post('/criar', (req, res) => {

    let categoria = req.body.categoria
    let descricao = req.body.descricao
    let data_ini = req.body.data_ini
    let data_prazo = req.body.data_prazo
    let nome = req.body.nome
    let nome2 = req.body.nome2
    let nome3 = req.body.nome3
    let nome4 = req.body.nome4
    let status = "Pendente"
    let visibility = "visible"
    let cliente = req.body.cliente
    let local = req.body.local

    let sql = "INSERT INTO tbl_tarefas(categoria, descricao, data_ini, "
    + "data_prazo, nome, nome2, nome3, nome4, status, cliente, local, visibility)" +
        " VALUES ('" + categoria + "','" + descricao + "','" + data_ini + "','" 
        + data_prazo + "','" + nome + "','" + nome2 + "','" + nome3 + "','" 
        + nome4 + "','" + status + "','" + cliente + "','" + local + "', '" 
        + visibility + "');"

        connection.query(sql, function (err) {
            if (!err) {
                res.status(201).send({"message": "Tarefa Criada"})
            } else {
                res.status(400).send({ error: 'Não foi possível inserir' })
            }
        })
})

app.post('/login', (req, res) => {

    let reqName = req.body.name
    let reqPassword = req.body.password

    let sql = "SELECT * FROM tbl_usuarios WHERE nome = '" + reqName + "';"

    connection.query(sql, (err, rows) => {
        if (!err) {
            if ( reqName === rows[0].nome && reqPassword === rows[0].senha) {

                const name = rows[0].nome;
                const access_level = rows[0].nivel_acesso;
                const token = jwt.sign({ name }, process.env.SECRET);
                return res.json({
                    auth: true,
                    message: 'Usuário Logado',
                    name: name,
                    token: token,
                    access_level: access_level
                });
            }else{
                res.status(401).json({ message: 'Login inválido!' });
            }
        } else {
            res.status(500).json({ message: 'Falha na conexão!' });
        }
    })
})

app.post('/logout', function (req, res) {
    res.json({ auth: false, token: null });
})

app.put('/del', function (req, res){
    
    let reqId = req.body.id

    let sql = "UPDATE tbl_tarefas SET visibility = 'hidden' WHERE id = " 
    + reqId + ";"

    connection.query(sql, function (err) {
        if (!err) {
            res.status(200).send({ "message": "Tarefa Deletada" })
        } else {
            res.status(400).send({ error: 'Não foi possível excluir' })
        }
    })
})

app.listen(process.env.SERVER_HTTP, () => console.log('http na porta: '+ process.env.SERVER_HTTP))

https.createServer({
    cert: fs.readFileSync('src/SSL/code.crt'),
    key: fs.readFileSync('src/SSL/code.key')
}, app).listen(process.env.SERVER_HOST, () => console.log('https na porta: ' + process.env.SERVER_HOST))


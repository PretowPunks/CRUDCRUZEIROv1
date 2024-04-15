require('dotenv').config({ path: 'variaveis.env' })
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const routes = require('./routes.js')
const server = express()

// Configurações
server.use(cors())
server.use(bodyParser.json())

// Configuração para servir arquivos estáticos, se necessário
server.use(express.static(path.join(__dirname, 'templates')));

// Configuração do mecanismo de visualização e diretório de visualizações
server.set('views', path.join(__dirname, 'templates'))
server.set('view engine', 'ejs')

// Importe as rotas
server.use('/', routes)

// Inicialização do servidor
server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
})

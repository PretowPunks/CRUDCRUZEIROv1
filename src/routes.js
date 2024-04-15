const express = require('express')
const router = express.Router()
const path = require('path')
const CruzeiroController = require('./controllers/CruzeiroController')


router.get('/planos', CruzeiroController.buscartodos)
router.get('/plano/:id_plano', CruzeiroController.buscarplano)
router.post('/plano', CruzeiroController.inserirplano)
router.put('/editarplano/:id_plano', CruzeiroController.editarplano)
router.delete('/excluirplano/:id_plano', CruzeiroController.excluirplano)

router.get('/',(req, res) => {
    res.render('index.ejs')
})

router.get('/inserir', (req,res) => {
    res.render('inserir.ejs')
})

router.get('/consultar', (req,res) => {
    res.render('consultar.ejs')
})

module.exports = router

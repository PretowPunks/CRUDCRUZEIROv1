const { json } = require('body-parser');
const Cruzeiroservice = require('../services/CruzeiroService');
const console = require('console');
const Joi = require('joi');
const moment = require('moment');

module.exports = {
    buscartodos: async (req, res) => {
        try {
            let planos = await Cruzeiroservice.buscartodos();
            let json = { error: '', result: planos };
            res.status(200).json(json); // Retorna status 200 (OK) e os planos
        } catch (error) {
            let json = { error: 'Erro ao buscar os planos', result: [] };
            res.status(500).json(json); // Retorna mensagem de erro e status 500 (Internal Server Error)
        }
    },

    buscarplano: async (req, res) => {
        try {
            let codigo = req.params.id_plano;
            let plano = await Cruzeiroservice.buscarplano(codigo);
            if (plano) {
                let json = { error: '', result: plano };
                res.status(200).json(json); // Retorna status 200 (OK) e o plano encontrado
            } else {
                let json = { error: 'Plano não encontrado', result: {} };
                res.status(404).json(json); // Retorna mensagem de erro e status 404 (Not Found)
            }
        } catch (error) {
            let json = { error: 'Erro ao buscar o plano', result: {} };
            res.status(500).json(json); // Retorna mensagem de erro e status 500 (Internal Server Error)
        }
    },

    inserirplano: async (req, res) => {
        // Define o esquema de validação
        const schema = Joi.object({
          professor: Joi.string().required(),
          area: Joi.string().required(),
          componente: Joi.string().required(),
          turma: Joi.string().required(),
          objetivos: Joi.string().required(),
          slides: Joi.number().integer().required(),
          tema: Joi.string().required(),
          periodo: Joi.date().iso().required(),
          n_aulas: Joi.number().integer().required(),
          recursos: Joi.string().required(),
          adequacao: Joi.string().required(),
        });
      
        // Extrair os dados do corpo da requisição
        const { error, value } = schema.validate(req.body);
      
        // Validar a data
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
      
        const { professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao } = value;
      
        try {
          // Converte a data do formato YYYY/MM/DD para DD/MM/YYYY
          const dataConvertida = moment(periodo).format('DD/MM/YYYY');
      
          // Chama o serviço para inserir o plano no banco de dados
          const novoPlano = await Cruzeiroservice.inserirplano(
            professor,
            area,
            componente,
            turma,
            objetivos,
            slides,
            tema,
            dataConvertida, // Data convertida enviada para o serviço
            n_aulas,
            recursos,
            adequacao
          );
      
          // Responder ao cliente com o novo plano criado e status 201 (Created)
          res.status(201).json({ result: novoPlano });
        } catch (error) {
          // Tratar erros específicos do service
          if (error.code === 'ERRO_DATA_INVALIDA') {
            return res.status(400).json({ error: 'Data de período inválida' });
          }
      
          // Tratar erros genéricos
          res.status(500).json({ error: 'Erro ao inserir o plano no banco de dados' });
        }
      },
      

    editarplano: async (req, res) => {
        let json = { error: '', result: {} }
    
        // Extrair os dados do corpo da requisição
        let id_plano = req.params.id_plano
        const {professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao } = req.body;
    
        try {
            // Chamar o serviço para inserir o plano no banco de dados
            const novoPlano = await Cruzeiroservice.editarplano(professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao, id_plano);
    
            // Manipular a resposta do serviço
            json.result = novoPlano;
            res.json(json); // Retorna o novo plano e status 201 (Created)
        } catch (error) {
            // Tratar erros
            json.error = 'Erro ao inserir o plano no banco de dados';
            res.json(json); // Retorna mensagem de erro e status 500 (Internal Server Error)
        }
    },

    excluirplano: async (req, res) => {
        try {
            await Cruzeiroservice.excluirplano(req.params.id_plano);
            res.sendStatus(204); // Retorna código de status 204 (No Content) indicando exclusão bem-sucedida
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir o plano do banco de dados' });
        }
    }
}

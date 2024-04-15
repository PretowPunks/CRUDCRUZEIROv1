const db = require('../db.js');

module.exports = {
  buscartodos: () => {
    return new Promise((aceito, rejeitado) => {
      db.query('SELECT * FROM planos', (error, results) => {
        if (error) {
          rejeitado(error);
          return;
        }
        aceito(results);
      });
    });
  },

  buscarplano: (codigo) => {
    return new Promise((aceito, rejeitado) => {
      db.query('SELECT * FROM planos WHERE id_plano = ?', codigo, (error, results) => {
        if (error) {
          rejeitado(error);
          return;
        }
        if (results.length > 0) {
          aceito(results[0]);
        } else {
          aceito(false);
        }
      });
    });
  },

  inserirplano: async (professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao) => {
    try {
      if (!periodo) {
        throw new Error('Data de período não fornecida.');
      }
  
      let periodoString = periodo.toString(); // Converter para string
      // Realizar outras operações necessárias com a data
  
      const queryString = `
        INSERT INTO planos (professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const values = [professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao];
  
      if (!values || values.length === 0) {
        throw new Error('Erro: Array de valores está vazio.');
      }
  
      const [rows, fields] = await db.execute(queryString, values);
  
      return rows.insertId;
    } catch (error) {
      throw new Error('Erro ao inserir plano no banco de dados');
    }
  },

  editarplano: (professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao, id_plano) => {
    return new Promise((aceito, rejeitado) => {
      const queryString = 'UPDATE planos SET professor = ?, area = ?, componente = ?, turma = ?, objetivos = ?, slides = ?, tema = ?, periodo = ?, n_aulas = ?, recursos = ?, adequacao = ? WHERE id_plano = ?';
      const valores = [professor, area, componente, turma, objetivos, slides, tema, periodo, n_aulas, recursos, adequacao];
      db.query(queryString, valores, (error, results) => {
        if (error) {
          rejeitado(error);
          return;
        }
        aceito(results.insertId);
      });
    });
  },

  excluirplano: (codigo) => {
    return new Promise((aceito, rejeitado) => {
      db.query('DELETE FROM planos WHERE id_plano = ?', codigo, (error, results) => {
        if (error) {
          rejeitado(error);
          return;
        }
        aceito();
      });
    });
  },
};

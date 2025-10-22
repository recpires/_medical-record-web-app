const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todos os prontuários
router.get('/', (req, res) => {
    const sql = `
        SELECT p.*, pac.nome_completo as paciente_nome 
        FROM prontuarios p
        INNER JOIN pacientes pac ON p.paciente_id = pac.id
        ORDER BY p.data_criacao DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ prontuarios: rows });
    });
});

// Buscar prontuário por ID
router.get('/:id', (req, res) => {
    const sql = `
        SELECT p.*, pac.* 
        FROM prontuarios p
        INNER JOIN pacientes pac ON p.paciente_id = pac.id
        WHERE p.id = ?
    `;
    
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ mensagem: 'Prontuário não encontrado' });
            return;
        }
        res.json({ prontuario: row });
    });
});

// Criar novo prontuário
router.post('/', (req, res) => {
    const {
        paciente_id, hospital_name, queixa_principal, historia_doenca,
        historia_patologica, historia_familiar, alergias, medicamentos_uso,
        pressao_arterial, frequencia_cardiaca, frequencia_respiratoria,
        temperatura, saturacao, peso, altura, estado_geral, exame_segmentar,
        hipotese_diagnostica, diagnostico_principal, diagnosticos_secundarios,
        exames_solicitados, prescricao_medicamentos, orientacoes,
        cuidados_especiais, data_retorno, evolucao_clinica, conduta,
        medico_responsavel, crm
    } = req.body;

    const sql = `
        INSERT INTO prontuarios (
            paciente_id, hospital_name, queixa_principal, historia_doenca,
            historia_patologica, historia_familiar, alergias, medicamentos_uso,
            pressao_arterial, frequencia_cardiaca, frequencia_respiratoria,
            temperatura, saturacao, peso, altura, estado_geral, exame_segmentar,
            hipotese_diagnostica, diagnostico_principal, diagnosticos_secundarios,
            exames_solicitados, prescricao_medicamentos, orientacoes,
            cuidados_especiais, data_retorno, evolucao_clinica, conduta,
            medico_responsavel, crm
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        paciente_id, hospital_name, queixa_principal, historia_doenca,
        historia_patologica, historia_familiar, alergias, medicamentos_uso,
        pressao_arterial, frequencia_cardiaca, frequencia_respiratoria,
        temperatura, saturacao, peso, altura, estado_geral, exame_segmentar,
        hipotese_diagnostica, diagnostico_principal, diagnosticos_secundarios,
        exames_solicitados, prescricao_medicamentos, orientacoes,
        cuidados_especiais, data_retorno, evolucao_clinica, conduta,
        medico_responsavel, crm
    ], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ mensagem: 'Prontuário criado com sucesso', id: this.lastID });
    });
});

// Atualizar prontuário
router.put('/:id', (req, res) => {
    const dados = req.body;
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(', ');
    const valores = Object.values(dados);
    valores.push(req.params.id);

    const sql = `UPDATE prontuarios SET ${campos}, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?`;

    db.run(sql, valores, function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ mensagem: 'Prontuário atualizado com sucesso', alteracoes: this.changes });
    });
});

// Deletar prontuário
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM prontuarios WHERE id = ?';

    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ mensagem: 'Prontuário deletado com sucesso', alteracoes: this.changes });
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todos os pacientes
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM pacientes ORDER BY nome_completo';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ pacientes: rows });
    });
});

// Buscar paciente por ID
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM pacientes WHERE id = ?';
    
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ mensagem: 'Paciente não encontrado' });
            return;
        }
        res.json({ paciente: row });
    });
});

// Criar novo paciente
router.post('/', (req, res) => {
    const { nome_completo, data_nascimento, cpf, telefone, endereco, convenio } = req.body;

    const sql = `
        INSERT INTO pacientes (nome_completo, data_nascimento, cpf, telefone, endereco, convenio)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome_completo, data_nascimento, cpf, telefone, endereco, convenio], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ mensagem: 'Paciente cadastrado com sucesso', id: this.lastID });
    });
});

// Atualizar paciente
router.put('/:id', (req, res) => {
    const { nome_completo, data_nascimento, cpf, telefone, endereco, convenio } = req.body;

    const sql = `
        UPDATE pacientes 
        SET nome_completo = ?, data_nascimento = ?, cpf = ?, telefone = ?, endereco = ?, convenio = ?
        WHERE id = ?
    `;

    db.run(sql, [nome_completo, data_nascimento, cpf, telefone, endereco, convenio, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json({ mensagem: 'Paciente atualizado com sucesso', alteracoes: this.changes });
    });
});

module.exports = router;
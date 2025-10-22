const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'prontuarios.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        inicializarTabelas();
    }
});

function inicializarTabelas() {
    // Tabela de Pacientes
    db.run(`
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            data_nascimento DATE NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT,
            endereco TEXT,
            convenio TEXT,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de Prontuários
    db.run(`
        CREATE TABLE IF NOT EXISTS prontuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_id INTEGER NOT NULL,
            hospital_name TEXT,
            queixa_principal TEXT,
            historia_doenca TEXT,
            historia_patologica TEXT,
            historia_familiar TEXT,
            alergias TEXT,
            medicamentos_uso TEXT,
            pressao_arterial TEXT,
            frequencia_cardiaca INTEGER,
            frequencia_respiratoria INTEGER,
            temperatura REAL,
            saturacao INTEGER,
            peso REAL,
            altura INTEGER,
            estado_geral TEXT,
            exame_segmentar TEXT,
            hipotese_diagnostica TEXT,
            diagnostico_principal TEXT,
            diagnosticos_secundarios TEXT,
            exames_solicitados TEXT,
            prescricao_medicamentos TEXT,
            orientacoes TEXT,
            cuidados_especiais TEXT,
            data_retorno DATE,
            evolucao_clinica TEXT,
            conduta TEXT,
            medico_responsavel TEXT,
            crm TEXT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
        )
    `);

    console.log('Tabelas criadas/verificadas com sucesso.');
}

module.exports = db;
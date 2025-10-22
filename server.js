const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src'));

// Rotas
const prontuariosRoutes = require('./backend/routes/prontuarios');
const pacientesRoutes = require('./backend/routes/pacientes');

app.use('/api/prontuarios', prontuariosRoutes);
app.use('/api/pacientes', pacientesRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.send('API do Sistema de Prontuário Médico - Hospital NeoVida');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
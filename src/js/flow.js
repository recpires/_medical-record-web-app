// Gerenciamento do fluxo de navegação entre páginas
const FluxoNavegacao = {
    // Definir ordem das páginas
    paginas: [
        'index.html',
        'paciente.html',
        'anamnese.html',
        'exame-fisico.html',
        'diagnostico.html',
        'plano-terapeutico.html',
        'evolucao.html'
    ],
    
    // Obter página atual
    obterPaginaAtual() {
        const caminho = window.location.pathname;
        const nomeArquivo = caminho.split('/').pop();
        return this.paginas.indexOf(nomeArquivo);
    },
    
    // Navegar para próxima página
    proximaPagina() {
        const indiceAtual = this.obterPaginaAtual();
        if (indiceAtual < this.paginas.length - 1) {
            window.location.href = this.paginas[indiceAtual + 1];
        } else {
            alert('Você está na última página do prontuário.');
        }
    },
    
    // Navegar para página anterior
    paginaAnterior() {
        const indiceAtual = this.obterPaginaAtual();
        if (indiceAtual > 0) {
            window.location.href = this.paginas[indiceAtual - 1];
        } else {
            alert('Você está na primeira página.');
        }
    },
    
    // Salvar e continuar
    salvarEContinuar(formulario) {
        const dadosFormulario = new FormData(formulario);
        const dados = Object.fromEntries(dadosFormulario);
        
        // Obter prontuário atual ou criar novo
        let prontuario = StorageManager.carregar()?.prontuarioAtual || {};
        
        // Mesclar dados do formulário atual
        Object.assign(prontuario, dados);
        
        // Salvar prontuário atualizado
        const sucesso = StorageManager.salvar({ 
            prontuarioAtual: prontuario,
            prontuarios: StorageManager.listarProntuarios()
        });
        
        if (sucesso) {
            alert('Dados salvos com sucesso!');
            this.proximaPagina();
        } else {
            alert('Erro ao salvar dados. Por favor, tente novamente.');
        }
    },
    
    // Iniciar novo prontuário
    novoProntuario() {
        if (confirm('Deseja iniciar um novo prontuário? Os dados não salvos serão perdidos.')) {
            StorageManager.salvar({ 
                prontuarioAtual: {},
                prontuarios: StorageManager.listarProntuarios()
            });
            alert('Novo prontuário iniciado!');
            window.location.href = 'paciente.html';
        }
    },
    
    // Validar formulário
    validarFormulario(formulario) {
        const camposObrigatorios = formulario.querySelectorAll('[required]');
        let todosPreenchidos = true;
        let mensagensErro = [];
        
        camposObrigatorios.forEach(campo => {
            if (!campo.value.trim()) {
                todosPreenchidos = false;
                const label = formulario.querySelector(`label[for="${campo.id}"]`);
                const nomeCampo = label ? label.textContent : campo.name;
                mensagensErro.push(`- ${nomeCampo}`);
            }
        });
        
        if (!todosPreenchidos) {
            alert('Por favor, preencha os seguintes campos obrigatórios:\n\n' + mensagensErro.join('\n'));
            return false;
        }
        
        return true;
    },
    
    // Inicializar eventos
    inicializar() {
        // Botão salvar e continuar
        const botaoSalvar = document.querySelector('[data-save-next]');
        if (botaoSalvar) {
            botaoSalvar.addEventListener('click', () => {
                const formulario = document.querySelector('form');
                if (formulario) {
                    if (this.validarFormulario(formulario)) {
                        this.salvarEContinuar(formulario);
                    }
                }
            });
        }
        
        // Botão voltar
        const botaoVoltar = document.querySelector('[data-back]');
        if (botaoVoltar) {
            botaoVoltar.addEventListener('click', () => this.paginaAnterior());
        }
        
        // Botão novo prontuário
        const botaoNovo = document.querySelector('[data-new-record]');
        if (botaoNovo) {
            botaoNovo.addEventListener('click', () => this.novoProntuario());
        }
        
        // Carregar dados salvos
        this.carregarDadosSalvos();
        
        // Exibir mensagem de boas-vindas na primeira vez
        this.exibirBoasVindas();
    },
    
    // Carregar dados salvos no formulário
    carregarDadosSalvos() {
        const prontuario = StorageManager.carregar()?.prontuarioAtual;
        if (!prontuario) return;
        
        const formulario = document.querySelector('form');
        if (!formulario) return;
        
        // Preencher campos do formulário com dados salvos
        Object.keys(prontuario).forEach(chave => {
            const campo = formulario.elements[chave];
            if (campo) {
                campo.value = prontuario[chave];
            }
        });
    },
    
    // Exibir mensagem de boas-vindas
    exibirBoasVindas() {
        const primeiroAcesso = !localStorage.getItem('primeiroAcesso');
        if (primeiroAcesso && window.location.pathname.includes('index.html')) {
            localStorage.setItem('primeiroAcesso', 'false');
            setTimeout(() => {
                alert('Bem-vindo ao Sistema de Prontuário Médico do Hospital NeoVida!\n\nPreencha todas as etapas do prontuário para registrar o atendimento.');
            }, 500);
        }
    }
};

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    FluxoNavegacao.inicializar();
});
/* === BANCO DE DADOS LOCAL (LOCALSTORAGE) === */

// Tenta buscar os dados salvos no navegador. Se não existir, carrega os dados padrão.
let carteiras = JSON.parse(localStorage.getItem('metalWalletData')) || [
    { 
        id: 1, 
        nome: 'Carteira Principal', 
        transacoes: [
            { id: 1001, tipo: 'ganho', valor: 7204.00, data: '2026-10-01', descricao: 'Salário' },
            { id: 1002, tipo: 'gasto', valor: 5100.00, data: '2026-10-15', descricao: 'Contas do mês' }
        ] 
    }
];

let carteiraAtivaId = carteiras[0].id; // Garante que a carteira ativa será sempre a primeira existente
let calendarioDataInicial, calendarioDataFinal, calendarioModal;

// Função para salvar qualquer alteração no navegador
function salvarDadosLocal() {
    localStorage.setItem('metalWalletData', JSON.stringify(carteiras));
}

/* === INICIALIZAÇÃO === */
document.addEventListener('DOMContentLoaded', () => {
    const configFiltros = {
        locale: "pt",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        onChange: () => processarDadosTela()
    };

    calendarioDataInicial = flatpickr("#filtro-data-inicial", configFiltros);
    calendarioDataFinal = flatpickr("#filtro-data-final", configFiltros);
    calendarioModal = flatpickr("#input-data", { locale: "pt", dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y" });

    renderizarSidebarCarteiras();
    processarDadosTela();
});

/* === CONTROLE DO MENU RETRÁTIL === */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

document.getElementById('open-menu').addEventListener('click', toggleMenu);
document.getElementById('close-menu').addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

/* === LÓGICA DE CARTEIRAS === */
function renderizarSidebarCarteiras() {
    const lista = document.getElementById('lista-carteiras');
    lista.innerHTML = '';

    carteiras.forEach(carteira => {
        const isAtiva = carteira.id === carteiraAtivaId;
        const carteiraHTML = `
            <li class="bg-metal-900 rounded border ${isAtiva ? 'border-blue-500' : 'border-metal-700'} overflow-hidden">
                <div class="flex justify-between items-center bg-metal-700 pr-2">
                    <button onclick="alternarCarteira(${carteira.id})" class="flex-1 text-left px-4 py-3 font-semibold text-gray-100 flex items-center">
                        <i class="fas fa-wallet mr-2 ${isAtiva ? 'text-blue-400' : 'text-gray-400'}"></i> ${carteira.nome}
                    </button>
                    
                    <div class="relative group">
                        <button class="p-2 text-gray-400 hover:text-white transition-colors">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <div class="absolute right-0 mt-1 w-32 bg-metal-800 border border-metal-600 rounded shadow-xl hidden group-hover:block z-50">
                            <button onclick="renomearCarteira(${carteira.id})" class="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-metal-700">Renomear</button>
                            <button onclick="excluirCarteira(${carteira.id})" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-metal-700">Excluir</button>
                        </div>
                    </div>
                    
                    <button onclick="toggleSubmenu(${carteira.id})" class="p-3 text-gray-400 hover:text-white border-l border-metal-600">
                        <i class="fas fa-chevron-down text-xs" id="icon-carteira-${carteira.id}"></i>
                    </button>
                </div>
                
                <div id="sub-carteira-${carteira.id}" class="hidden flex-col bg-metal-900 p-2 space-y-1">
                    <button onclick="abrirModal('ganho', null, ${carteira.id})" class="text-left px-4 py-2 text-sm text-gray-300 hover:bg-metal-800 hover:text-emerald-400 rounded transition-colors">
                        <i class="fas fa-arrow-up mr-2 text-emerald-500"></i> Adicionar ganho
                    </button>
                    <button onclick="abrirModal('gasto', null, ${carteira.id})" class="text-left px-4 py-2 text-sm text-gray-300 hover:bg-metal-800 hover:text-red-400 rounded transition-colors">
                        <i class="fas fa-arrow-down mr-2 text-red-500"></i> Adicionar gasto
                    </button>
                </div>
            </li>
        `;
        lista.insertAdjacentHTML('beforeend', carteiraHTML);
    });
}

function alternarCarteira(id) {
    carteiraAtivaId = id;
    renderizarSidebarCarteiras();
    processarDadosTela();
    toggleMenu();
}

function adicionarNovaCarteira() {
    const nome = prompt("Digite o nome da nova carteira:");
    if (nome && nome.trim() !== "") {
        const novaCarteira = { id: Date.now(), nome: nome, transacoes: [] };
        carteiras.push(novaCarteira);
        carteiraAtivaId = novaCarteira.id;
        salvarDadosLocal(); // Salva no navegador
        renderizarSidebarCarteiras();
        processarDadosTela();
    }
}

function renomearCarteira(id) {
    const carteira = carteiras.find(c => c.id === id);
    const novoNome = prompt("Novo nome para a carteira:", carteira.nome);
    if (novoNome && novoNome.trim() !== "") {
        carteira.nome = novoNome;
        salvarDadosLocal(); // Salva no navegador
        renderizarSidebarCarteiras();
        processarDadosTela();
    }
}

function excluirCarteira(id) {
    if (carteiras.length === 1) {
        alert("Você precisa ter pelo menos uma carteira ativa.");
        return;
    }
    if (confirm("Tem certeza que deseja excluir esta carteira e todos os seus lançamentos?")) {
        carteiras = carteiras.filter(c => c.id !== id);
        if (carteiraAtivaId === id) carteiraAtivaId = carteiras[0].id;
        salvarDadosLocal(); // Salva no navegador
        renderizarSidebarCarteiras();
        processarDadosTela();
    }
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(`sub-carteira-${id}`);
    const icon = document.getElementById(`icon-carteira-${id}`);
    submenu.classList.toggle('hidden');
    submenu.classList.toggle('flex');
    icon.classList.toggle('rotate-180');
}

/* === LÓGICA DE PROCESSAMENTO (FILTROS E EXIBIÇÃO) === */
function limparFiltros() {
    calendarioDataInicial.clear();
    calendarioDataFinal.clear();
    processarDadosTela();
}

function processarDadosTela() {
    const carteiraAtual = carteiras.find(c => c.id === carteiraAtivaId);
    
    // Proteção caso a carteira ativa tenha sido excluída e o ID tenha se perdido
    if (!carteiraAtual) {
        carteiraAtivaId = carteiras[0].id;
        return processarDadosTela();
    }

    document.getElementById('nome-carteira-ativa').textContent = carteiraAtual.nome;

    const dataInicio = document.getElementById('filtro-data-inicial').value;
    const dataFim = document.getElementById('filtro-data-final').value;

    let transacoesFiltradas = carteiraAtual.transacoes;

    if (dataInicio && dataFim) {
        transacoesFiltradas = transacoesFiltradas.filter(t => t.data >= dataInicio && t.data <= dataFim);
    } else if (dataInicio) {
        transacoesFiltradas = transacoesFiltradas.filter(t => t.data >= dataInicio);
    } else if (dataFim) {
        transacoesFiltradas = transacoesFiltradas.filter(t => t.data <= dataFim);
    }

    transacoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));

    atualizarDashboard(transacoesFiltradas);
    renderizarPainelLateral(transacoesFiltradas);
}

function atualizarDashboard(transacoes) {
    let ganhos = 0, gastos = 0;
    transacoes.forEach(t => {
        if (t.tipo === 'ganho') ganhos += t.valor;
        if (t.tipo === 'gasto') gastos += t.valor;
    });

    const formatador = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    document.getElementById('display-ganho').textContent = formatador.format(ganhos);
    document.getElementById('display-gasto').textContent = formatador.format(gastos);
    document.getElementById('display-balanco').textContent = formatador.format(ganhos - gastos);
}

function renderizarPainelLateral(transacoes) {
    const lista = document.getElementById('lista-lancamentos');
    lista.innerHTML = '';

    if (transacoes.length === 0) {
        lista.innerHTML = '<p class="text-gray-500 text-center py-4 text-sm">Nenhum lançamento encontrado neste período.</p>';
        return;
    }

    transacoes.forEach(t => {
        const isGanho = t.tipo === 'ganho';
        const dataFormatada = new Date(t.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const valorFormatado = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.valor);
        
        const itemHTML = `
            <div onclick="abrirModal('${t.tipo}', ${t.id}, ${carteiraAtivaId})" class="bg-metal-900 p-3 rounded border border-metal-700 flex justify-between items-center cursor-pointer hover:border-gray-500 transition-colors">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${isGanho ? 'bg-emerald-900/50 text-emerald-500' : 'bg-red-900/50 text-red-500'}">
                        <i class="fas ${isGanho ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                    </div>
                    <div>
                        <p class="font-bold text-gray-200 text-sm">${t.descricao || 'Sem descrição'}</p>
                        <p class="text-xs text-gray-500">${dataFormatada}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${isGanho ? 'text-emerald-400' : 'text-red-400'}">${isGanho ? '+' : '-'}${valorFormatado}</p>
                </div>
            </div>
        `;
        lista.insertAdjacentHTML('beforeend', itemHTML);
    });
}

/* === LÓGICA DO MODAL (CRIAR / EDITAR) === */
function abrirModal(tipo, transacaoId = null, carteiraIdDestino = null) {
    if(!sidebar.classList.contains('-translate-x-full')) toggleMenu();

    const modal = document.getElementById('transaction-modal');
    const modalTitle = document.getElementById('modal-title');
    const btnExcluir = document.getElementById('btn-excluir-transacao');
    const btnSalvar = document.getElementById('btn-salvar-transacao');

    document.getElementById('input-tipo').value = tipo;
    modal.classList.remove('hidden');

    if (transacaoId) {
        modalTitle.textContent = "Editar " + (tipo === 'ganho' ? "Ganho" : "Gasto");
        modalTitle.className = "text-xl font-bold uppercase " + (tipo === 'ganho' ? "text-emerald-500" : "text-red-500");
        
        const carteira = carteiras.find(c => c.id === carteiraAtivaId);
        const transacao = carteira.transacoes.find(t => t.id === transacaoId);
        
        document.getElementById('input-transacao-id').value = transacaoId;
        document.getElementById('input-descricao').value = transacao.descricao || '';
        document.getElementById('input-valor').value = transacao.valor;
        calendarioModal.setDate(transacao.data);
        
        btnExcluir.classList.remove('hidden');
        btnSalvar.classList.replace('w-full', 'w-2/3');
    } else {
        modalTitle.textContent = "Adicionar " + (tipo === 'ganho' ? "Ganho" : "Gasto");
        modalTitle.className = "text-xl font-bold uppercase " + (tipo === 'ganho' ? "text-emerald-500" : "text-red-500");
        
        if(carteiraIdDestino && carteiraAtivaId !== carteiraIdDestino) {
            alternarCarteira(carteiraIdDestino); 
        }

        document.getElementById('input-transacao-id').value = '';
        document.getElementById('input-descricao').value = '';
        document.getElementById('input-valor').value = '';
        calendarioModal.clear();

        btnExcluir.classList.add('hidden');
        btnSalvar.classList.replace('w-2/3', 'w-full');
    }
}

function fecharModal() {
    document.getElementById('transaction-modal').classList.add('hidden');
}

function salvarTransacao() {
    const id = document.getElementById('input-transacao-id').value;
    const tipo = document.getElementById('input-tipo').value;
    const descricao = document.getElementById('input-descricao').value;
    const valor = parseFloat(document.getElementById('input-valor').value);
    const data = document.getElementById('input-data').value;

    if (isNaN(valor) || valor <= 0 || data === "") {
        alert("Preencha o valor e a data corretamente.");
        return;
    }

    const carteira = carteiras.find(c => c.id === carteiraAtivaId);

    if (id) {
        const index = carteira.transacoes.findIndex(t => t.id == id);
        carteira.transacoes[index] = { id: parseInt(id), tipo, descricao, valor, data };
    } else {
        carteira.transacoes.push({ id: Date.now(), tipo, descricao, valor, data });
    }

    salvarDadosLocal(); // Salva no navegador
    processarDadosTela();
    fecharModal();
}

function excluirTransacaoAtual() {
    if (confirm("Deseja realmente excluir este lançamento?")) {
        const id = document.getElementById('input-transacao-id').value;
        const carteira = carteiras.find(c => c.id === carteiraAtivaId);
        
        carteira.transacoes = carteira.transacoes.filter(t => t.id != id);
        
        salvarDadosLocal(); // Salva no navegador
        processarDadosTela();
        fecharModal();
    }
}
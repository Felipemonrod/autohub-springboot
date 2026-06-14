// ============================================================
//  AutoHub — Frontend integrado ao Spring Boot REST API
// ============================================================

const API_BASE = '/api';

// --- HELPERS DE API ---

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`GET ${path} falhou: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  return { status: res.status, headers: res.headers, json };
}

async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  return { status: res.status, json };
}

async function apiPatch(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  return { status: res.status, json };
}

async function apiDelete(path) {
  const res = await fetch(API_BASE + path, { method: 'DELETE' });
  return res.status;
}

// --- HELPERS VISUAIS ---

function formatPrice(value) {
  if (value === null || value === undefined) return 'R$ 0,00';
  return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function parsePrice(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function mapStatus(apiStatus) {
  const map = {
    'CONCLUIDO': 'Concluído', 'EM_ANDAMENTO': 'Em Andamento',
    'AGUARDANDO': 'Aguardando', 'CANCELADO': 'Cancelado'
  };
  return map[apiStatus] || apiStatus;
}

function getBadgeStyle(status) {
  if (['Concluído', 'Entregue', 'CONCLUIDO'].includes(status)) return 'bg-green-100 text-green-700 border-green-200';
  if (['Em Andamento', 'A Caminho', 'EM_ANDAMENTO'].includes(status)) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (['Aguardando', 'AGUARDANDO'].includes(status)) return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function getCarImage(brand) {
  const images = {
    'Toyota': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80',
    'Honda':  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=300&q=80',
    'Ford':   'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=300&q=80',
    'Volkswagen': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=300&q=80',
    'Fiat':   'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80',
    'Chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=300&q=80',
  };
  return images[brand] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80';
}

function getProductImage(category) {
  const images = {
    'Filtros':      'https://images.unsplash.com/photo-1486262715619-670810a0445f?auto=format&fit=crop&w=300&q=80',
    'Freios':       'https://images.unsplash.com/photo-1486262715619-670810a0445f?auto=format&fit=crop&w=300&q=80',
    'Lubrificantes':'https://images.unsplash.com/photo-1610940333216-2495d4f3b7f1?auto=format&fit=crop&w=300&q=80',
    'Suspensão':    'https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=300&q=80',
    'Motor':        'https://images.unsplash.com/photo-1486262715619-670810a0445f?auto=format&fit=crop&w=300&q=80',
  };
  return images[category] || 'https://images.unsplash.com/photo-1486262715619-670810a0445f?auto=format&fit=crop&w=300&q=80';
}

function generateSku(name, category) {
  const cat = (category || 'PRD').toUpperCase().substring(0, 3).replace(/[^A-Z]/g, 'X');
  const nm  = name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
  return `${cat}-${nm}-${Math.floor(Math.random() * 900) + 100}`;
}

function showLoading() {
  return `<div class="flex items-center justify-center h-64">
    <div class="text-slate-400 flex items-center gap-3">
      <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Carregando dados...</span>
    </div>
  </div>`;
}

function showError(msg) {
  return `<div class="flex items-center justify-center h-64">
    <div class="text-red-500 flex flex-col items-center gap-2">
      <i data-lucide="alert-circle" class="w-10 h-10"></i>
      <span class="text-sm font-medium">${msg}</span>
    </div>
  </div>`;
}

// --- MOCK VENDAS (sem endpoint dedicado na API) ---
const MOCK_SALES = [
  { id: 'PED-501', buyer: 'Oficina Master', items: '2x Óleo Sintético, 1x Pastilha', date: '22/10/2023', total: 'R$ 523,90', status: 'Entregue' },
  { id: 'PED-502', buyer: 'João Silva',     items: '1x Amortecedor Dianteiro',       date: '23/10/2023', total: 'R$ 450,00', status: 'A Caminho' }
];

// --- STATE ---
let state = {
  userRole: 'cliente',
  activeTab: 'dashboard',
  sidebarOpen: false
};

// --- SISTEMAS (TABS POR PERFIL) ---
const SYSTEMS = {
  cliente: {
    name: 'João Silva',
    tabs: [
      { id: 'dashboard',   label: 'Início',         icon: 'home' },
      { id: 'vehicles',    label: 'Minha Garagem',  icon: 'car' },
      { id: 'services',    label: 'Meus Serviços',  icon: 'wrench' },
      { id: 'marketplace', label: 'Comprar Peças',  icon: 'shopping-cart' },
      { id: 'chat',        label: 'Mensagens',      icon: 'message-circle' }
    ]
  },
  oficina: {
    name: 'Oficina Master',
    tabs: [
      { id: 'dashboard',   label: 'Painel da Oficina', icon: 'layout-dashboard' },
      { id: 'services',    label: 'Gestão de OS',      icon: 'clipboard-list' },
      { id: 'vehicles',    label: 'Base de Clientes',  icon: 'users' },
      { id: 'marketplace', label: 'Catálogo B2B',      icon: 'package' },
      { id: 'chat',        label: 'Mensagens',         icon: 'message-square' }
    ]
  },
  loja: {
    name: 'AutoPeças Central',
    tabs: [
      { id: 'dashboard', label: 'Visão Geral',      icon: 'pie-chart' },
      { id: 'inventory', label: 'Meu Estoque',      icon: 'boxes' },
      { id: 'sales',     label: 'Pedidos de Venda', icon: 'shopping-bag' },
      { id: 'chat',      label: 'Mensagens',        icon: 'message-circle' }
    ]
  }
};

// --- INICIALIZAÇÃO ---
function init() {
  changeRole(document.getElementById('role-selector').value || 'cliente');
}

// --- CONTROLES DE UI ---
function changeTab(tabId) {
  state.activeTab = tabId;
  toggleSidebar(false);
  renderNavigation();
  updateHeader();
  renderContent();
}

function changeRole(role) {
  state.userRole = role;
  state.activeTab = 'dashboard';
  const sys = SYSTEMS[role];
  document.getElementById('user-name').innerText = sys.name;
  document.getElementById('user-role-text').innerText = role;
  renderNavigation();
  updateHeader();
  renderContent();
  showToast('Sistema Alterado', `Carregando interface para ${role.toUpperCase()}`);
}

function toggleSidebar(forceOpen = null) {
  state.sidebarOpen = forceOpen !== null ? forceOpen : !state.sidebarOpen;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (state.sidebarOpen) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
  }
}

function updateHeader() {
  const titleEl = document.getElementById('page-title');
  const tabs = SYSTEMS[state.userRole].tabs;
  const currentTab = tabs.find(t => t.id === state.activeTab);
  titleEl.innerText = currentTab ? currentTab.label : 'Dashboard';
}

// --- NAVEGAÇÃO ---
function renderNavigation() {
  const navContainer = document.getElementById('nav-links');
  const tabs = SYSTEMS[state.userRole].tabs;
  let html = '';
  for (const tab of tabs) {
    const isActive = state.activeTab === tab.id;
    const base = 'w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer';
    const cls  = isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200';
    const icol = isActive ? 'text-blue-500' : 'text-slate-500';
    html += `<button onclick="changeTab('${tab.id}')" class="${base} ${cls}">
      <div class="${icol}"><i data-lucide="${tab.icon}" class="w-5 h-5"></i></div>${tab.label}
    </button>`;
  }
  navContainer.innerHTML = html;
  lucide.createIcons();
}

// --- ROTEADOR ASSÍNCRONO DE CONTEÚDO ---
async function renderContent() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = showLoading();

  try {
    let html = '';
    const r = state.userRole, t = state.activeTab;

    if      (r === 'cliente'  && t === 'dashboard')   html = await viewClienteDashboard();
    else if (r === 'cliente'  && t === 'vehicles')     html = await viewClienteVehicles();
    else if (r === 'cliente'  && t === 'services')     html = await viewClienteServices();
    else if (r === 'cliente'  && t === 'marketplace')  html = await viewMarketplace(true);
    else if (r === 'cliente'  && t === 'chat')         html = viewChat();
    else if (r === 'oficina'  && t === 'dashboard')    html = await viewOficinaDashboard();
    else if (r === 'oficina'  && t === 'services')     html = await viewOficinaServices();
    else if (r === 'oficina'  && t === 'vehicles')     html = await viewOficinaClients();
    else if (r === 'oficina'  && t === 'marketplace')  html = await viewMarketplace(false);
    else if (r === 'oficina'  && t === 'chat')         html = viewChat();
    else if (r === 'loja'     && t === 'dashboard')    html = await viewLojaDashboard();
    else if (r === 'loja'     && t === 'inventory')    html = await viewLojaInventory();
    else if (r === 'loja'     && t === 'sales')        html = viewLojaSales();
    else if (r === 'loja'     && t === 'chat')         html = viewChat();

    contentArea.innerHTML = html;
  } catch (err) {
    contentArea.innerHTML = showError('Falha ao carregar dados. Verifique se o servidor está rodando.');
    console.error(err);
  }

  lucide.createIcons();
}

// ============================================================
//  VIEWS — CLIENTE
// ============================================================

async function viewClienteDashboard() {
  const [vehicles, orders] = await Promise.all([
    apiGet('/vehicles'),
    apiGet('/service-orders')
  ]);
  const ativos = orders.filter(o => o.status === 'EM_ANDAMENTO').length;

  return `
    <div class="space-y-6 fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onclick="changeTab('vehicles')">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <i data-lucide="car" class="w-6 h-6 text-slate-700"></i>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium mb-1">Meus Carros</p>
            <h3 class="text-2xl font-bold text-slate-800">${vehicles.length}</h3>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onclick="changeTab('services')">
          <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <i data-lucide="wrench" class="w-6 h-6 text-blue-600"></i>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium mb-1">Serviços Ativos</p>
            <h3 class="text-2xl font-bold text-slate-800">${ativos}</h3>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-lg font-semibold mb-2">Visão Geral</h3>
        <p class="text-sm text-slate-500 mb-4">Acompanhe o status dos consertos e novidades.</p>
        <div class="bg-blue-50 text-blue-800 p-4 rounded-lg flex flex-col sm:flex-row items-start gap-3 mt-4">
          <i data-lucide="bell" class="w-5 h-5 shrink-0 sm:mt-0.5 text-blue-600"></i>
          <div>
            <p class="font-medium">Lembrete de Manutenção</p>
            <p class="text-sm opacity-80 mt-1">Verifique o status dos seus veículos na garagem.</p>
            <button class="mt-2 text-sm font-bold underline cursor-pointer" onclick="changeTab('services')">Ver serviços ativos</button>
          </div>
        </div>
      </div>
    </div>`;
}

async function viewClienteVehicles() {
  const vehicles = await apiGet('/vehicles');
  const html = vehicles.map(v => `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
      <div class="h-48 overflow-hidden relative">
        <img src="${getCarImage(v.brand)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">${v.plate}</div>
      </div>
      <div class="p-5">
        <h3 class="font-semibold text-lg text-slate-800">${v.brand} ${v.model}</h3>
        <p class="text-sm text-slate-500 mb-4">Ano: ${v.year} ${v.color ? '· ' + v.color : ''}</p>
        <button class="w-full bg-slate-100 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer" onclick="showToast('Documentação', 'Abrindo documentação digital do veículo...')">Ver Documentação Digital</button>
      </div>
    </div>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-slate-500 text-sm">Controle completo da sua garagem.</p>
        <button onclick="openVehicleModal(null, 'CLIENTE')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium cursor-pointer shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i> Adicionar
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${html || '<p class="text-slate-400 col-span-full text-center py-8">Nenhum veículo cadastrado.</p>'}</div>
    </div>`;
}

async function viewClienteServices() {
  const orders = await apiGet('/service-orders');
  const trsHtml = orders.map(o => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td class="p-4 text-sm font-medium text-slate-700">${o.shopName || '-'}</td>
      <td class="p-4 text-sm text-slate-600">${o.description} — ${o.vehiclePlate}</td>
      <td class="p-4 text-sm text-slate-600">${o.createdAt ? new Date(o.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
      <td class="p-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getBadgeStyle(o.status)}">${mapStatus(o.status)}</span></td>
      <td class="p-4 text-right">
        <button onclick="showToast('OS #${o.id}', '${o.description}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer underline">Ver Detalhes</button>
      </td>
    </tr>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead><tr class="bg-slate-50 text-slate-500 border-b border-slate-200">
            <th class="p-4 font-medium text-sm">Oficina</th>
            <th class="p-4 font-medium text-sm">Serviço & Veículo</th>
            <th class="p-4 font-medium text-sm">Data</th>
            <th class="p-4 font-medium text-sm">Status</th>
            <th class="p-4 font-medium text-sm text-right">Ação</th>
          </tr></thead>
          <tbody>${trsHtml || '<tr><td colspan="5" class="p-8 text-center text-slate-400">Nenhuma ordem de serviço encontrada.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================
//  VIEWS — OFICINA
// ============================================================

async function viewOficinaDashboard() {
  const orders = await apiGet('/service-orders');
  const ativos = orders.filter(o => o.status !== 'CONCLUIDO' && o.status !== 'CANCELADO').length;

  return `
    <div class="space-y-6 fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-sm">
          <p class="text-sm text-slate-400 font-medium mb-1">Ordens de Serviço</p>
          <h3 class="text-3xl font-bold">${orders.length} no total</h3>
          <span class="text-xs text-green-400 font-medium">Dados em tempo real</span>
        </div>
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="changeTab('services')">
          <p class="text-sm text-slate-500 font-medium mb-1">Pátio (OS Ativas)</p>
          <h3 class="text-3xl font-bold text-orange-600">${ativos} Veículos</h3>
        </div>
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-sm text-slate-500 font-medium mb-1">Concluídas</p>
          <h3 class="text-3xl font-bold text-blue-600">${orders.filter(o => o.status === 'CONCLUIDO').length}</h3>
        </div>
      </div>
      <div class="bg-blue-600 text-white p-6 md:p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col items-start gap-4">
        <div class="absolute -right-8 -top-8 opacity-10"><i data-lucide="zap" class="w-48 h-48"></i></div>
        <h3 class="text-2xl font-bold relative z-10">Agilidade no Cadastro!</h3>
        <p class="text-blue-100 max-w-lg relative z-10 text-sm md:text-base">Cadastre veículos de clientes diretamente pelo sistema e abra a OS com um clique.</p>
        <button onclick="changeTab('vehicles')" class="bg-white text-blue-700 hover:bg-slate-50 px-6 py-2.5 rounded-lg font-bold shadow-sm relative z-10 transition-colors cursor-pointer mt-2">Localizar pela Placa</button>
      </div>
    </div>`;
}

async function viewOficinaServices() {
  const orders = await apiGet('/service-orders');
  const trsHtml = orders.map(o => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td class="p-4 text-sm font-bold text-slate-700">OS-${o.id}</td>
      <td class="p-4">
        <div class="font-medium text-slate-800">${o.vehiclePlate} (${o.vehicleBrand} ${o.vehicleModel})</div>
      </td>
      <td class="p-4 text-sm text-slate-600 max-w-xs truncate">${o.description}</td>
      <td class="p-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(o.status)}">${mapStatus(o.status)}</span></td>
      <td class="p-4 text-sm font-bold text-slate-800">${formatPrice(o.totalPrice)}</td>
      <td class="p-4 text-right">
        <button onclick="openUpdateStatusModal(${o.id}, '${o.status}')" class="text-slate-400 hover:text-blue-600 cursor-pointer p-1"><i data-lucide="edit-3" class="w-5 h-5"></i></button>
      </td>
    </tr>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div class="relative w-full sm:w-64">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"></i>
          <input type="text" placeholder="Filtrar placa ou cliente..." class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-slate-50" />
        </div>
        <button onclick="openNewOSModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center w-full sm:w-auto gap-2 font-medium cursor-pointer shadow-sm">
          <i data-lucide="file-plus" class="w-4 h-4"></i> Nova OS
        </button>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead><tr class="bg-slate-50 text-slate-500 border-b border-slate-200">
            <th class="p-4 font-medium text-sm">OS ID</th>
            <th class="p-4 font-medium text-sm">Veículo</th>
            <th class="p-4 font-medium text-sm">Serviço</th>
            <th class="p-4 font-medium text-sm">Status</th>
            <th class="p-4 font-medium text-sm">Orçamento</th>
            <th class="p-4 font-medium text-sm text-right">Gerenciar</th>
          </tr></thead>
          <tbody>${trsHtml || '<tr><td colspan="6" class="p-8 text-center text-slate-400">Nenhuma OS encontrada.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`;
}

async function viewOficinaClients() {
  const vehicles = await apiGet('/vehicles');
  let currentVehicles = vehicles;

  const html = (list) => list.map(v => `
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
      <div class="flex items-start gap-4">
        <img src="${getCarImage(v.brand)}" class="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" />
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-slate-800 text-lg leading-tight uppercase">${v.plate}</h4>
          <p class="text-xs text-slate-500 mt-0.5">${v.brand} ${v.model} (${v.year})</p>
          <div class="mt-2 text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded inline-flex items-center gap-1.5">
            <i data-lucide="user" class="w-3 h-3 text-blue-600"></i> ${v.ownerName || 'Não informado'}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="openNewOSModal(${v.id})" class="flex-1 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold transition-colors shadow-sm cursor-pointer">Recepção</button>
        <button onclick="showToast('Histórico', 'Carregando histórico de ${v.plate}...')" class="flex-1 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-bold transition-colors cursor-pointer">Histórico</button>
      </div>
    </div>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative w-full sm:w-64">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"></i>
          <input id="vehicle-search-input" type="text" placeholder="Localize pela placa..." onkeyup="handleVehicleSearch(this.value)"
            class="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm outline-none focus:border-blue-500" />
        </div>
        <button onclick="openVehicleModal(null, 'OFICINA')" class="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm w-full sm:w-auto hover:bg-slate-800 cursor-pointer shadow-sm">+ Cadastrar Novo Cliente</button>
      </div>
      <div id="vehicles-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">${html(vehicles)}</div>
    </div>`;
}

// ============================================================
//  VIEWS — LOJA
// ============================================================

async function viewLojaDashboard() {
  const [products, lowStock] = await Promise.all([
    apiGet('/products'),
    apiGet('/products/low-stock')
  ]);

  const lowStockHtml = lowStock.slice(0, 3).map(p => `
    <div class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <div>
        <span class="text-sm font-medium text-slate-700 block">${p.name}</span>
        <span class="text-[10px] text-slate-400">SKU: ${p.sku}</span>
      </div>
      <span class="text-sm font-bold text-white bg-red-600 px-2 py-0.5 rounded shadow-sm">Restam ${p.stockQuantity}</span>
    </div>`).join('') || '<p class="text-sm text-green-600 font-medium">Estoque OK em todos os produtos.</p>';

  return `
    <div class="space-y-6 fade-in">
      <div class="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-8 rounded-2xl text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div class="relative z-10 w-full md:w-auto">
          <p class="text-blue-200 font-medium mb-1 text-sm uppercase tracking-wider">Produtos no Catálogo</p>
          <h2 class="text-4xl md:text-5xl font-black mb-2">${products.length}<span class="text-xl text-blue-300"> itens</span></h2>
          <p class="text-sm text-blue-200 flex items-center gap-2"><i data-lucide="trending-up" class="w-4 h-4"></i> Gerenciados pelo AutoHub</p>
        </div>
        <div class="relative z-10 bg-white/10 p-5 rounded-xl backdrop-blur-md border border-white/20 text-center w-full md:w-64 shadow-inner">
          <p class="text-xs uppercase tracking-wider mb-1 font-semibold text-blue-100">Alertas de Estoque Baixo</p>
          <p class="text-4xl font-bold text-orange-300 mt-2 mb-4">${lowStock.length}</p>
          <button onclick="changeTab('inventory')" class="w-full text-sm bg-white text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm cursor-pointer">Ir para Estoque</button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl border ${lowStock.length > 0 ? 'border-red-200' : 'border-green-200'} shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="changeTab('inventory')">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full ${lowStock.length > 0 ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center ${lowStock.length > 0 ? 'text-red-600' : 'text-green-600'}">
              <i data-lucide="${lowStock.length > 0 ? 'alert-triangle' : 'check-circle'}" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-lg text-slate-800">Alerta de Estoque Baixo</h3>
          </div>
          <div class="space-y-3">${lowStockHtml}</div>
        </div>
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="font-bold text-lg mb-4 text-slate-800">Mais Vendidos da Semana</h3>
          <div class="space-y-4">
            ${products.slice(0, 2).map((p, i) => `
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">#${i+1}</div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-700">${p.name}</p>
                <p class="text-xs text-slate-400">Estoque: ${p.stockQuantity} un.</p>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

async function viewLojaInventory(filterQuery = '') {
  const products = await apiGet('/products');
  const filtered = filterQuery
    ? products.filter(p => p.name.toLowerCase().includes(filterQuery.toLowerCase()) || (p.category || '').toLowerCase().includes(filterQuery.toLowerCase()))
    : products;

  const grid = filtered.length === 0
    ? '<div class="col-span-full py-12 text-center text-slate-500 font-medium">Nenhum produto encontrado.</div>'
    : filtered.map(p => `
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
        <div class="h-32 bg-slate-100 p-2 relative flex justify-center items-center">
          <img src="${getProductImage(p.category)}" alt="${p.name}" class="h-full object-contain rounded mix-blend-multiply" />
          <span class="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-medium uppercase">${p.category || 'Peça'}</span>
        </div>
        <div class="p-4 flex flex-col flex-1 bg-white">
          <h3 class="font-medium text-slate-800 line-clamp-2 text-sm h-10 mb-2">${p.name}</h3>
          <div class="mt-auto flex items-center justify-between">
            <span class="text-lg font-bold text-slate-900">${formatPrice(p.price)}</span>
            <span class="${p.stockQuantity <= (p.lowStockThreshold || 5) ? 'text-red-700 bg-red-100' : 'text-blue-700 bg-blue-50'} text-xs font-bold px-2 py-1 rounded shadow-sm">Estoque: ${p.stockQuantity}</span>
          </div>
        </div>
        <div class="border-t border-slate-100 flex text-xs font-semibold bg-slate-50">
          <button onclick="openProductModal(${p.id})" class="flex-1 py-3 text-slate-600 hover:bg-white hover:text-blue-600 transition-colors cursor-pointer"><i data-lucide="edit-2" class="w-3.5 h-3.5 inline mr-1"></i> Editar</button>
          <button onclick="deleteProduct(${p.id})" class="flex-1 py-3 text-slate-600 hover:bg-white hover:text-red-600 transition-colors border-l border-slate-200 cursor-pointer"><i data-lucide="trash" class="w-3.5 h-3.5 inline mr-1"></i> Apagar</button>
        </div>
      </div>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative w-full sm:w-80">
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"></i>
          <input type="text" onkeyup="filterInventory(this.value)" placeholder="Filtrar por nome ou categoria..."
            class="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm outline-none focus:border-blue-500" />
        </div>
        <button onclick="openProductModal(null)" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium w-full sm:w-auto shadow-sm cursor-pointer">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Novo Produto
        </button>
      </div>
      <div id="inventory-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">${grid}</div>
    </div>`;
}

async function filterInventory(query) {
  const products = await apiGet('/products');
  const filtered = query
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.category || '').toLowerCase().includes(query.toLowerCase()))
    : products;
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;
  grid.innerHTML = filtered.length === 0
    ? '<div class="col-span-full py-12 text-center text-slate-500">Nenhum produto encontrado.</div>'
    : filtered.map(p => `
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        <div class="h-32 bg-slate-100 p-2 relative flex justify-center items-center">
          <img src="${getProductImage(p.category)}" class="h-full object-contain mix-blend-multiply" />
          <span class="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-medium uppercase">${p.category || 'Peça'}</span>
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-medium text-slate-800 line-clamp-2 text-sm h-10 mb-2">${p.name}</h3>
          <div class="mt-auto flex items-center justify-between">
            <span class="text-lg font-bold">${formatPrice(p.price)}</span>
            <span class="${p.stockQuantity <= (p.lowStockThreshold||5) ? 'text-red-700 bg-red-100' : 'text-blue-700 bg-blue-50'} text-xs font-bold px-2 py-1 rounded">Estoque: ${p.stockQuantity}</span>
          </div>
        </div>
        <div class="border-t border-slate-100 flex text-xs font-semibold bg-slate-50">
          <button onclick="openProductModal(${p.id})" class="flex-1 py-3 text-slate-600 hover:text-blue-600 cursor-pointer">Editar</button>
          <button onclick="deleteProduct(${p.id})" class="flex-1 py-3 text-slate-600 hover:text-red-600 border-l border-slate-200 cursor-pointer">Apagar</button>
        </div>
      </div>`).join('');
  lucide.createIcons();
}

function viewLojaSales() {
  const trs = MOCK_SALES.map(s => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td class="p-4 text-sm font-bold text-slate-800 uppercase">${s.id}</td>
      <td class="p-4 text-sm font-medium text-slate-700">${s.buyer}</td>
      <td class="p-4 text-xs text-slate-500 max-w-xs truncate">${s.items}</td>
      <td class="p-4 text-sm text-slate-500">${s.date}</td>
      <td class="p-4 text-sm font-bold text-slate-900">${s.total}</td>
      <td class="p-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(s.status)}">${s.status}</span></td>
      <td class="p-4 text-right"><button class="text-blue-600 text-sm font-bold underline cursor-pointer" onclick="openGenericModal('Pedido ${s.id}')">Gerenciar</button></td>
    </tr>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead><tr class="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
            <th class="p-4">Pedido ID</th><th class="p-4">Comprador</th><th class="p-4">Itens</th>
            <th class="p-4">Data</th><th class="p-4">Total</th><th class="p-4">Status</th><th class="p-4 text-right">Ação</th>
          </tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </div>
    </div>`;
}

async function viewMarketplace(isClient) {
  const products = await apiGet('/products');
  const prodHtml = products.map(p => `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
      <div class="h-40 bg-white p-4 relative flex items-center justify-center border-b border-slate-100">
        <img src="${getProductImage(p.category)}" alt="${p.name}" class="h-32 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div class="p-4 flex flex-col flex-1 bg-slate-50/50">
        <span class="text-[10px] uppercase tracking-wider font-bold text-blue-500 mb-1 inline-block">${p.category || 'Peças'}</span>
        <h3 class="font-medium text-slate-800 line-clamp-2 text-sm leading-snug mb-2">${p.name}</h3>
        <p class="text-[10px] text-slate-500 mt-auto uppercase tracking-wider font-semibold">Fornecedor: <span class="text-blue-600">AutoPeças Central</span></p>
        <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
          <span class="text-xl font-bold text-slate-900">${formatPrice(p.price)}</span>
          <button class="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer" onclick="showToast('Carrinho', '${p.name} adicionado com sucesso!')">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>`).join('');

  return `
    <div class="space-y-6 fade-in">
      <div class="bg-slate-900 text-white p-6 rounded-xl shadow-lg mb-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="relative z-10 w-full md:w-auto">
          <h2 class="text-xl font-bold mb-1">${isClient ? 'Encontre as peças certas' : 'Atacado de Peças B2B'}</h2>
          <p class="text-slate-300 text-sm max-w-md">${isClient ? 'Compre peças com a garantia AutoHub.' : 'Compre com desconto usando seu CNPJ.'}</p>
        </div>
        <div class="relative z-10 w-full md:w-80">
          <div class="relative">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"></i>
            <input type="text" placeholder="Buscar por Peça ou SKU..." class="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg text-sm outline-none focus:border-white transition-all" />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">${prodHtml}</div>
    </div>`;
}

// ============================================================
//  VIEW — CHAT (sem API, interface de demonstração)
// ============================================================

function viewChat() {
  return `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex overflow-hidden fade-in">
      <div class="w-20 md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
        <div class="p-4 border-b border-slate-200 hidden md:flex items-center justify-between">
          <span class="font-bold text-lg text-slate-800">Mensagens</span>
          <button class="p-1.5 bg-slate-200 text-slate-600 rounded-lg cursor-pointer"><i data-lucide="edit" class="w-4 h-4"></i></button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="p-3 md:p-4 flex items-center md:items-start md:gap-3 border-b border-slate-200 bg-white cursor-pointer relative shadow-sm">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
            <div class="w-12 h-12 md:w-10 md:h-10 rounded-full mx-auto md:mx-0 bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">OM</div>
            <div class="flex-1 overflow-hidden hidden md:block">
              <div class="flex justify-between items-center mb-0.5"><h4 class="font-bold text-sm text-slate-800">Oficina Master</h4><span class="text-[10px] text-blue-600 font-bold">10:42</span></div>
              <p class="text-xs text-slate-500 truncate mt-0.5">Veículo está pronto para retirada.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col bg-[#f0f2f5] min-w-0">
        <div class="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">OM</div>
            <div>
              <h3 class="font-bold text-sm text-slate-800">Oficina Master</h3>
              <p class="text-[10px] text-green-600 uppercase font-bold tracking-widest flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online</p>
            </div>
          </div>
        </div>
        <div class="flex-1 p-6 overflow-y-auto flex flex-col gap-4" id="chat-messages">
          <div class="text-center text-[10px] text-slate-400 font-medium uppercase bg-slate-200/50 mx-auto px-3 py-1 rounded-full">Hoje</div>
          <div class="self-start bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] md:max-w-md shadow-sm">
            <p class="text-sm text-slate-700">Olá, o serviço está em andamento. Identificamos necessidade de troca da pastilha. Podemos prosseguir?</p>
            <span class="text-[10px] text-slate-400 mt-2 block text-right">09:45</span>
          </div>
        </div>
        <div class="p-4 bg-slate-100 flex gap-2">
          <input type="text" id="chat-input" placeholder="Escreva uma resposta..." class="flex-1 bg-white border border-slate-200 rounded-full px-5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" onkeyup="if(event.key==='Enter') sendChatMessage()" />
          <button class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-sm cursor-pointer" onclick="sendChatMessage()">
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  const container = document.getElementById('chat-messages');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  container.insertAdjacentHTML('beforeend', `
    <div class="self-end bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] md:max-w-md shadow-md fade-in">
      <p class="text-sm">${text}</p>
      <span class="text-[10px] text-blue-200 mt-2 block text-right">${time}</span>
    </div>`);
  input.value = '';
  container.scrollTop = container.scrollHeight;
}

// ============================================================
//  MODAL — PRODUTO (Criar / Editar via API)
// ============================================================

async function openProductModal(id) {
  let product = { name: '', price: '', stockQuantity: '', category: '', sku: '', description: '' };
  if (id !== null && id !== undefined) {
    try { product = await apiGet(`/products/${id}`); } catch(e) { showToast('Erro', 'Falha ao carregar produto.'); return; }
  }
  const isEditing = id !== null && id !== undefined;

  document.getElementById('modal-container').innerHTML = `
    <div id="product-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden zoom-in border border-slate-200">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-lg text-slate-800 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-600"></div> ${isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onclick="closeProductModal()" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <form onsubmit="saveProduct(event, ${id ?? 'null'})" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nome da Peça</label>
            <input type="text" id="prod-name" value="${product.name}" required class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Preço (R$)</label>
              <input type="number" step="0.01" id="prod-price" value="${product.price}" placeholder="0.00" required class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Estoque</label>
              <input type="number" id="prod-stock" value="${product.stockQuantity}" required class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Categoria</label>
              <input type="text" id="prod-category" value="${product.category || ''}" placeholder="Ex: Suspensão" required class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">SKU</label>
              <input type="text" id="prod-sku" value="${product.sku || ''}" placeholder="Auto-gerado" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div id="prod-error" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></div>
          <div class="pt-4 border-t border-slate-100 flex gap-3">
            <button type="button" onclick="closeProductModal()" class="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 cursor-pointer">Cancelar</button>
            <button type="submit" class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 cursor-pointer">${isEditing ? 'Salvar Alterações' : 'Cadastrar'}</button>
          </div>
        </form>
      </div>
    </div>`;
  lucide.createIcons();
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) { modal.style.opacity = '0'; setTimeout(() => document.getElementById('modal-container').innerHTML = '', 200); }
}

async function saveProduct(event, id) {
  event.preventDefault();
  const name     = document.getElementById('prod-name').value.trim();
  const price    = parseFloat(document.getElementById('prod-price').value);
  const stock    = parseInt(document.getElementById('prod-stock').value, 10);
  const category = document.getElementById('prod-category').value.trim();
  const skuInput = document.getElementById('prod-sku').value.trim();
  const sku      = skuInput || generateSku(name, category);
  const errEl    = document.getElementById('prod-error');

  try {
    let result;
    if (id === null || id === undefined || id === 'null') {
      result = await apiPost('/products', { name, price, stockQuantity: stock, category, sku, lowStockThreshold: 5 });
      if (result.status === 409) {
        errEl.textContent = result.json.message || 'SKU já cadastrado.';
        errEl.classList.remove('hidden');
        return;
      }
      if (result.status === 201) showToast('Cadastrado!', `${name} adicionado ao estoque.`);
    } else {
      result = await apiPut(`/products/${id}`, { name, price, stockQuantity: stock, category, sku, lowStockThreshold: 5 });
      if (result.status === 409) {
        errEl.textContent = result.json.message;
        errEl.classList.remove('hidden');
        return;
      }
      if (result.status === 200) showToast('Atualizado!', 'As informações foram salvas.');
    }
    closeProductModal();
    renderContent();
  } catch (e) {
    errEl.textContent = 'Erro de comunicação com o servidor.';
    errEl.classList.remove('hidden');
  }
}

async function deleteProduct(id) {
  if (!confirm('Tem certeza que deseja apagar este produto?')) return;
  const status = await apiDelete(`/products/${id}`);
  if (status === 204) {
    showToast('Removido', 'Produto apagado do estoque.');
    renderContent();
  } else {
    showToast('Erro', 'Não foi possível apagar o produto.');
  }
}

// ============================================================
//  MODAL — VEÍCULO (Criar via API com tratamento de 201 e 409)
// ============================================================

function openVehicleModal(id, defaultRole) {
  document.getElementById('modal-container').innerHTML = `
    <div id="vehicle-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden zoom-in border border-slate-200">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-lg text-slate-800 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-600"></div> Novo Veículo</h2>
          <button onclick="closeVehicleModal()" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <form onsubmit="saveVehicle(event)" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Placa</label>
              <input type="text" id="veh-plate" placeholder="ABC1234" required maxlength="8"
                class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500 uppercase" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Ano</label>
              <input type="number" id="veh-year" placeholder="${new Date().getFullYear()}" min="1950" max="2100" required
                class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Marca</label>
              <input type="text" id="veh-brand" placeholder="Toyota" required class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Modelo</label>
              <input type="text" id="veh-model" placeholder="Corolla" required class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cor</label>
              <input type="text" id="veh-color" placeholder="Prata" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Proprietário</label>
              <input type="text" id="veh-owner" placeholder="Nome completo" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <input type="hidden" id="veh-role" value="${defaultRole || 'CLIENTE'}" />
          <div id="veh-error" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></div>
          <div id="veh-success" class="hidden text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"></div>
          <div class="pt-4 border-t border-slate-100 flex gap-3">
            <button type="button" onclick="closeVehicleModal()" class="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 cursor-pointer">Cancelar</button>
            <button type="submit" class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 cursor-pointer">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>`;
  lucide.createIcons();
}

function closeVehicleModal() {
  const m = document.getElementById('vehicle-modal');
  if (m) { m.style.opacity = '0'; setTimeout(() => document.getElementById('modal-container').innerHTML = '', 200); }
}

async function saveVehicle(event) {
  event.preventDefault();
  const payload = {
    plate:     document.getElementById('veh-plate').value.toUpperCase().trim(),
    brand:     document.getElementById('veh-brand').value.trim(),
    model:     document.getElementById('veh-model').value.trim(),
    year:      parseInt(document.getElementById('veh-year').value, 10),
    color:     document.getElementById('veh-color').value.trim(),
    ownerName: document.getElementById('veh-owner').value.trim(),
    userRole:  document.getElementById('veh-role').value
  };
  const errEl = document.getElementById('veh-error');
  const sucEl = document.getElementById('veh-success');
  errEl.classList.add('hidden');

  try {
    const result = await apiPost('/vehicles', payload);
    if (result.status === 201) {
      const loc = result.headers.get('Location');
      sucEl.textContent = `Veículo cadastrado! Location: ${loc}`;
      sucEl.classList.remove('hidden');
      showToast('Cadastrado! ✓', `Placa ${payload.plate} cadastrada com sucesso. HTTP 201 Created.`);
      setTimeout(() => { closeVehicleModal(); renderContent(); }, 1500);
    } else if (result.status === 409) {
      const code = result.headers.get('X-Error-Code');
      errEl.textContent = `${result.json.message} (HTTP 409 Conflict · X-Error-Code: ${code})`;
      errEl.classList.remove('hidden');
    } else if (result.status === 400) {
      errEl.textContent = result.json.message || 'Dados inválidos.';
      errEl.classList.remove('hidden');
    }
  } catch (e) {
    errEl.textContent = 'Erro de comunicação com o servidor.';
    errEl.classList.remove('hidden');
  }
}

// ============================================================
//  MODAL — NOVA OS
// ============================================================

function openNewOSModal(vehicleId) {
  document.getElementById('modal-container').innerHTML = `
    <div id="os-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden zoom-in border border-slate-200">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-lg text-slate-800 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-600"></div> Nova Ordem de Serviço</h2>
          <button onclick="closeOSModal()" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <form onsubmit="saveServiceOrder(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">ID do Veículo</label>
            <input type="number" id="os-vehicle-id" value="${vehicleId || ''}" placeholder="ID do veículo cadastrado" required
              class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Descrição do Serviço</label>
            <textarea id="os-description" required rows="3" placeholder="Descreva o serviço solicitado..."
              class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500 resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Oficina Responsável</label>
              <input type="text" id="os-shop" placeholder="Nome da oficina" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Orçamento (R$)</label>
              <input type="number" step="0.01" id="os-price" placeholder="0.00" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div id="os-error" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></div>
          <div class="pt-4 border-t border-slate-100 flex gap-3">
            <button type="button" onclick="closeOSModal()" class="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 cursor-pointer">Cancelar</button>
            <button type="submit" class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 cursor-pointer">Criar OS</button>
          </div>
        </form>
      </div>
    </div>`;
  lucide.createIcons();
}

function closeOSModal() {
  const m = document.getElementById('os-modal');
  if (m) { m.style.opacity = '0'; setTimeout(() => document.getElementById('modal-container').innerHTML = '', 200); }
}

async function saveServiceOrder(event) {
  event.preventDefault();
  const payload = {
    vehicleId:   parseInt(document.getElementById('os-vehicle-id').value, 10),
    description: document.getElementById('os-description').value.trim(),
    shopName:    document.getElementById('os-shop').value.trim(),
    totalPrice:  parseFloat(document.getElementById('os-price').value) || null
  };
  const errEl = document.getElementById('os-error');
  try {
    const result = await apiPost('/service-orders', payload);
    if (result.status === 201) {
      showToast('OS Criada!', `Ordem de serviço #${result.json.data?.id} criada com sucesso.`);
      closeOSModal();
      renderContent();
    } else {
      errEl.textContent = result.json.message || 'Erro ao criar OS.';
      errEl.classList.remove('hidden');
    }
  } catch (e) {
    errEl.textContent = 'Erro de comunicação com o servidor.';
    errEl.classList.remove('hidden');
  }
}

// ============================================================
//  MODAL — ATUALIZAR STATUS DA OS
// ============================================================

function openUpdateStatusModal(osId, currentStatus) {
  const statuses = ['AGUARDANDO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];
  const opts = statuses.map(s => `<option value="${s}" ${s === currentStatus ? 'selected' : ''}>${mapStatus(s)}</option>`).join('');

  document.getElementById('modal-container').innerHTML = `
    <div id="status-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden zoom-in border border-slate-200">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-slate-800">Atualizar Status — OS #${osId}</h2>
          <button onclick="document.getElementById('modal-container').innerHTML=''" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <select id="status-select" class="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm outline-none focus:border-blue-500">${opts}</select>
          <button onclick="updateOSStatus(${osId})" class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 cursor-pointer">Salvar Status</button>
        </div>
      </div>
    </div>`;
  lucide.createIcons();
}

async function updateOSStatus(osId) {
  const status = document.getElementById('status-select').value;
  const result = await apiPatch(`/service-orders/${osId}/status`, { status });
  if (result.status === 200) {
    showToast('Status Atualizado', `OS #${osId} → ${mapStatus(status)}`);
    document.getElementById('modal-container').innerHTML = '';
    renderContent();
  } else {
    showToast('Erro', result.json.message || 'Falha ao atualizar status.');
  }
}

// ============================================================
//  BUSCA DE VEÍCULOS (Oficina) — usa padrão Strategy no backend
// ============================================================

async function handleVehicleSearch(query) {
  const grid = document.getElementById('vehicles-grid');
  if (!grid) return;
  if (!query || query.length < 2) {
    const all = await apiGet('/vehicles');
    grid.innerHTML = all.map(v => vehicleCard(v)).join('') || '<p class="col-span-full text-center text-slate-400 py-8">Nenhum veículo cadastrado.</p>';
    lucide.createIcons();
    return;
  }
  try {
    const results = await apiGet(`/vehicles/search?q=${encodeURIComponent(query)}&strategy=plate`);
    grid.innerHTML = results.length
      ? results.map(v => vehicleCard(v)).join('')
      : '<p class="col-span-full text-center text-slate-400 py-8">Nenhum veículo encontrado para essa placa.</p>';
    lucide.createIcons();
  } catch (e) { showToast('Erro', 'Falha na busca.'); }
}

function vehicleCard(v) {
  return `
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
      <div class="flex items-start gap-4">
        <img src="${getCarImage(v.brand)}" class="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" />
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-slate-800 text-lg leading-tight uppercase">${v.plate}</h4>
          <p class="text-xs text-slate-500 mt-0.5">${v.brand} ${v.model} (${v.year})</p>
          <div class="mt-2 text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded inline-flex items-center gap-1.5">
            <i data-lucide="user" class="w-3 h-3 text-blue-600"></i> ${v.ownerName || 'Não informado'}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="openNewOSModal(${v.id})" class="flex-1 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold cursor-pointer">Recepção</button>
        <button onclick="showToast('Histórico', 'Carregando histórico de ${v.plate}...')" class="flex-1 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-bold cursor-pointer">Histórico</button>
      </div>
    </div>`;
}

// ============================================================
//  TOAST & MODAL GENÉRICO
// ============================================================

function showToast(title, message) {
  const container = document.getElementById('toast-container');
  const id = 'toast-' + Date.now();
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="bg-white border border-slate-200 shadow-lg rounded-xl p-4 w-72 flex gap-3 fade-in relative">
      <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
        <i data-lucide="check-circle-2" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-sm text-slate-800">${title}</h4>
        <p class="text-xs text-slate-500 mt-0.5 break-words">${message}</p>
      </div>
      <button onclick="document.getElementById('${id}').remove()" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>`);
  lucide.createIcons();
  setTimeout(() => { const el = document.getElementById(id); if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); } }, 4000);
}

function openGenericModal(title) {
  document.getElementById('modal-container').innerHTML = `
    <div id="generic-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 fade-in">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden zoom-in border border-slate-200">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-lg text-slate-800 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-600"></div> ${title}</h2>
          <button onclick="closeGenericModal()" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><i data-lucide="x" class="w-4 h-4"></i></button>
        </div>
        <div class="p-8 text-center flex flex-col items-center">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <i data-lucide="blocks" class="w-8 h-8"></i>
          </div>
          <h3 class="font-bold text-slate-800 mb-2">Em desenvolvimento</h3>
          <p class="mb-6 text-sm text-slate-500">A tela de <strong>${title}</strong> será implementada no próximo sprint.</p>
          <button onclick="closeGenericModal()" class="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl hover:bg-slate-800 cursor-pointer">Fechar</button>
        </div>
      </div>
    </div>`;
  lucide.createIcons();
}

function closeGenericModal() {
  const m = document.getElementById('generic-modal');
  if (m) { m.style.opacity = '0'; setTimeout(() => document.getElementById('modal-container').innerHTML = '', 200); }
}

// --- START ---
window.onload = init;

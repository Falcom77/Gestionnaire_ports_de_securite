// Application pfSense - Gestion complète avec localStorage

// État de l'application
let state = {
    ports: [],
    devices: [],
    categories: [],
    darkMode: true,
    activeTab: 'ports',
    sortConfig: { key: null, direction: 'asc' },
    editingPort: null,
    editingDevice: null
};

// Icons SVG
const icons = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

const categoryIcons = {
    "Gaming": "🎮",
    "VPN": "🔒",
    "Monitoring": "📊",
    "Database": "🗄️",
    "Infrastructure": "🖥️",
    "Administration": "⚙️",
    "Network": "🌐",
    "Home Automation": "🏠"
};

const categoryColors = {
    "Gaming": "linear-gradient(to right, #8b5cf6, #ec4899)",
    "VPN": "linear-gradient(to right, #3b82f6, #06b6d4)",
    "Monitoring": "linear-gradient(to right, #10b981, #059669)",
    "Database": "linear-gradient(to right, #f97316, #ea580c)",
    "Infrastructure": "linear-gradient(to right, #ef4444, #dc2626)",
    "Administration": "linear-gradient(to right, #6366f1, #8b5cf6)",
    "Network": "linear-gradient(to right, #14b8a6, #06b6d4)",
    "Home Automation": "linear-gradient(to right, #eab308, #f97316)"
};

// Initialisation
async function init() {
    try {
        // Charger depuis localStorage ou fichier data.json
        const saved = localStorage.getItem('pfSenseData');
        
        if (saved) {
            const data = JSON.parse(saved);
            state.ports = data.ports || [];
            state.devices = data.devices || [];
            state.categories = data.categories || [];
        } else {
            // Charger depuis data.json
            const response = await fetch('data.json');
            const data = await response.json();
            state.ports = data.ports || [];
            state.devices = data.devices || [];
            state.categories = data.categories || [];
            saveToLocalStorage();
        }
        
        // Charger le thème
        const savedTheme = localStorage.getItem('darkMode');
        state.darkMode = savedTheme === null ? true : savedTheme === 'true';
        
        render();
    } catch (error) {
        console.error('Erreur initialisation:', error);
        state.ports = [];
        state.devices = [];
        state.categories = ["Gaming", "VPN", "Monitoring", "Database", "Infrastructure", "Administration", "Network", "Home Automation"];
        render();
    }
}

// Sauvegarder dans localStorage
function saveToLocalStorage() {
    const data = {
        ports: state.ports,
        devices: state.devices,
        categories: state.categories
    };
    localStorage.setItem('pfSenseData', JSON.stringify(data));
}

// Toggle thème
function toggleTheme() {
    state.darkMode = !state.darkMode;
    localStorage.setItem('darkMode', state.darkMode);
    document.body.classList.toggle('light-mode', !state.darkMode);
    render();
}

// Changer onglet
function switchTab(tab) {
    state.activeTab = tab;
    render();
}

// Tri
function handleSort(key) {
    let direction = 'asc';
    if (state.sortConfig.key === key && state.sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    state.sortConfig = { key, direction };
    render();
}

function sortArray(array, key, direction) {
    if (!key) return array;
    return [...array].sort((a, b) => {
        let aVal = a[key] || '';
        let bVal = b[key] || '';
        
        if (key === 'ip_address') {
            const ipToNum = (ip) => {
                const parts = (ip || '0.0.0.0').split('/')[0].split('.');
                return parts.reduce((acc, oct, idx) => acc + (parseInt(oct) || 0) * Math.pow(256, 3 - idx), 0);
            };
            aVal = ipToNum(aVal);
            bVal = ipToNum(bVal);
        } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Toggle port actif/inactif
function togglePort(id) {
    const port = state.ports.find(p => p.id === id);
    if (port) {
        port.is_active = !port.is_active;
        saveToLocalStorage();
        render();
    }
}

// Générer ID unique
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Obtenir initiale service
function getServiceIcon(service) {
    const firstWord = service.split(' ')[0].split('-')[0];
    const mapping = {
        "SSH": "T", "RDP": "C", "VNC": "S", "Proxmox": "P",
        "Steam": "G", "OpenVPN": "V", "MySQL": "D", "Redis": "R"
    };
    return mapping[firstWord] || service.charAt(0).toUpperCase();
}

// MODALES
function showPortModal(port = null) {
    state.editingPort = port;
    const modal = document.getElementById('portModal');
    const form = document.getElementById('portForm');
    
    if (port) {
        document.getElementById('modalTitle').textContent = 'Modifier le Port';
        form.service.value = port.service || '';
        form.port_internal.value = port.port_internal || '';
        form.port_external.value = port.port_external || '';
        form.protocol.value = port.protocol || '';
        form.description.value = port.description || '';
        form.category.value = port.category || '';
        form.destination.value = port.destination || '';
        form.ip_address.value = port.ip_address || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Ajouter un Port';
        form.reset();
    }
    
    modal.classList.add('active');
}

function showDeviceModal(device = null) {
    state.editingDevice = device;
    const modal = document.getElementById('deviceModal');
    const form = document.getElementById('deviceForm');
    
    if (device) {
        document.getElementById('deviceModalTitle').textContent = 'Modifier le Périphérique';
        form.hostname.value = device.hostname || '';
        form.ip_address.value = device.ip_address || '';
        form.mac_address.value = device.mac_address || '';
        form.device_type.value = device.device_type || '';
        form.device_description.value = device.description || '';
    } else {
        document.getElementById('deviceModalTitle').textContent = 'Ajouter un Périphérique';
        form.reset();
    }
    
    modal.classList.add('active');
}

function showCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    state.editingPort = null;
    state.editingDevice = null;
}

// FORMULAIRES
function submitPortForm(e) {
    e.preventDefault();
    const form = e.target;
    
    const portData = {
        id: state.editingPort ? state.editingPort.id : generateId(),
        service: form.service.value,
        port_internal: form.port_internal.value,
        port_external: form.port_external.value,
        protocol: form.protocol.value,
        description: form.description.value,
        category: form.category.value,
        destination: form.destination.value,
        ip_address: form.ip_address.value,
        is_active: state.editingPort ? state.editingPort.is_active : true
    };
    
    if (state.editingPort) {
        const index = state.ports.findIndex(p => p.id === state.editingPort.id);
        state.ports[index] = portData;
    } else {
        state.ports.push(portData);
    }
    
    saveToLocalStorage();
    closeModal('portModal');
    render();
}

function submitDeviceForm(e) {
    e.preventDefault();
    const form = e.target;
    
    const deviceData = {
        id: state.editingDevice ? state.editingDevice.id : generateId(),
        hostname: form.hostname.value,
        ip_address: form.ip_address.value,
        mac_address: form.mac_address.value,
        device_type: form.device_type.value,
        description: form.device_description.value
    };
    
    if (state.editingDevice) {
        const index = state.devices.findIndex(d => d.id === state.editingDevice.id);
        state.devices[index] = deviceData;
    } else {
        state.devices.push(deviceData);
    }
    
    saveToLocalStorage();
    closeModal('deviceModal');
    render();
}

function submitCategoryForm(e) {
    e.preventDefault();
    const form = e.target;
    const categoryName = form.category_name.value.trim();
    
    if (categoryName && !state.categories.includes(categoryName)) {
        state.categories.push(categoryName);
        saveToLocalStorage();
        form.reset();
        closeModal('categoryModal');
        render();
    }
}

// SUPPRESSIONS
function deletePort(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce port ?')) {
        state.ports = state.ports.filter(p => p.id !== id);
        saveToLocalStorage();
        render();
    }
}

function deleteDevice(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce périphérique ?')) {
        state.devices = state.devices.filter(d => d.id !== id);
        saveToLocalStorage();
        render();
    }
}

function deleteCategory(category) {
    if (confirm(`Supprimer la catégorie "${category}" et toutes ses règles ?`)) {
        state.ports = state.ports.filter(p => p.category !== category);
        state.categories = state.categories.filter(c => c !== category);
        saveToLocalStorage();
        render();
    }
}

// EXPORTS
function exportCSV() {
    let csv = "Service,Port Interne,Port Externe,Protocole,Description,Catégorie,Destination,IP,Actif\\n";
    state.ports.forEach(p => {
        csv += `"${p.service}","${p.port_internal}","${p.port_external}","${p.protocol}","${p.description}","${p.category}","${p.destination || ''}","${p.ip_address || ''}","${p.is_active ? 'Oui' : 'Non'}"\\n`;
    });
    downloadFile(csv, 'pfsense_ports.csv', 'text/csv');
}

function exportPfSense() {
    let config = "# Configuration pfSense - Règles de Port\\n\\n";
    state.ports.filter(p => p.is_active).forEach(p => {
        config += `pass in on wan proto ${p.protocol.toLowerCase()} from any to any port ${p.port_external} → ${p.port_internal} # ${p.service}\\n`;
    });
    downloadFile(config, 'pfsense_config.txt', 'text/plain');
}

function exportDevicesCSV() {
    let csv = "Hostname,Adresse IP,Adresse MAC,Type,Description\\n";
    state.devices.forEach(d => {
        csv += `"${d.hostname}","${d.ip_address}","${d.mac_address || ''}","${d.device_type}","${d.description || ''}"\\n`;
    });
    downloadFile(csv, 'parc_informatique.csv', 'text/csv');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Auto-remplissage IP depuis destination
function onDestinationChange() {
    const select = document.getElementById('destination');
    const ipInput = document.getElementById('ip_address');
    const hostname = select.value;
    
    const device = state.devices.find(d => d.hostname === hostname);
    if (device) {
        ipInput.value = device.ip_address;
    }
}

// RENDU
function render() {
    document.body.classList.toggle('light-mode', !state.darkMode);
    renderHeader();
    renderTabs();
    renderContent();
    renderModals();
}

function renderHeader() {
    const header = document.getElementById('header');
    const isPortsTab = state.activeTab === 'ports';
    
    header.innerHTML = `
        <div class="container">
            <div class="header-content">
                <div class="header-title">
                    <h1>
                        ${icons.shield}
                        Gestionnaire de Ports pfSense
                    </h1>
                    <div>
                        <p class="subtitle">Configuration et gestion des règles - Version Fonctionnelle</p>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="btn btn-icon" onclick="toggleTheme()" title="${state.darkMode ? 'Mode clair' : 'Mode sombre'}">
                        ${state.darkMode ? icons.sun : icons.moon}
                    </button>
                    ${isPortsTab ? `
                        <button class="btn btn-orange" onclick="showCategoryModal()">
                            ${icons.folder}
                            <span>Catégorie</span>
                        </button>
                        <button class="btn btn-blue" onclick="showPortModal()">
                            ${icons.plus}
                            <span>Ajouter Port</span>
                        </button>
                        <button class="btn btn-purple" onclick="exportPfSense()">
                            ${icons.download}
                            <span>pfSense</span>
                        </button>
                    ` : ''}
                    ${!isPortsTab ? `
                        <button class="btn btn-blue" onclick="showDeviceModal()">
                            ${icons.plus}
                            <span>Ajouter Périphérique</span>
                        </button>
                    ` : ''}
                    <button class="btn btn-green" onclick="${isPortsTab ? 'exportCSV()' : 'exportDevicesCSV()'}">
                        ${icons.download}
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderTabs() {
    const tabs = document.getElementById('tabs');
    tabs.innerHTML = `
        <div class="container">
            <div class="tabs-container">
                <button class="tab ${state.activeTab === 'ports' ? 'active' : ''}" onclick="switchTab('ports')">
                    📋 Règles de Ports (${state.ports.length})
                </button>
                <button class="tab ${state.activeTab === 'devices' ? 'active' : ''}" onclick="switchTab('devices')">
                    💻 Parc Informatique (${state.devices.length})
                </button>
            </div>
        </div>
    `;
}

function renderContent() {
    const main = document.getElementById('main');
    main.innerHTML = state.activeTab === 'ports' ? renderPorts() : renderDevices();
}

function renderPorts() {
    const grouped = {};
    state.ports.forEach(port => {
        if (!grouped[port.category]) grouped[port.category] = [];
        grouped[port.category].push(port);
    });
    
    if (Object.keys(grouped).length === 0) {
        return '<div class="container"><div class="empty-state"><h3>Aucune règle de port</h3><p>Cliquez sur "Ajouter Port" pour commencer</p></div></div>';
    }
    
    return Object.keys(grouped).sort().map(category => {
        const ports = grouped[category];
        const icon = categoryIcons[category] || "📌";
        const color = categoryColors[category] || "linear-gradient(to right, #6b7280, #4b5563)";
        
        return `
            <div class="container category-section">
                <div class="category-header" style="background: ${color}">
                    <h2>
                        <span class="category-icon">${icon}</span>
                        ${category}
                        <span class="category-count">(${ports.length} règles)</span>
                    </h2>
                    <button class="btn-delete-category" onclick="deleteCategory('${category}')" title="Supprimer la catégorie">
                        ${icons.trash}
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width:75px">État</th>
                                <th style="width:60px">Icône</th>
                                <th style="width:180px">Service</th>
                                <th style="width:110px">Port Int.</th>
                                <th style="width:110px">Port Ext.</th>
                                <th style="width:90px">Proto</th>
                                <th style="width:200px">Description</th>
                                <th style="width:130px">Dest.</th>
                                <th style="width:130px">IP</th>
                                <th style="width:120px; text-align:center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ports.map(port => `
                                <tr>
                                    <td>
                                        <div class="toggle-switch ${port.is_active ? 'active' : ''}" onclick="togglePort('${port.id}')">
                                            <div class="toggle-knob"></div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="service-icon">${getServiceIcon(port.service)}</div>
                                    </td>
                                    <td>${port.service}</td>
                                    <td><span class="port-badge port-internal">${port.port_internal}</span></td>
                                    <td><span class="port-badge port-external">${port.port_external}</span></td>
                                    <td><span class="protocol-badge">${port.protocol}</span></td>
                                    <td>${port.description}</td>
                                    <td>${port.destination || '-'}</td>
                                    <td>${port.ip_address || '-'}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn-action btn-edit" onclick='showPortModal(${JSON.stringify(port).replace(/'/g, "&apos;")})' title="Modifier">
                                                ${icons.edit}
                                            </button>
                                            <button class="btn-action btn-delete" onclick="deletePort('${port.id}')" title="Supprimer">
                                                ${icons.trash}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

function renderDevices() {
    const sortedDevices = sortArray(state.devices, state.sortConfig.key, state.sortConfig.direction);
    const sortIcon = (key) => state.sortConfig.key === key ? (state.sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : '';
    
    if (sortedDevices.length === 0) {
        return '<div class="container"><div class="empty-state"><h3>Aucun périphérique</h3><p>Cliquez sur "Ajouter Périphérique" pour commencer</p></div></div>';
    }
    
    return `
        <div class="container">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width:200px" onclick="handleSort('hostname')">Hostname${sortIcon('hostname')}</th>
                            <th style="width:180px" onclick="handleSort('ip_address')">IP/Masque${sortIcon('ip_address')}</th>
                            <th style="width:160px" onclick="handleSort('mac_address')">MAC${sortIcon('mac_address')}</th>
                            <th style="width:150px" onclick="handleSort('device_type')">Type${sortIcon('device_type')}</th>
                            <th style="min-width:200px" onclick="handleSort('description')">Description${sortIcon('description')}</th>
                            <th style="width:140px; text-align:center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedDevices.map(device => `
                            <tr>
                                <td>${device.hostname}</td>
                                <td><span class="port-badge port-internal">${device.ip_address}</span></td>
                                <td>${device.mac_address || '-'}</td>
                                <td><span class="type-badge">${device.device_type}</span></td>
                                <td>${device.description || '-'}</td>
                                <td>
                                    <div class="actions">
                                        <button class="btn-action btn-edit" onclick='showDeviceModal(${JSON.stringify(device).replace(/'/g, "&apos;")})' title="Modifier">
                                            ${icons.edit}
                                        </button>
                                        <button class="btn-action btn-delete" onclick="deleteDevice('${device.id}')" title="Supprimer">
                                            ${icons.trash}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderModals() {
    // Générer options de catégories
    const categoryOptions = state.categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    
    // Générer options de destinations
    const deviceOptions = state.devices.map(dev => 
        `<option value="${dev.hostname}">${dev.hostname}</option>`
    ).join('');
    
    document.getElementById('modals').innerHTML = `
        <!-- Modal Port -->
        <div id="portModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">Ajouter un Port</h2>
                    <button class="btn-close" onclick="closeModal('portModal')">${icons.x}</button>
                </div>
                <form id="portForm" onsubmit="submitPortForm(event)">
                    <div class="form-group">
                        <label>Service/Application *</label>
                        <input type="text" name="service" required>
                    </div>
                    <div class="form-group">
                        <label>Port Interne *</label>
                        <input type="text" name="port_internal" required>
                    </div>
                    <div class="form-group">
                        <label>Port Externe *</label>
                        <input type="text" name="port_external" required>
                    </div>
                    <div class="form-group">
                        <label>Protocole *</label>
                        <select name="protocol" required>
                            <option value="">Sélectionner...</option>
                            <option value="TCP">TCP</option>
                            <option value="UDP">UDP</option>
                            <option value="TCP/UDP">TCP/UDP</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Catégorie *</label>
                        <select name="category" required>
                            <option value="">Sélectionner...</option>
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Destination (VM/PC)</label>
                        <select name="destination" id="destination" onchange="onDestinationChange()">
                            <option value="">Sélectionner...</option>
                            ${deviceOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Adresse IP</label>
                        <input type="text" name="ip_address" id="ip_address">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" onclick="closeModal('portModal')">Annuler</button>
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Modal Device -->
        <div id="deviceModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="deviceModalTitle">Ajouter un Périphérique</h2>
                    <button class="btn-close" onclick="closeModal('deviceModal')">${icons.x}</button>
                </div>
                <form id="deviceForm" onsubmit="submitDeviceForm(event)">
                    <div class="form-group">
                        <label>Hostname *</label>
                        <input type="text" name="hostname" required>
                    </div>
                    <div class="form-group">
                        <label>Adresse IP/Masque *</label>
                        <input type="text" name="ip_address" required placeholder="192.168.1.100/24">
                    </div>
                    <div class="form-group">
                        <label>Adresse MAC</label>
                        <input type="text" name="mac_address" placeholder="AA:BB:CC:DD:EE:FF">
                    </div>
                    <div class="form-group">
                        <label>Type *</label>
                        <select name="device_type" required>
                            <option value="">Sélectionner...</option>
                            <option value="PC">PC</option>
                            <option value="Serveur">Serveur</option>
                            <option value="VM">VM</option>
                            <option value="Routeur">Routeur</option>
                            <option value="Switch">Switch</option>
                            <option value="NAS">NAS</option>
                            <option value="Raspberry Pi">Raspberry Pi</option>
                            <option value="NUC">NUC</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="device_description" rows="2"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" onclick="closeModal('deviceModal')">Annuler</button>
                        <button type="submit" class="btn-submit">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Modal Category -->
        <div id="categoryModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Ajouter une Catégorie</h2>
                    <button class="btn-close" onclick="closeModal('categoryModal')">${icons.x}</button>
                </div>
                <form onsubmit="submitCategoryForm(event)">
                    <div class="form-group">
                        <label>Nom de la catégorie *</label>
                        <input type="text" name="category_name" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" onclick="closeModal('categoryModal')">Annuler</button>
                        <button type="submit" class="btn-submit">Ajouter</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Démarrage
document.addEventListener('DOMContentLoaded', init);

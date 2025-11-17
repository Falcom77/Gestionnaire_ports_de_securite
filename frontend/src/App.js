import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Gamepad2, Shield, Activity, Database, Server, 
  Settings, Wifi, Home, Plus, Edit, Trash2, 
  Download, Save, X, Moon, Sun, FolderPlus
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Category icon mapping
const categoryIcons = {
  "Gaming": Gamepad2,
  "VPN": Shield,
  "Monitoring": Activity,
  "Database": Database,
  "Infrastructure": Server,
  "Administration": Settings,
  "Network": Wifi,
  "Home Automation": Home
};

const categoryColors = {
  "Gaming": "from-purple-500 to-pink-500",
  "VPN": "from-blue-500 to-cyan-500",
  "Monitoring": "from-green-500 to-emerald-500",
  "Database": "from-orange-500 to-amber-500",
  "Infrastructure": "from-red-500 to-rose-500",
  "Administration": "from-indigo-500 to-purple-500",
  "Network": "from-teal-500 to-cyan-500",
  "Home Automation": "from-yellow-500 to-orange-500"
};

function App() {
  const [ports, setPorts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingPort, setEditingPort] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);
  const [activeTab, setActiveTab] = useState('ports'); // 'ports' or 'devices'
  const [devices, setDevices] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [newCategory, setNewCategory] = useState("");
  const [deviceFormData, setDeviceFormData] = useState({
    hostname: "",
    ip_address: "",
    mac_address: "",
    device_type: "PC",
    description: ""
  });
  const [formData, setFormData] = useState({
    service: "",
    port_internal: "",
    port_external: "",
    protocol: "TCP",
    description: "",
    category: "Gaming",
    destination: "",
    ip_address: "",
    mac_address: "",
    icon_url: "",
    is_active: true
  });

  useEffect(() => {
    fetchPorts();
    fetchCategories();
    fetchDevices();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchPorts = async () => {
    try {
      const response = await axios.get(`${API}/ports`);
      setPorts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ports:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/ports/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get(`${API}/devices`);
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const togglePortStatus = async (portId, currentStatus) => {
    try {
      await axios.put(`${API}/ports/${portId}`, { is_active: !currentStatus });
      fetchPorts();
    } catch (error) {
      console.error("Error updating port status:", error);
    }
  };

  const handleEdit = (port) => {
    setEditingPort(port);
    setFormData({
      service: port.service,
      port_internal: port.port_internal,
      port_external: port.port_external,
      protocol: port.protocol,
      description: port.description,
      category: port.category,
      destination: port.destination || "",
      ip_address: port.ip_address || "",
      mac_address: port.mac_address || "",
      icon_url: port.icon_url || "",
      is_active: port.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (portId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) {
      try {
        await axios.delete(`${API}/ports/${portId}`);
        fetchPorts();
      } catch (error) {
        console.error("Error deleting port:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPort) {
        await axios.put(`${API}/ports/${editingPort.id}`, formData);
      } else {
        await axios.post(`${API}/ports`, formData);
      }
      fetchPorts();
      closeModal();
    } catch (error) {
      console.error("Error saving port:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPort(null);
    setFormData({
      service: "",
      port_internal: "",
      port_external: "",
      protocol: "TCP",
      description: "",
      category: "Gaming",
      destination: "",
      ip_address: "",
      mac_address: "",
      icon_url: "",
      is_active: true
    });
  };

  const exportCSV = async () => {
    try {
      const response = await axios.get(`${API}/export/csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pfsense_ports.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const exportPfSense = async () => {
    try {
      const response = await axios.get(`${API}/export/pfsense`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pfsense_rules.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting pfSense config:", error);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()].sort();
      setCategories(updatedCategories);
      setFormData({...formData, category: newCategory.trim()});
      setNewCategory("");
      setShowCategoryModal(false);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" et toutes ses règles ?`)) {
      try {
        await axios.delete(`${API}/categories/${categoryName}`);
        fetchPorts();
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setDeviceFormData({
      hostname: device.hostname,
      ip_address: device.ip_address,
      mac_address: device.mac_address || "",
      device_type: device.device_type,
      description: device.description || ""
    });
    setShowDeviceModal(true);
  };

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce périphérique ?")) {
      try {
        await axios.delete(`${API}/devices/${deviceId}`);
        fetchDevices();
      } catch (error) {
        console.error("Error deleting device:", error);
      }
    }
  };

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        await axios.put(`${API}/devices/${editingDevice.id}`, deviceFormData);
      } else {
        await axios.post(`${API}/devices`, deviceFormData);
      }
      fetchDevices();
      closeDeviceModal();
    } catch (error) {
      console.error("Error saving device:", error);
    }
  };

  const closeDeviceModal = () => {
    setShowDeviceModal(false);
    setEditingDevice(null);
    setDeviceFormData({
      hostname: "",
      ip_address: "",
      mac_address: "",
      device_type: "PC",
      description: ""
    });
  };

  const exportFullCSV = async () => {
    try {
      const response = await axios.get(`${API}/export/csv-full`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pfsense_export_complet.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting full CSV:", error);
    }
  };

  const groupedPorts = ports.reduce((acc, port) => {
    if (!acc[port.category]) {
      acc[port.category] = [];
    }
    acc[port.category].push(port);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50'}`}>
        <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50'}`}>
      {/* Header */}
      <header className={`backdrop-blur-lg border-b sticky top-0 z-40 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/90 border-gray-300'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Shield className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                Gestionnaire de Ports pfSense
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configuration et gestion des règles de pare-feu</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-lg flex items-center gap-2 transition-all shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-800 hover:bg-gray-700 text-yellow-300'}`}
                data-testid="toggle-theme-button"
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {activeTab === 'ports' && (
                <>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg ${darkMode ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600'} text-white`}
                    data-testid="add-category-button"
                  >
                    <FolderPlus className="w-5 h-5" />
                    Catégorie
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                    data-testid="add-port-button"
                  >
                    <Plus className="w-5 h-5" />
                    Ajouter Port
                  </button>
                  <button
                    onClick={exportPfSense}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                    data-testid="export-pfsense-button"
                  >
                    <Download className="w-5 h-5" />
                    pfSense
                  </button>
                </>
              )}
              {activeTab === 'devices' && (
                <button
                  onClick={() => setShowDeviceModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                  data-testid="add-device-button"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter Périphérique
                </button>
              )}
              <button
                onClick={exportFullCSV}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                data-testid="export-full-button"
              >
                <Download className="w-5 h-5" />
                Export Complet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`flex gap-4 border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('ports')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'ports'
                ? `border-b-4 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
            }`}
            data-testid="tab-ports"
          >
            📋 Règles de Ports ({ports.length})
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'devices'
                ? `border-b-4 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
            }`}
            data-testid="tab-devices"
          >
            💻 Parc Informatique ({devices.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'ports' && Object.keys(groupedPorts).sort().map((category) => {
          const Icon = categoryIcons[category] || Server;
          const gradient = categoryColors[category] || "from-gray-500 to-gray-600";
          
          return (
            <div key={category} className="mb-8" data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={`bg-gradient-to-r ${gradient} rounded-lg p-4 mb-4 shadow-xl flex justify-between items-center`}>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Icon className="w-7 h-7" />
                  {category}
                  <span className="text-sm font-normal opacity-80">
                    ({groupedPorts[category].length} règles)
                  </span>
                </h2>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all shadow-lg"
                  title="Supprimer la catégorie"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className={`backdrop-blur-lg rounded-lg shadow-xl overflow-hidden border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50/90 border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{tableLayout: 'fixed', minWidth: '1600px'}}>
                    <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-100'}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '90px'}}>État</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '60px'}}>Icône</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '200px'}}>Service</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '130px'}}>Port Interne</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '130px'}}>Port Externe</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '100px'}}>Protocole</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '280px'}}>Description</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '160px'}}>Destination</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '180px'}}>IP</th>
                        <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '90px'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {groupedPorts[category].map((port, idx) => (
                        <tr 
                          key={port.id} 
                          className={`transition-colors ${
                            darkMode 
                              ? `hover:bg-gray-700/50 ${idx % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'}` 
                              : `hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`
                          }`}
                          data-testid={`port-row-${port.id}`}
                        >
                          <td className="px-4 py-3">
                            <button
                              onClick={() => togglePortStatus(port.id, port.is_active)}
                              className={`w-16 h-8 rounded-full transition-all shadow-inner ${
                                port.is_active 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                              data-testid={`toggle-status-${port.id}`}
                            >
                              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                port.is_active ? 'translate-x-9' : 'translate-x-1'
                              }`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            {port.icon_url ? (
                              <img src={port.icon_url} alt={port.service} className="w-8 h-8 rounded object-cover" onError={(e) => e.target.style.display = 'none'} />
                            ) : (
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                                {port.service.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{port.service}</td>
                          <td className="px-4 py-3">
                            <code className={`px-2 py-1 rounded ${darkMode ? 'text-blue-400 bg-gray-900/50' : 'text-blue-600 bg-blue-50'}`}>{port.port_internal}</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className={`px-2 py-1 rounded ${darkMode ? 'text-purple-400 bg-gray-900/50' : 'text-purple-600 bg-purple-50'}`}>{port.port_external}</code>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              port.protocol.includes('TCP') && port.protocol.includes('UDP')
                                ? darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                : port.protocol.includes('TCP')
                                ? darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                                : darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                            }`}>
                              {port.protocol}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{port.description}</td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{port.destination || '-'}</td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{port.ip_address || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(port)}
                                className={`p-1 rounded transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'}`}
                                data-testid={`edit-port-${port.id}`}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(port.id)}
                                className={`p-1 rounded transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-100'}`}
                                data-testid={`delete-port-${port.id}`}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className={`backdrop-blur-lg rounded-lg shadow-xl overflow-hidden border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-100'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '200px'}}>Hostname</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '180px'}}>Adresse IP/Masque</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '160px'}}>Adresse MAC</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '150px'}}>Type</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{minWidth: '200px'}}>Description</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{width: '100px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={`px-4 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Aucun périphérique enregistré. Cliquez sur "Ajouter Périphérique" pour commencer.
                      </td>
                    </tr>
                  ) : (
                    devices.map((device, idx) => (
                      <tr 
                        key={device.id} 
                        className={`transition-colors ${
                          darkMode 
                            ? `hover:bg-gray-700/50 ${idx % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'}` 
                            : `hover:bg-gray-200/50 ${idx % 2 === 0 ? 'bg-gray-100/60' : 'bg-gray-50'}`
                        }`}
                      >
                        <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {device.hostname}
                        </td>
                        <td className="px-4 py-3">
                          <code className={`px-2 py-1 rounded ${darkMode ? 'text-blue-400 bg-gray-900/50' : 'text-blue-600 bg-blue-50'}`}>
                            {device.ip_address}
                          </code>
                        </td>
                        <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {device.mac_address || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {device.device_type}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {device.description || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDevice(device)}
                              className={`p-1 rounded transition-all ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'}`}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDevice(device.id)}
                              className={`p-1 rounded transition-all ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-100'}`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Catégorie */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-2xl max-w-md w-full border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-6 h-6" />
                Nouvelle Catégorie
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nom de la catégorie
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Ex: Serveurs de jeux"
                autoFocus
                data-testid="input-new-category"
              />
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                  data-testid="confirm-add-category"
                >
                  Créer
                </button>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">
                {editingPort ? 'Modifier la règle' : 'Ajouter une règle'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                data-testid="close-modal-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Service/Application <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Ex: Grafana"
                    required
                    data-testid="input-service"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    data-testid="select-category"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Port Interne <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.port_internal}
                    onChange={(e) => setFormData({...formData, port_internal: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="8080 ou 8000-8100"
                    required
                    data-testid="input-port-internal"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Port Externe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.port_external}
                    onChange={(e) => setFormData({...formData, port_external: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="48080 ou N/A"
                    required
                    data-testid="input-port-external"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Protocole <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.protocol}
                    onChange={(e) => setFormData({...formData, protocol: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    data-testid="select-protocol"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="TCP/UDP">TCP/UDP</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Destination (Hostname)
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => {
                      const selectedHostname = e.target.value;
                      const selectedDevice = devices.find(d => d.hostname === selectedHostname);
                      setFormData({
                        ...formData, 
                        destination: selectedHostname,
                        ip_address: selectedDevice ? selectedDevice.ip_address : formData.ip_address
                      });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    data-testid="select-destination"
                  >
                    <option value="">-- Sélectionner un périphérique --</option>
                    {devices.map(device => (
                      <option key={device.id} value={device.hostname}>
                        {device.hostname} ({device.ip_address})
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    L'adresse IP sera automatiquement remplie
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Adresse IP
                  </label>
                  <input
                    type="text"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="192.168.1.100"
                    data-testid="input-ip-address"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Adresse MAC
                  </label>
                  <input
                    type="text"
                    value={formData.mac_address}
                    onChange={(e) => setFormData({...formData, mac_address: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="00:1A:2B:3C:4D:5E"
                    data-testid="input-mac-address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    URL de l'icône (optionnel)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.icon_url}
                      onChange={(e) => setFormData({...formData, icon_url: e.target.value})}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="https://example.com/icon.png"
                      data-testid="input-icon-url"
                    />
                    {formData.icon_url && (
                      <img src={formData.icon_url} alt="Preview" className="w-10 h-10 rounded border border-gray-300 object-cover" onError={(e) => e.target.style.display = 'none'} />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  rows="3"
                  placeholder="Description de la règle..."
                  required
                  data-testid="input-description"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  data-testid="checkbox-is-active"
                />
                <label htmlFor="is_active" className={`font-medium cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Activer cette règle immédiatement
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg font-semibold"
                  data-testid="save-port-button"
                >
                  <Save className="w-5 h-5" />
                  {editingPort ? 'Mettre à jour' : 'Créer la règle'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-6 py-3 rounded-lg transition-all font-medium ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                  data-testid="cancel-button"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Device */}
      {showDeviceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-2xl max-w-2xl w-full border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">
                {editingDevice ? 'Modifier le périphérique' : 'Ajouter un périphérique'}
              </h3>
              <button
                onClick={closeDeviceModal}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleDeviceSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hostname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deviceFormData.hostname}
                    onChange={(e) => setDeviceFormData({...deviceFormData, hostname: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="serveur-web-01"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type de Périphérique <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deviceFormData.device_type}
                    onChange={(e) => setDeviceFormData({...deviceFormData, device_type: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="PC">PC</option>
                    <option value="VM">VM</option>
                    <option value="Raspberry Pi">Raspberry Pi</option>
                    <option value="Tablette">Tablette</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="NUC">NUC</option>
                    <option value="Routeur">Routeur</option>
                    <option value="NAS">NAS</option>
                    <option value="Serveur">Serveur</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Adresse IP/Masque <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deviceFormData.ip_address}
                    onChange={(e) => setDeviceFormData({...deviceFormData, ip_address: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="192.168.1.100/24"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Adresse MAC
                  </label>
                  <input
                    type="text"
                    value={deviceFormData.mac_address}
                    onChange={(e) => setDeviceFormData({...deviceFormData, mac_address: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="00:1A:2B:3C:4D:5E"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={deviceFormData.description}
                  onChange={(e) => setDeviceFormData({...deviceFormData, description: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    darkMode 
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  rows="3"
                  placeholder="Serveur web principal pour l'application..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingDevice ? 'Mettre à jour' : 'Créer le périphérique'}
                </button>
                <button
                  type="button"
                  onClick={closeDeviceModal}
                  className={`px-6 py-3 rounded-lg transition-all font-medium ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

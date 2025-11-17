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
  const [editingPort, setEditingPort] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [newCategory, setNewCategory] = useState("");
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
    is_active: true
  });

  useEffect(() => {
    fetchPorts();
    fetchCategories();
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

  const groupedPorts = ports.reduce((acc, port) => {
    if (!acc[port.category]) {
      acc[port.category] = [];
    }
    acc[port.category].push(port);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-400" />
                Gestionnaire de Ports pfSense
              </h1>
              <p className="text-gray-400 mt-1">Configuration et gestion des règles de pare-feu</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                data-testid="add-port-button"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
              <button
                onClick={exportCSV}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                data-testid="export-csv-button"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={exportPfSense}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"
                data-testid="export-pfsense-button"
              >
                <Download className="w-5 h-5" />
                Export pfSense
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(groupedPorts).sort().map((category) => {
          const Icon = categoryIcons[category] || Server;
          const gradient = categoryColors[category] || "from-gray-500 to-gray-600";
          
          return (
            <div key={category} className="mb-8" data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={`bg-gradient-to-r ${gradient} rounded-lg p-4 mb-4 shadow-xl`}>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Icon className="w-7 h-7" />
                  {category}
                  <span className="text-sm font-normal opacity-80">
                    ({groupedPorts[category].length} règles)
                  </span>
                </h2>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">État</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Port Interne</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Port Externe</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Protocole</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Destination</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {groupedPorts[category].map((port, idx) => (
                        <tr 
                          key={port.id} 
                          className={`hover:bg-gray-700/50 transition-colors ${idx % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'}`}
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
                          <td className="px-4 py-3 text-white font-medium">{port.service}</td>
                          <td className="px-4 py-3">
                            <code className="text-blue-400 bg-gray-900/50 px-2 py-1 rounded">{port.port_internal}</code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-purple-400 bg-gray-900/50 px-2 py-1 rounded">{port.port_external}</code>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              port.protocol.includes('TCP') && port.protocol.includes('UDP')
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : port.protocol.includes('TCP')
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              {port.protocol}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{port.description}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{port.destination || '-'}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{port.ip_address || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(port)}
                                className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-500/10 transition-all"
                                data-testid={`edit-port-${port.id}`}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(port.id)}
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-all"
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
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex justify-between items-center">
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
                  <label className="block text-gray-300 text-sm font-medium mb-2">Service/Application</label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    data-testid="input-service"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="select-category"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Port Interne</label>
                  <input
                    type="text"
                    value={formData.port_internal}
                    onChange={(e) => setFormData({...formData, port_internal: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="8080 ou 8000-8100"
                    required
                    data-testid="input-port-internal"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Port Externe</label>
                  <input
                    type="text"
                    value={formData.port_external}
                    onChange={(e) => setFormData({...formData, port_external: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="48080 ou N/A"
                    required
                    data-testid="input-port-external"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Protocole</label>
                  <select
                    value={formData.protocol}
                    onChange={(e) => setFormData({...formData, protocol: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="select-protocol"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="TCP/UDP">TCP/UDP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Destination (VM/PC)</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VM-Ubuntu-01"
                    data-testid="input-destination"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Adresse IP</label>
                  <input
                    type="text"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.100"
                    data-testid="input-ip-address"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Adresse MAC</label>
                  <input
                    type="text"
                    value={formData.mac_address}
                    onChange={(e) => setFormData({...formData, mac_address: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="00:1A:2B:3C:4D:5E"
                    data-testid="input-mac-address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Description de la règle..."
                  required
                  data-testid="input-description"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 text-blue-500 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
                  data-testid="checkbox-is-active"
                />
                <label htmlFor="is_active" className="text-gray-300 font-medium">
                  Règle active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg font-semibold"
                  data-testid="save-port-button"
                >
                  <Save className="w-5 h-5" />
                  {editingPort ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                  data-testid="cancel-button"
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

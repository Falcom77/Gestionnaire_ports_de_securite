import { 
  Gamepad2, Shield, Activity, Database, Server, 
  Settings, Wifi, Home
} from "lucide-react";

export const categoryIcons = {
  "Gaming": Gamepad2,
  "VPN": Shield,
  "Monitoring": Activity,
  "Database": Database,
  "Infrastructure": Server,
  "Administration": Settings,
  "Network": Wifi,
  "Home Automation": Home
};

export const categoryColors = {
  "Gaming": "from-purple-500 to-pink-500",
  "VPN": "from-blue-500 to-cyan-500",
  "Monitoring": "from-green-500 to-emerald-500",
  "Database": "from-orange-500 to-amber-500",
  "Infrastructure": "from-red-500 to-rose-500",
  "Administration": "from-indigo-500 to-purple-500",
  "Network": "from-teal-500 to-cyan-500",
  "Home Automation": "from-yellow-500 to-orange-500"
};

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import io
import csv


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models for Port Management
class PortRule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service: str
    port_internal: str
    port_external: str
    protocol: str
    description: str
    category: str
    destination: str = ""
    ip_address: str = ""
    mac_address: str = ""
    icon_url: str = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PortRuleCreate(BaseModel):
    service: str
    port_internal: str
    port_external: str
    protocol: str
    description: str
    category: str
    destination: Optional[str] = ""
    ip_address: Optional[str] = ""
    mac_address: Optional[str] = ""
    icon_url: Optional[str] = ""
    is_active: Optional[bool] = True

class PortRuleUpdate(BaseModel):
    service: Optional[str] = None
    port_internal: Optional[str] = None
    port_external: Optional[str] = None
    protocol: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    destination: Optional[str] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    icon_url: Optional[str] = None
    is_active: Optional[bool] = None


# Initialize database with default data from CSV
async def init_default_ports():
    count = await db.port_rules.count_documents({})
    if count == 0:
        default_ports = [
            # Gaming
            {"service": "Steam - Client", "port_internal": "27015-27030", "port_external": "52100-52115", "protocol": "TCP/UDP", "description": "Steam gaming ports", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/753/135dc1ac1cd9763dfc8ad52f4e880d2ac058a36c.jpg", "is_active": True},
            {"service": "Steam - Client", "port_internal": "27036-27037", "port_external": "52116-52117", "protocol": "TCP", "description": "Steam client", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/753/135dc1ac1cd9763dfc8ad52f4e880d2ac058a36c.jpg", "is_active": True},
            {"service": "Steam - Client", "port_internal": "4380", "port_external": "52118", "protocol": "UDP", "description": "Steam client", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/753/135dc1ac1cd9763dfc8ad52f4e880d2ac058a36c.jpg", "is_active": True},
            {"service": "Steam - Client", "port_internal": "443", "port_external": "N/A", "protocol": "TCP", "description": "Steam HTTPS (ne pas changer)", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/753/135dc1ac1cd9763dfc8ad52f4e880d2ac058a36c.jpg", "is_active": True},
            {"service": "Satisfactory Server", "port_internal": "7777", "port_external": "48201", "protocol": "UDP", "description": "Game port principal", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg", "is_active": False},
            {"service": "Satisfactory Server", "port_internal": "15000", "port_external": "48202", "protocol": "UDP", "description": "Beacon port", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg", "is_active": False},
            {"service": "Satisfactory Server", "port_internal": "15777", "port_external": "48203", "protocol": "UDP", "description": "Query port", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg", "is_active": False},
            {"service": "Counter-Strike 1.6", "port_internal": "27015", "port_external": "46015", "protocol": "TCP/UDP", "description": "CS 1.6 game server", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/10/header.jpg", "is_active": False},
            {"service": "Unreal Tournament", "port_internal": "7777-7778", "port_external": "46777-46778", "protocol": "UDP", "description": "UT game server", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/13230/header.jpg", "is_active": False},
            {"service": "Assetto Corsa", "port_internal": "9600", "port_external": "49600", "protocol": "TCP/UDP", "description": "Assetto Corsa server", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/244210/header.jpg", "is_active": False},
            {"service": "SCUM - Game", "port_internal": "7777", "port_external": "47777", "protocol": "UDP", "description": "SCUM game port principal", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/513710/header.jpg", "is_active": False},
            {"service": "SCUM - Game", "port_internal": "7778", "port_external": "47778", "protocol": "UDP", "description": "SCUM query port", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/513710/header.jpg", "is_active": False},
            {"service": "Wreckfest", "port_internal": "27015", "port_external": "46016", "protocol": "UDP", "description": "Wreckfest server", "category": "Gaming", "icon_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/228380/header.jpg", "is_active": False},
            
            # VPN
            {"service": "VPN - OpenVPN", "port_internal": "1194", "port_external": "49100", "protocol": "UDP", "description": "OpenVPN standard", "category": "VPN", "is_active": True},
            {"service": "VPN - OCserv", "port_internal": "443", "port_external": "N/A", "protocol": "TCP", "description": "OpenVPN Connect (OCserv)", "category": "VPN", "is_active": False},
            {"service": "VPN - WireGuard", "port_internal": "51820", "port_external": "49101", "protocol": "UDP", "description": "WireGuard standard", "category": "VPN", "is_active": True},
            {"service": "VPN - IPSec", "port_internal": "500", "port_external": "N/A", "protocol": "UDP", "description": "IKE (ne pas changer)", "category": "VPN", "is_active": False},
            {"service": "VPN - IPSec", "port_internal": "4500", "port_external": "N/A", "protocol": "UDP", "description": "NAT-T (ne pas changer)", "category": "VPN", "is_active": False},
            
            # Monitoring
            {"service": "Grafana", "port_internal": "3000", "port_external": "33100", "protocol": "TCP", "description": "Interface web Grafana", "category": "Monitoring", "icon_url": "https://raw.githubusercontent.com/grafana/grafana/main/public/img/grafana_icon.svg", "is_active": True},
            {"service": "Prometheus", "port_internal": "9090", "port_external": "39090", "protocol": "TCP", "description": "Prometheus metrics & UI", "category": "Monitoring", "icon_url": "https://raw.githubusercontent.com/prometheus/prometheus/main/web/ui/static/img/prometheus_logo.svg", "is_active": True},
            {"service": "Loki", "port_internal": "3100", "port_external": "43100", "protocol": "TCP", "description": "Loki logs ingestion", "category": "Monitoring", "icon_url": "https://grafana.com/static/img/logos/logo-loki.svg", "is_active": True},
            {"service": "Tempo", "port_internal": "3200", "port_external": "43200", "protocol": "TCP", "description": "Tempo traces HTTP", "category": "Monitoring", "icon_url": "https://grafana.com/static/img/logos/logo-tempo.svg", "is_active": True},
            {"service": "Tempo - OTLP gRPC", "port_internal": "4317", "port_external": "43217", "protocol": "TCP", "description": "Tempo OTLP gRPC", "category": "Monitoring", "icon_url": "", "is_active": False},
            {"service": "Tempo - OTLP HTTP", "port_internal": "4318", "port_external": "43218", "protocol": "TCP", "description": "Tempo OTLP HTTP", "category": "Monitoring", "icon_url": "", "is_active": False},
            {"service": "Mimir - HTTP", "port_internal": "8080", "port_external": "38080", "protocol": "TCP", "description": "Mimir metrics HTTP", "category": "Monitoring", "icon_url": "https://grafana.com/static/img/logos/logo-mimir.svg", "is_active": True},
            {"service": "Mimir - gRPC", "port_internal": "9009", "port_external": "39009", "protocol": "TCP", "description": "Mimir gRPC", "category": "Monitoring", "icon_url": "", "is_active": False},
            {"service": "Alloy (Grafana)", "port_internal": "12345", "port_external": "42345", "protocol": "TCP", "description": "Grafana Alloy", "category": "Monitoring", "icon_url": "https://grafana.com/static/img/logos/logo-alloy.svg", "is_active": False},
            
            # Database
            {"service": "InfluxDB - API", "port_internal": "8086", "port_external": "33200", "protocol": "TCP", "description": "InfluxDB HTTP API", "category": "Database", "icon_url": "", "is_active": True},
            {"service": "InfluxDB - RPC", "port_internal": "8088", "port_external": "33201", "protocol": "TCP", "description": "InfluxDB RPC", "category": "Database", "icon_url": "", "is_active": False},
            {"service": "PostgreSQL", "port_internal": "5432", "port_external": "35432", "protocol": "TCP", "description": "Base de données PostgreSQL", "category": "Database", "icon_url": "", "is_active": True},
            {"service": "MySQL", "port_internal": "3306", "port_external": "33060", "protocol": "TCP", "description": "Base de données MySQL", "category": "Database", "icon_url": "", "is_active": False},
            
            # Infrastructure
            {"service": "Kubernetes - API Server", "port_internal": "6443", "port_external": "36443", "protocol": "TCP", "description": "Kubernetes API", "category": "Infrastructure", "icon_url": "https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.svg", "is_active": True},
            {"service": "Kubernetes - Kubelet", "port_internal": "10250", "port_external": "40250", "protocol": "TCP", "description": "Kubelet API", "category": "Infrastructure", "icon_url": "", "is_active": False},
            {"service": "Kubernetes - etcd", "port_internal": "2379", "port_external": "32379", "protocol": "TCP", "description": "etcd client", "category": "Infrastructure", "icon_url": "", "is_active": False},
            {"service": "Kubernetes - etcd peer", "port_internal": "2380", "port_external": "32380", "protocol": "TCP", "description": "etcd peer communication", "category": "Infrastructure", "icon_url": "", "is_active": False},
            {"service": "Kubernetes - NodePort", "port_internal": "30000-32767", "port_external": "N/A", "protocol": "TCP/UDP", "description": "Service NodePort range", "category": "Infrastructure", "icon_url": "", "is_active": False},
            {"service": "OpenTelemetry - gRPC", "port_internal": "4317", "port_external": "34317", "protocol": "TCP", "description": "OTLP gRPC receiver", "category": "Infrastructure", "icon_url": "https://opentelemetry.io/img/logos/opentelemetry-horizontal-color.svg", "is_active": True},
            {"service": "OpenTelemetry - HTTP", "port_internal": "4318", "port_external": "34318", "protocol": "TCP", "description": "OTLP HTTP receiver", "category": "Infrastructure", "icon_url": "https://opentelemetry.io/img/logos/opentelemetry-horizontal-color.svg", "is_active": True},
            
            # Administration
            {"service": "Contrôle à distance - SSH", "port_internal": "22", "port_external": "50022", "protocol": "TCP", "description": "Secure Shell", "category": "Administration", "icon_url": "", "is_active": True},
            {"service": "Contrôle à distance - RDP", "port_internal": "3389", "port_external": "53389", "protocol": "TCP", "description": "Remote Desktop Protocol", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "Contrôle à distance - VNC", "port_internal": "5900", "port_external": "55900", "protocol": "TCP", "description": "VNC standard", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "Proxmox", "port_internal": "8006", "port_external": "58006", "protocol": "TCP", "description": "Interface web Proxmox HTTPS", "category": "Administration", "icon_url": "", "is_active": True},
            {"service": "Proxmox - VNC", "port_internal": "5900-5999", "port_external": "56000-56099", "protocol": "TCP", "description": "Console VNC pour VMs", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "Proxmox - SPICE", "port_internal": "3128", "port_external": "53128", "protocol": "TCP", "description": "Console SPICE", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "Proxmox - SSH", "port_internal": "22", "port_external": "50223", "protocol": "TCP", "description": "SSH pour administration Proxmox", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - Web HTTP", "port_internal": "8080", "port_external": "58080", "protocol": "TCP", "description": "Interface web HTTP", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - Web HTTPS", "port_internal": "443", "port_external": "58443", "protocol": "TCP", "description": "Interface web HTTPS", "category": "Administration", "icon_url": "", "is_active": True},
            {"service": "QNAP - Web HTTPS Alt", "port_internal": "8081", "port_external": "58081", "protocol": "TCP", "description": "Interface web HTTPS alternative", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - Management", "port_internal": "5000", "port_external": "55000", "protocol": "TCP", "description": "QNAP Management HTTP", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - Management SSL", "port_internal": "5001", "port_external": "55001", "protocol": "TCP", "description": "QNAP Management HTTPS", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - SMB", "port_internal": "139", "port_external": "N/A", "protocol": "TCP", "description": "NetBIOS (ne pas changer)", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - SMB", "port_internal": "445", "port_external": "N/A", "protocol": "TCP", "description": "SMB/CIFS (ne pas changer)", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - AFP", "port_internal": "548", "port_external": "50548", "protocol": "TCP", "description": "Apple Filing Protocol", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - FTP", "port_internal": "21", "port_external": "50021", "protocol": "TCP", "description": "FTP", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "QNAP - FTPS", "port_internal": "990", "port_external": "50990", "protocol": "TCP", "description": "FTP over SSL", "category": "Administration", "icon_url": "", "is_active": False},
            {"service": "IMM-2 HTTPS", "port_internal": "443", "port_external": "54443", "protocol": "TCP", "description": "IBM Integrated Management Module", "category": "Administration", "icon_url": "", "is_active": False},
            
            # VPN
            {"service": "VPN - OpenVPN", "port_internal": "1194", "port_external": "49100", "protocol": "UDP", "description": "OpenVPN standard", "category": "VPN", "icon_url": "", "is_active": True},
            {"service": "VPN - OCserv", "port_internal": "443", "port_external": "N/A", "protocol": "TCP", "description": "OpenVPN Connect (OCserv)", "category": "VPN", "icon_url": "", "is_active": False},
            {"service": "VPN - WireGuard", "port_internal": "51820", "port_external": "49101", "protocol": "UDP", "description": "WireGuard standard", "category": "VPN", "icon_url": "", "is_active": True},
            {"service": "VPN - IPSec", "port_internal": "500", "port_external": "N/A", "protocol": "UDP", "description": "IKE (ne pas changer)", "category": "VPN", "icon_url": "", "is_active": False},
            {"service": "VPN - IPSec NAT-T", "port_internal": "4500", "port_external": "N/A", "protocol": "UDP", "description": "NAT-T (ne pas changer)", "category": "VPN", "icon_url": "", "is_active": False},
            {"service": "VPN - L2TP", "port_internal": "1701", "port_external": "49102", "protocol": "UDP/TCP", "description": "L2TP", "category": "VPN", "icon_url": "", "is_active": False},
            {"service": "VPN - PPTP", "port_internal": "1723", "port_external": "49103", "protocol": "TCP", "description": "PPTP (non recommandé)", "category": "VPN", "icon_url": "", "is_active": False},
            
            # Network
            {"service": "Wake on LAN", "port_internal": "7", "port_external": "N/A", "protocol": "UDP", "description": "WOL Magic Packet (alternative)", "category": "Network", "icon_url": "", "is_active": False},
            {"service": "Wake on LAN", "port_internal": "9", "port_external": "N/A", "protocol": "UDP", "description": "WOL Magic Packet (standard)", "category": "Network", "icon_url": "", "is_active": True},
            
            # Home Automation
            {"service": "Home Assistant", "port_internal": "8123", "port_external": "48123", "protocol": "TCP", "description": "Interface web Home Assistant", "category": "Home Automation", "icon_url": "", "is_active": True},
            {"service": "Home Assistant - Secure", "port_internal": "8443", "port_external": "48443", "protocol": "TCP", "description": "HTTPS pour Home Assistant (optionnel)", "category": "Home Automation", "icon_url": "", "is_active": False},
        ]
        
        for port_data in default_ports:
            port_obj = PortRule(**port_data)
            doc = port_obj.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.port_rules.insert_one(doc)


# API Routes
@api_router.get("/")
async def root():
    return {"message": "pfSense Port Manager API"}

@api_router.get("/ports", response_model=List[PortRule])
async def get_ports(category: Optional[str] = None):
    """Get all port rules, optionally filtered by category"""
    query = {}
    if category:
        query["category"] = category
    
    ports = await db.port_rules.find(query, {"_id": 0}).to_list(1000)
    
    for port in ports:
        if isinstance(port.get('created_at'), str):
            port['created_at'] = datetime.fromisoformat(port['created_at'])
    
    return ports

@api_router.get("/ports/categories")
async def get_categories():
    """Get all unique categories"""
    categories = await db.port_rules.distinct("category")
    return {"categories": sorted(categories)}

@api_router.post("/ports", response_model=PortRule)
async def create_port(port: PortRuleCreate):
    """Create a new port rule"""
    port_obj = PortRule(**port.model_dump())
    doc = port_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.port_rules.insert_one(doc)
    return port_obj

@api_router.put("/ports/{port_id}", response_model=PortRule)
async def update_port(port_id: str, port_update: PortRuleUpdate):
    """Update an existing port rule"""
    existing_port = await db.port_rules.find_one({"id": port_id}, {"_id": 0})
    if not existing_port:
        raise HTTPException(status_code=404, detail="Port rule not found")
    
    update_data = {k: v for k, v in port_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.port_rules.update_one({"id": port_id}, {"$set": update_data})
    
    updated_port = await db.port_rules.find_one({"id": port_id}, {"_id": 0})
    if isinstance(updated_port.get('created_at'), str):
        updated_port['created_at'] = datetime.fromisoformat(updated_port['created_at'])
    
    return PortRule(**updated_port)

@api_router.delete("/ports/{port_id}")
async def delete_port(port_id: str):
    """Delete a port rule"""
    result = await db.port_rules.delete_one({"id": port_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Port rule not found")
    return {"message": "Port rule deleted successfully"}

@api_router.get("/export/csv")
async def export_csv():
    """Export all port rules to CSV"""
    ports = await db.port_rules.find({}, {"_id": 0}).to_list(1000)
    
    output = io.StringIO()
    writer = csv.writer(output, delimiter=';')
    
    # Write header
    writer.writerow([
        "Service/Application", "Port(s) Interne", "Port(s) Externe", 
        "Protocole", "Description", "Destination (VM/PC)", 
        "Adresse IP", "Adresse MAC", "Actif"
    ])
    
    # Write data
    for port in ports:
        writer.writerow([
            port.get('service', ''),
            port.get('port_internal', ''),
            port.get('port_external', ''),
            port.get('protocol', ''),
            port.get('description', ''),
            port.get('destination', ''),
            port.get('ip_address', ''),
            port.get('mac_address', ''),
            'Oui' if port.get('is_active') else 'Non'
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=pfsense_ports.csv"}
    )

@api_router.get("/export/pfsense")
async def export_pfsense():
    """Export active port rules in pfSense-compatible format"""
    ports = await db.port_rules.find({"is_active": True}, {"_id": 0}).to_list(1000)
    
    output = io.StringIO()
    output.write("# pfSense Port Forwarding Rules\n")
    output.write("# Generated on: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
    
    for port in ports:
        output.write(f"# {port.get('service', 'Unknown')}\n")
        output.write(f"# Description: {port.get('description', '')}\n")
        output.write(f"Protocol: {port.get('protocol', '')}\n")
        output.write(f"External Port: {port.get('port_external', '')}\n")
        output.write(f"Internal IP: {port.get('ip_address', 'TO_BE_CONFIGURED')}\n")
        output.write(f"Internal Port: {port.get('port_internal', '')}\n")
        output.write(f"Destination: {port.get('destination', 'TO_BE_CONFIGURED')}\n")
        output.write("\n---\n\n")
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/plain",
        headers={"Content-Disposition": "attachment; filename=pfsense_rules.txt"}
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_default_ports()
    logger.info("Database initialized with default ports")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
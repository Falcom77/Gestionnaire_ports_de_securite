#!/usr/bin/env python3
"""
Script pour réinitialiser la base de données avec tous les services
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv('/app/backend/.env')

async def reset_database():
    """Supprime toutes les données et les réinitialise"""
    
    # Connexion MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🔄 Suppression des anciennes données...")
    result = await db.port_rules.delete_many({})
    print(f"✅ {result.deleted_count} règles supprimées")
    
    print("📝 Réinitialisation terminée!")
    print("🚀 Redémarrez le backend pour charger les nouvelles données:")
    print("   sudo supervisorctl restart backend")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(reset_database())

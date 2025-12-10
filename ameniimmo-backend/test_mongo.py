#!/usr/bin/env python
"""Script de test de connexion MongoDB"""
import os
import certifi
from pymongo import MongoClient
from decouple import config

# Charger l'URI depuis .env
MONGODB_URI = config('MONGODB_URI')
MONGODB_DB_NAME = config('MONGODB_DB_NAME', default='ameniimmo_db')

print("Tentative de connexion à MongoDB...")
print(f"Base de données: {MONGODB_DB_NAME}")

try:
    # Créer le client MongoDB - désactiver TOUT SSL pour test
    import ssl as ssl_module
    client = MongoClient(
        MONGODB_URI,
        ssl=True,
        ssl_cert_reqs=ssl_module.CERT_NONE,
        authMechanism='SCRAM-SHA-1'
    )
    
    # Tester la connexion
    client.admin.command('ping')
    print("✅ Connexion réussie à MongoDB Atlas!")
    
    # Lister les bases de données
    print("\n📂 Bases de données disponibles:")
    for db_name in client.list_database_names():
        print(f"  - {db_name}")
    
    # Accéder à la base de données
    db = client[MONGODB_DB_NAME]
    print(f"\n📊 Collections dans '{MONGODB_DB_NAME}':")
    collections = db.list_collection_names()
    if collections:
        for coll in collections:
            print(f"  - {coll}")
    else:
        print("  (aucune collection)")
    
    client.close()
    
except Exception as e:
    print(f"❌ Erreur de connexion: {e}")
    import traceback
    traceback.print_exc()

"""
Patch pour résoudre le problème SSL/TLS avec Python 3.11 et MongoDB Atlas
À importer AVANT tout code Django/pymongo
"""
import ssl
import certifi

# Fix pour Python 3.11 + OpenSSL 3.0 + Windows
ssl._create_default_https_context = ssl._create_unverified_context

print("✅ Patch SSL appliqué pour MongoDB Atlas")

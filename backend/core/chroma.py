import chromadb

# Singleton ChromaDB client
chroma_client = chromadb.Client()

def get_collection(name: str):
    return chroma_client.get_or_create_collection(name) 
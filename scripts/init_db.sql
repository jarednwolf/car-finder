-- Initialize database with pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create index method for vector similarity search
CREATE INDEX IF NOT EXISTS idx_listing_embedding_ivfflat 
ON listings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_preference_embedding_ivfflat 
ON preferences USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 50); 
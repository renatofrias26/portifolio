-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume data table
CREATE TABLE IF NOT EXISTS resume_data (
  id SERIAL PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resume_published ON resume_data(is_published);
CREATE INDEX IF NOT EXISTS idx_resume_archived ON resume_data(is_archived);
CREATE INDEX IF NOT EXISTS idx_resume_version ON resume_data(version DESC);

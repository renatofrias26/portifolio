-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL, -- Public username for portfolio URL
  profile_data JSONB, -- Store additional profile info (bio, social links, etc.)
  logo_url TEXT, -- User's logo/brand image
  profile_image_url TEXT, -- User's profile/headshot image
  theme_settings JSONB DEFAULT '{"primaryColor": "#3b82f6", "accentColor": "#8b5cf6"}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume data table - now tied to specific users
CREATE TABLE IF NOT EXISTS resume_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, version) -- Each user has their own version numbering
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_resume_user_id ON resume_data(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_user_published ON resume_data(user_id, is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_resume_user_archived ON resume_data(user_id, is_archived);
CREATE INDEX IF NOT EXISTS idx_resume_user_version ON resume_data(user_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

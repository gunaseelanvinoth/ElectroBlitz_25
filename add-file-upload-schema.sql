-- Add file upload columns to registrations table
-- This script adds file upload functionality for workshops

-- Add columns for file upload
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS uploaded_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_file_type VARCHAR(100);

-- Create index for file queries
CREATE INDEX IF NOT EXISTS idx_registrations_uploaded_file ON registrations(uploaded_file_name);

-- Update the table comment
COMMENT ON COLUMN registrations.uploaded_file_name IS 'Name of the uploaded file';
COMMENT ON COLUMN registrations.uploaded_file_url IS 'URL/path to the uploaded file';
COMMENT ON COLUMN registrations.uploaded_file_size IS 'Size of the uploaded file in bytes';
COMMENT ON COLUMN registrations.uploaded_file_type IS 'MIME type of the uploaded file';

-- Migration: Add Suspended Column to Profiles
-- This migration adds a 'suspended' column to the profiles table to enable user suspension functionality

-- Add suspended column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;

-- Add index for suspended users lookup
CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(suspended);

-- Add comment for documentation
COMMENT ON COLUMN profiles.suspended IS 'Flag indicating if the user account has been suspended by an admin';

-- Migration to add coordinates to requests table for Supabase
-- Run this in your Supabase SQL editor

-- Add latitude and longitude columns to requests table
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create a simple distance calculation function using Haversine formula
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 DECIMAL, lon1 DECIMAL, 
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Convert degrees to radians
  dlat := RADIANS(lat2 - lat1);
  dlon := RADIANS(lon2 - lon1);
  
  -- Haversine formula
  a := SIN(dlat/2) * SIN(dlat/2) + 
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
       SIN(dlon/2) * SIN(dlon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  
  RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Create an index on coordinates for better performance
CREATE INDEX IF NOT EXISTS idx_requests_coordinates 
ON public.requests (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update existing requests with sample coordinates (optional)
-- This will add sample coordinates for existing requests if they don't have any
UPDATE public.requests 
SET 
  latitude = 37.7749 + (RANDOM() - 0.5) * 0.1,
  longitude = -122.4194 + (RANDOM() - 0.5) * 0.1
WHERE latitude IS NULL OR longitude IS NULL;

-- Create a function to find nearby requests
CREATE OR REPLACE FUNCTION get_nearby_requests(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 50
) RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  status TEXT,
  created_at TIMESTAMPTZ,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.description,
    r.location,
    r.latitude,
    r.longitude,
    r.status,
    r.created_at,
    calculate_distance_km(user_lat, user_lon, r.latitude, r.longitude) as distance_km
  FROM public.requests r
  WHERE r.latitude IS NOT NULL 
    AND r.longitude IS NOT NULL
    AND r.status = 'open'
    AND calculate_distance_km(user_lat, user_lon, r.latitude, r.longitude) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

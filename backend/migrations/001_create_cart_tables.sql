-- Migration: Add Cart Tables
-- This creates the carts and cart_items tables for backend cart storage

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create cart_items table (junction between carts and products)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_snapshot DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Enable RLS
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for carts table
-- Users can only see their own cart
CREATE POLICY "Users can view their own cart" 
ON carts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own cart
CREATE POLICY "Users can create their own cart" 
ON carts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cart_items table (inherits from carts via foreign key)
-- Users can only modify items in their own cart
CREATE POLICY "Users can view cart items" 
ON cart_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM carts 
    WHERE carts.id = cart_items.cart_id 
    AND carts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add items to their own cart" 
ON cart_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM carts 
    WHERE carts.id = cart_items.cart_id 
    AND carts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update items in their own cart" 
ON cart_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM carts 
    WHERE carts.id = cart_items.cart_id 
    AND carts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete items from their own cart" 
ON cart_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM carts 
    WHERE carts.id = cart_items.cart_id 
    AND carts.user_id = auth.uid()
  )
);

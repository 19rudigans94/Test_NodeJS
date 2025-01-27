/*
  # Initial E-commerce Schema

  1. Tables
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - stock (integer)
      - image_url (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - categories
      - id (uuid, primary key)
      - name (text)
      - slug (text)
      
    - product_categories
      - product_id (uuid, foreign key)
      - category_id (uuid, foreign key)
    
    - orders
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - status (text)
      - total (numeric)
      - created_at (timestamptz)
      
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key)
      - product_id (uuid, foreign key)
      - quantity (integer)
      - price (numeric)
    
    - profiles
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - role (text)
      - full_name (text)
      - address (text)
      - phone (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Public read access to products and categories
      - Admin-only write access to products and categories
      - User-specific access to orders and profiles
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

-- Create product_categories junction table
CREATE TABLE product_categories (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10,2) NOT NULL CHECK (price >= 0)
);

-- Create profiles table with role management
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name text,
  address text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Products policies
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access to products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Categories policies (similar to products)
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access to categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Product categories policies
CREATE POLICY "Allow public read access to product_categories"
  ON product_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access to product_categories"
  ON product_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      CASE WHEN role = 'admin' THEN
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.user_id = auth.uid()
          AND profiles.role = 'admin'
        )
      ELSE
        role = 'customer'
      END
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (new.id, 'customer', new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
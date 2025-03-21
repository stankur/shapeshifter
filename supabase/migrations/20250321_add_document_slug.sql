-- Add slug and user_id columns to documents table
ALTER TABLE documents
ADD COLUMN slug TEXT,
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add unique constraint on user_id + slug
ALTER TABLE documents
ADD CONSTRAINT unique_user_slug UNIQUE (user_id, slug);

-- Drop existing permissive policies
DROP POLICY IF EXISTS "all can read documents" ON "public"."documents";
DROP POLICY IF EXISTS "allow all insertion" ON "public"."documents";
DROP POLICY IF EXISTS "allow all update" ON "public"."documents";

-- Create new policies
-- Keep reading public but restrict modifications to owners
CREATE POLICY "all can read documents"
ON "public"."documents"
FOR SELECT
TO public
USING (true);

CREATE POLICY "owners can insert documents"
ON "public"."documents"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owners can update documents"
ON "public"."documents"
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owners can delete documents"
ON "public"."documents"
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

sup motherfuckers hahaha

I am trying to make hard information elegant, beautiful, and understandable. I know it's been years since I initially said that, but I'd rather suffer for long for something jaw-dropping than create something basic u know. I can tolerate isolation, but I can't tolerate mediocrity.

In this iteration, the document is represented as a tree with nodes, similar to how HTML represent documents. And then I attach renderers to each type of node as plugins.

There is also an animation engine that takes care of making switching between views intuitive.

## Supabase Setup

This project uses Supabase for document storage. To set up Supabase:

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one already
2. Create a new Supabase project
3. In the SQL Editor, create a new table for documents (if not already created):

```sql
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create an index for faster queries
CREATE INDEX documents_updated_at_idx ON documents (updated_at DESC);
```

4. Copy your Supabase URL and anon key from the project settings
5. Create a `.env` file based on the `.env.example` template and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

After setting up Supabase, you can use the "Publish" button to save your documents to the database.

## Getting the database ts definition

```
npx supabase gen types typescript --project-id "<PROJECT ID>" --schema public > src/lib/types/supabase.ts
```

## Running migration if database schema is changed

most updated version should be able to be found here: 
- https://supabase.com/docs/guides/local-development/overview#link-your-project



```
supabase db push
```


## known bugs

When the paragraph editor is about to get destroyed, somehow the node is undefined, and this causes the app to crash. A temporary fix is to check whether the node is defined, and only do the destroy if it is, but this is of course hacky. A proper way would be to understand why the node is undefined at the time of destroy.


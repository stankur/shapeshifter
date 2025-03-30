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

when you press enter on the end of a heading, it should transfer the cursor to what is next in the section, but it doesn't. The next in section does get created, either summary of paragraph child, but the cursor doesn't move.

authentication is rather messy, and somewhat working, but logic is somewhat strange due to initially created with Cline.

There are duplicated logic across the slug specific editor and the default editor just located at the base URL.

pressing tab on a heading should not work when the parent's heading is one level below. This is because we have a constraint where a direct child should not be more than 1 level higher than their parent. But somehow it works when I was in the sidebar view, and I pressed tab on the headings there.

In sidebar view, if you consider the active section being rendered, there are two consecutive appearances of  a heading. However if you update one, the other does not get updated.

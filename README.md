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

there is a bug where when you have a document whise current structure is H1 (A), H1 (B), H1 (C), and then you increase the level by using tab for H1 (B), it turns to H1 (A), H2 (B), H2 (B). This wrong. However, the document state seems to be updated correctly. So my guess would be this is an issue with not trigerring svelte's reactivity, rather than purely logic issue.

There is an issue where if you are in the editor mode, and you go from read to customize view, the summary/expand toggles that show up are not at the right place. It seems like only one is showing at the top left.

When you press backspace at the start of a paragraph, cursor is just gone, not transfered. Should be transferred to previous paragraph, and the point where the two paragraphs are joined.

There is a bit of jump in the summary when you go from card, and you click a heading, to default section container view, or vice versa. This issue only shows up when the card is in the third hierarchy level, and beyond, strangely enough.

The editor, on press of heading, doesn't always create a content paragraph. I am not fully sure if it's the reason, but I encountered this when in the customize mode, the view was card. But I tried to make sure that it wasn't because the section was in summary mode that it failed. One followup could be testing if we could add parargaphs when the view of the section container is card.


when the bricks is rendered as active section in a sidebar, not expected because it doesn't wrap. i think this is because I am using screen as breakpoint. Maybe should instead use min-width or something attached to the component instead of the screen size.

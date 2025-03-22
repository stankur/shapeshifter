# System Patterns

## Architecture Overview

### Tech Stack
- **Frontend Framework**: SvelteKit
- **Language**: TypeScript
- **Database/Backend**: Supabase
- **Editor Core**: ProseMirror
- **Styling**: Tailwind CSS

## Key Design Patterns

### MVC-like Structure
```
src/
├── lib/
│   ├── model/      # Data models and business logic
│   ├── view/       # UI components and layouts
│   ├── services/   # Core services (e.g., ProseMirror)
│   └── actions/    # Svelte actions for DOM interactions
```

### Component Organization
1. **Collection Pattern**
   - Section containers for different view types
   - Modular controls for each section type
   - Hierarchical structure for nested content

2. **Document Structure**
   - ProseMirror-based editor core
   - Custom content types (Heading, Paragraph)
   - Extensible view registry
   - Title and slug management
   ```mermaid
   flowchart TD
       Title[Document Title] --> Slug[URL Slug]
       Slug --> Unique[Unique per User]
       Title --> UI[TitleInput Component]
       UI --> Save[Save Document]
       Save --> DB[Database]
   ```

### Data Flow
```mermaid
flowchart TD
    User[User Input] --> Editor[Editor Core]
    Editor --> Transform[Content Transform]
    Transform --> Model[Document Model]
    Model --> View[View Layer]
    Model --> DB[Supabase DB]
```

## Core Components

### Editor System
- ProseMirror integration for rich text editing
- Custom extensions for idea transformation
- View registry for component mapping

### Content Organization
- Section-based content structure
- Multiple view types (Card, Table of Contents, Tabs)
- Hierarchical document model

### UI Components
1. **Section Containers**
   - Card view
   - Table of Contents
   - Tabs interface
   - Default layout

2. **Controls**
   - Section-specific controls
   - Collapse/Expand functionality
   - Content transformation tools

## State Management
- Document model for state representation
- Direct model-view updates
- Supabase real-time updates

## Extension Points
1. **View Types**
   - New section containers
   - Custom controls
   - Content transformations

2. **Content Types**
   - Custom content blocks
   - Specialized formatters
   - Transform plugins

## Security Patterns
- Supabase authentication
- Row-level security
- Content permissions
- Unique document constraints per user

## Document Identification
1. **Title System**
   - User-friendly document titles
   - Automatic slug generation
   - Unique per user constraint
   - Real-time title updates

2. **URL Structure**
   - Username-based paths (e.g., /username/document-slug)
   - Slug-based document identification
   - Human-readable URLs
   - Unique document URLs per user

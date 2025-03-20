# Technical Context

## Development Environment

### Core Technologies
- **Package Manager**: pnpm
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Database**: Supabase
- **Editor Engine**: ProseMirror
- **Styling**: Tailwind CSS

### Key Dependencies
- ProseMirror for rich text editing
- Supabase client for database operations
- TypeScript for type safety
- Tailwind for utility-first styling

## Project Structure

### Key Directories
```
src/
├── lib/              # Library code
│   ├── actions/      # Svelte actions
│   ├── model/        # Data models
│   ├── services/     # Core services
│   ├── types/        # TypeScript types
│   └── view/         # UI components
├── routes/           # SvelteKit routes
└── app.html          # App template
```

## Technical Constraints

### Browser Support
- Modern browsers with ES6+ support
- WebSocket support for real-time updates
- Local storage for draft persistence

### Performance Requirements
- Fast editor response time
- Smooth real-time updates
- Efficient DOM updates
- Responsive UI across devices

### Security Considerations
- Supabase authentication
- Content access control
- Data validation
- Secure API endpoints

## Development Workflow

### Setup Requirements
1. Node.js environment
2. pnpm package manager
3. Supabase project configuration
4. Environment variables setup

### Environment Variables
Required in `.env`:
- Supabase URL
- Supabase API key
- Other configuration settings

### Build Process
- TypeScript compilation
- SvelteKit bundling
- Tailwind CSS processing

## Integration Points

### Supabase Integration
- Real-time subscriptions
- Document storage
- User authentication
- Row level security

### ProseMirror Integration
- Custom extensions
- Document schema
- Transform steps
- View decorations

## Testing & Quality

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Type checking

### Performance Metrics
- Editor response time
- Save/load operations
- Real-time sync latency
- UI render performance


# DrawBoard - Collaborative Drawing Platform

A modern, collaborative drawing platform built with React, TypeScript, Tldraw, and Supabase. Create, collaborate, and share your drawings in real-time.

## Features

- 🎨 **Advanced Drawing Tools** - Professional drawing capabilities powered by Tldraw
- 👥 **Real-time Collaboration** - Work together with others in real-time
- ☁️ **Cloud Storage** - Automatic saving and synchronization across devices
- 🔐 **User Authentication** - Secure user accounts and document ownership
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🚀 **Fast & Modern** - Built with the latest web technologies

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Drawing Engine**: Tldraw v3
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **Deployment**: Render (Frontend) + Supabase (Backend)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd drawboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `src/integrations/supabase/client.ts` with your credentials

4. **Set up the database**
   - In your Supabase dashboard, go to the SQL editor
   - Run the SQL from `schema.sql` file

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## Deployment

### Deploy to Render (Free)

1. **Frontend Deployment**
   - Fork this repository to your GitHub account
   - Create a new Static Site on Render
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   - No environment variables needed (credentials are in the code for simplicity)

3. **Custom Domain** (Optional)
   - Add your custom domain in Render dashboard
   - Update Supabase Auth settings with your domain

### Self-Hosting

For self-hosting, you can use:

1. **Supabase Self-Hosted** - Follow [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting)
2. **Any Static Host** - Deploy the built files to any static hosting service
3. **Docker** - Build a Docker image for containerized deployment

## Configuration

### Supabase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Configure redirect URLs in Auth settings
   - Optional: Enable social providers (Google, GitHub, etc.)

2. **Database**
   - Run the provided `schema.sql` file
   - Enable Row Level Security (RLS)
   - Set up realtime subscriptions

3. **Storage**
   - Create `documents` bucket
   - Configure storage policies

### Environment Variables

For production deployments, you may want to use environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features in Detail

### Real-time Collaboration
- Multiple users can draw on the same canvas simultaneously
- Changes are synchronized in real-time using Supabase Realtime
- Conflict resolution ensures smooth collaboration

### Document Management
- Create, save, and organize drawings
- Share documents with other users
- Version history and auto-save functionality

### Advanced Drawing Tools
- Shape tools (rectangle, circle, line, arrow, etc.)
- Text editing with rich formatting
- Layer management and grouping
- Export to various formats (PNG, SVG, JSON)

### User Management
- Secure authentication with Supabase Auth
- User profiles and preferences
- Document ownership and permissions

## Free Tier Limits

This application is designed to work within free tier limits:

- **Supabase**: 500MB database, 1GB bandwidth, 2 realtime connections
- **Render**: 750 hours/month static site hosting
- **Total Cost**: $0/month for small to medium usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Open a GitHub issue
- Check the [Supabase documentation](https://supabase.com/docs)
- Check the [Tldraw documentation](https://tldraw.dev/docs)

## Roadmap

- [ ] Export/Import functionality
- [ ] Advanced collaboration features
- [ ] Mobile app
- [ ] Plugin system
- [ ] Advanced shape libraries
- [ ] Team workspaces

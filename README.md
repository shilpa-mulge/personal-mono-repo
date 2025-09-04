# Contentful Dynamic Component System

This monorepo demonstrates a powerful dynamic component system integrated with Contentful CMS, featuring a content editor app for creating configurable components and a web application that renders them dynamically.

## Architecture

### Apps
- **Editor App** (`apps/editor/`) - React + Vite app with dual-mode editor:
  - Content Editor: Traditional blog posts and pages
  - **Dynamic Component Editor**: Visual component builder with type-based field rendering
- **Web App** (`apps/web/`) - Next.js app that dynamically renders components based on Contentful configurations

### Packages
- **UI** (`packages/ui/`) - Shared React component library
- **Contentful Types** (`packages/contentful-types/`) - Shared TypeScript types and utilities for Contentful
- **Tailwind Config** (`packages/tailwind-config/`) - Shared Tailwind CSS configuration
- **Behaviors** (`packages/behaviors/`) - Behavior system for UI components

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Contentful Setup

#### Create a Contentful Space
1. Sign up for a [Contentful account](https://www.contentful.com/)
2. Create a new space
3. Get your Space ID and API tokens

#### Content Models
Create the following content models in your Contentful space:

**⭐ Configurations** (ID: `configurations`) - **Primary Model for Dynamic Components**
- **Type** (Long text, required) - Component type (Card, Hero, Banner, etc.)
- **Data** (JSON object, required) - Component configuration data

**Blog Post** (ID: `blogPost`) - Optional for blog functionality
- Title (Short text, required)
- Slug (Short text, required, unique)
- Excerpt (Long text)
- Content (Rich text, required)
- Featured Image (Media)
- Author (Reference to Author)
- Publish Date (Date & time, required)
- Tags (Short text, list)
- SEO (Reference to SEO)

**Author** (ID: `author`) - Optional
- Name (Short text, required)
- Bio (Rich text)
- Avatar (Media)
- Email (Short text)
- Social Links (JSON object)

**Page** (ID: `page`) - Optional
- Title (Short text, required)
- Slug (Short text, required, unique)
- Content (Rich text, required)
- SEO (Reference to SEO)
- Components (Reference to Configurations, list)

**SEO** (ID: `seo`) - Optional
- Title (Short text)
- Description (Long text)
- Keywords (Short text, list)
- OG Image (Media)
- No Index (Boolean)

### 3. Environment Variables

#### Editor App
Copy `apps/editor/.env.example` to `apps/editor/.env.local`:
```bash
cp apps/editor/.env.example apps/editor/.env.local
```

Fill in your Contentful credentials:
```env
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token_here
VITE_CONTENTFUL_MANAGEMENT_TOKEN=your_management_api_token_here
VITE_CONTENTFUL_ENVIRONMENT=master
```

#### Web App
Copy `apps/web/.env.example` to `apps/web/.env.local`:
```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in your Contentful credentials:
```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token_here
CONTENTFUL_ENVIRONMENT=master
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Development

Start both applications in development mode:
```bash
pnpm dev
```

This will start:
- Editor app at http://localhost:5173
- Web app at http://localhost:3000

Or run them individually:
```bash
# Editor app only
pnpm --filter editor dev

# Web app only
pnpm --filter web dev
```

## Usage

### Content Editor App
1. Navigate to http://localhost:5173
2. **Component Editor Mode** (Default):
   - Select component type (Card, Hero, Banner, Testimonial, etc.)
   - Configure component-specific fields dynamically
   - Preview JSON configuration
   - Save to Contentful as "Configurations"
3. **Content Editor Mode**:
   - Create traditional blog posts and pages
   - Rich text editing and media management

### Web App
1. Navigate to http://localhost:3000 - Blog and content homepage
2. Navigate to http://localhost:3000/components - **Dynamic Component Showcase**
3. Components are fetched from Contentful and rendered dynamically based on their type and configuration

## Features

### Editor App Features
- ✅ **Dynamic Component Editor** with type-based field rendering
- ✅ **Dual-mode interface** (Component Editor / Content Editor)
- ✅ **Real-time JSON preview** of component configurations
- ✅ **Component Types Supported**:
  - 🎴 **Card**: Heading, description, image, button
  - 🦸 **Hero**: Title, subtitle, background image, CTA
  - 📢 **Banner**: Message, type (info/warning/success/error), dismissible
  - 💬 **Testimonial**: Quote, author, position, company, avatar
  - 📞 **Call to Action**: Title, description, primary/secondary buttons, background
  - 📝 **Text Block**: Rich content with alignment options
  - 🖼️ **Image Gallery**: Multiple images with layout options
- ✅ Content creation form for blog posts
- ✅ Slug auto-generation

### Web App Features
- ✅ **Dynamic Component Rendering** based on Contentful configurations
- ✅ **Component Showcase Page** (/components)
- ✅ **Type-based Component Rendering**:
  - Automatic component selection based on `type` field
  - Dynamic styling and layout per component type
  - Responsive design for all component types
- ✅ Blog post listing and rendering
- ✅ Rich text rendering with @contentful/rich-text-react-renderer
- ✅ Image optimization with dynamic URLs
- ✅ Error handling and fallback states

## Content Types

The system supports the following content types:

- **Blog Posts** - Articles and blog content
- **Pages** - Static pages like About, Contact
- **Authors** - Author profiles and information
- **SEO** - SEO metadata for content
- **Site Settings** - Global site configuration

## API Integration

### Delivery API (Web App)
- Fetches published content
- Supports preview mode
- Optimized for performance

### Management API (Editor App)
- Creates and updates content
- Manages drafts and publishing
- Full CRUD operations

## Build and Deploy

### Build all apps
```bash
pnpm build
```

### Build individual apps
```bash
# Editor app
pnpm --filter editor build

# Web app
pnpm --filter web build
```

## Troubleshooting

### Common Issues

1. **Missing environment variables**
   - Ensure all required environment variables are set
   - Check that your Contentful tokens have the correct permissions

2. **Content not loading**
   - Verify your Space ID and API tokens
   - Check that content is published in Contentful
   - Ensure content models match the expected structure

3. **TypeScript errors**
   - Run `pnpm install` to ensure all dependencies are installed
   - Check that workspace references are correctly configured

## Next Steps

1. **Set up Contentful Space**:
   - Create the "Configurations" content model (most important)
   - Add Type (Long text) and Data (JSON object) fields
   - Optionally add other content models for blog functionality

2. **Configure Environment Variables**:
   - Add your Contentful API credentials to `.env.local` files
   - Ensure Management API token has write permissions

3. **Create Dynamic Components**:
   - Open editor at http://localhost:5173
   - Switch to "Component Editor" mode
   - Create Cards, Heroes, Banners, etc.
   - Save configurations to Contentful

4. **View Components**:
   - Visit http://localhost:3000/components
   - See your dynamic components rendered in real-time
   - Components update automatically when you modify configurations

## Component System Architecture

### How It Works
1. **Editor App**: Creates component configurations with `type` and `data` fields
2. **Contentful**: Stores configurations as JSON in the "Configurations" content model
3. **Web App**: Fetches configurations and renders appropriate React components
4. **Dynamic Rendering**: Component type determines which React component to render
5. **Data Binding**: Component data populates the rendered component's props

### Adding New Component Types
1. Add new component type to `COMPONENT_TYPES` in `contentful-types`
2. Create component data interface (e.g., `NewComponentData`)
3. Add form fields in `DynamicComponentEditor.tsx`
4. Add rendering logic in `DynamicComponentRenderer.tsx`
5. Component automatically appears in editor dropdown

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
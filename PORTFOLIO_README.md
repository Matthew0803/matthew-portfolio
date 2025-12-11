# Matthew's Portfolio Website

A modern, interactive portfolio website built with React, TypeScript, and Tailwind CSS, featuring dynamic animations, light/dark mode, and a sleek design inspired by contemporary portfolio websites.

## 🎨 Features

### Design Elements
- **Space Grotesk Font**: Clean, modern typography throughout the site
- **Dark Theme with Blue Accents**: Professional color scheme with customizable theme switching
- **Scrambled Text Animation**: Eye-catching name reveal effect on the home page
- **Blinking Blue Dot**: Status indicator showing online/active status
- **Floating Background Elements**: Subtle animated background components
- **Smooth Scrolling**: Enhanced user experience with smooth page transitions

### Pages & Sections

#### Home Page
- Hero section with animated name reveal
- Blinking blue status indicator
- About Me section with placeholder for 2-3 sentence bio
- Experience section with expandable cards
- Placeholder content ready for customization

#### Projects Page
- Grid layout with project cards
- Hover effects with image zoom
- Status badges (Completed/In Progress)
- Technology tags for each project
- Clickable cards leading to detailed project pages
- Sample projects with placeholder images

#### Project Detail Pages
- Full project descriptions
- Technology stack display
- Key features list
- Links to GitHub and live demos
- Back navigation to projects list

#### Gallery Page
- Responsive grid layout
- Hover effects with category labels
- Ready for photography, artwork, or creative projects

### Interactive Components
- **Top Navigation Bar**: Fixed header with Home, Projects, and Gallery links
- **Theme Toggle**: Switch between light and dark modes
- **Mobile Menu**: Responsive hamburger menu for mobile devices
- **Animated Social Bar**: Bottom bar with scrolling social links (GitHub, LinkedIn, Email)
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop

## 📝 Customization Guide

### 1. Update Personal Information

**Home Page** (`client/src/pages/Home.tsx`):
- Replace the bio placeholder text in the "About Me" section
- Update experience cards with your actual work experience
- Modify position titles, company names, dates, and descriptions

### 2. Add Your Projects

**Projects Page** (`client/src/pages/Projects.tsx`):
- Replace the sample projects array with your own projects
- Update project titles, descriptions, and images
- Change technology tags to match your tech stack
- Update project status (Completed/In Progress)

**Project Detail Page** (`client/src/pages/ProjectDetail.tsx`):
- Create individual project detail pages
- Add detailed descriptions, features, and outcomes
- Update GitHub and demo links

### 3. Customize Social Links

**Social Bar** (`client/src/components/SocialBar.tsx`):
- Update the `href` values with your actual social media links:
  - GitHub: Replace `https://github.com` with your GitHub profile
  - LinkedIn: Replace `https://linkedin.com` with your LinkedIn profile
  - Email: Replace `contact@example.com` with your email address
- Add or remove social links as needed

### 4. Update Gallery

**Gallery Page** (`client/src/pages/Gallery.tsx`):
- Replace sample images with your own photography or artwork
- Update categories and titles
- Add more gallery items to the array

### 5. Customize Colors

**Theme Colors** (`client/src/index.css`):
- Modify the CSS variables in `:root` for light theme
- Modify the CSS variables in `.dark` for dark theme
- Adjust primary, accent, and background colors to match your brand

### 6. Update Metadata

**HTML Title and Favicon** (`client/index.html`):
- The title is controlled by `%VITE_APP_TITLE%` environment variable
- The favicon is controlled by `%VITE_APP_LOGO%` environment variable
- Update these in the project settings or directly in the HTML

## 🚀 Development

### Local Development
The development server is already running. Any changes you make will automatically reload.

### Project Structure
```
client/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navigation.tsx       # Top navigation bar
│   │   ├── SocialBar.tsx        # Bottom social links bar
│   │   ├── ScrambleText.tsx     # Animated text effect
│   │   ├── ProjectCard.tsx      # Project card component
│   │   └── FloatingElements.tsx # Background animations
│   ├── pages/            # Page components
│   │   ├── Home.tsx            # Home page
│   │   ├── Projects.tsx        # Projects listing
│   │   ├── ProjectDetail.tsx   # Individual project page
│   │   └── Gallery.tsx         # Gallery page
│   ├── App.tsx           # Main app with routing
│   └── index.css         # Global styles and animations
```

## 🎯 Key Features to Customize

### Priority Customizations:
1. ✅ **Bio Section**: Add your personal 2-3 sentence introduction
2. ✅ **Experience Cards**: Replace with your actual work experience
3. ✅ **Projects**: Add your real projects with descriptions and images
4. ✅ **Social Links**: Update with your actual GitHub, LinkedIn, and email
5. ✅ **Gallery**: Add your photography or creative work

### Optional Enhancements:
- Add a blog section
- Integrate with a CMS for easier content management
- Add contact form functionality
- Include resume download link
- Add analytics tracking

## 🌐 Deployment

When you're ready to deploy:
1. Click the **Publish** button in the UI (requires creating a checkpoint first)
2. Your site will be deployed and accessible via the provided URL
3. You can bind a custom domain in the Settings panel

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1280px and up)

## 🎨 Design Inspiration

This portfolio incorporates design elements from:
- **meganchun.github.io**: Animated scrolling components
- **nicholaschen.me**: Clean typography and inline link badges
- **sophieyang.dev**: Project cards with hover effects and line numbers aesthetic
- **adiii3692.is-a.dev**: Light/dark mode toggle and playful design elements

## 📦 Technologies Used

- **React 19**: Modern UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Wouter**: Lightweight routing
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool

## 💡 Tips

- Use high-quality images for projects and gallery (recommended: 1200x800px for projects)
- Keep descriptions concise and impactful
- Update the blinking dot color to match your brand
- Test the site on different devices before deploying
- Regularly update your projects and experience sections

---

Built with ❤️ for Matthew | Mechatronics Engineering Student @ University of Waterloo


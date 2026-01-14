# Modern 3D Portfolio

A premium, interactive portfolio site built with HTML, CSS, Vanilla JS, and Three.js.

## Features
- **3D Interactive Background**: Particle system using Three.js.
- **Glassmorphism Design**: Modern, translucent UI with blur effects.
- **Infinite Gallery**: Carousel for Projects and Achievements with infinite loop logic.
- **Dark/Light Mode**: Automatic theme detection and toggle.
- **3D Card Tilt**: Cards react to mouse movement.

## How to Deploy (GitHub + Render)

This site is a static website, making it free and easy to host.

### Step 1: Push to GitHub
1. Initialize a git repository if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Create a free account at [render.com](https://render.com).
2. Click **New +** -> **Static Site**.
3. Connect your GitHub account and select your portfolio repository.
4. **Build Settings**:
   - **Build Command**: (Leave empty)
   - **Publish Directory**: `.` (or leave empty, as index.html is in the root)
5. Click **Create Static Site**.

Render will automatically deploy your site and provide a free URL (e.g., `your-name.onrender.com`). Every time you push changes to GitHub, Render will auto-deploy the updates.

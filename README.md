# NFK PRIME - Cinematic Cyberpunk Website

A single-page cinematic cyberpunk website for NFK PRIME, a verified Blood Strike content creator and TikTok live streamer.

## 🚀 How to Run

Simply double-click `index.html` to open the website in your browser. No build process, no dependencies, no server required.

## 📁 File Structure

```
nfk-prime/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styling with design tokens
├── js/
│   ├── data.js        # All text, links, and clips (easy to edit)
│   ├── scene.js       # Three.js 3D background
│   └── main.js        # Loader, animations, cursor, tilt, UI
└── images/
    ├── profile.jpg    # Your profile photo (REPLACE THIS)
    ├── og.jpg         # Social sharing image (REPLACE THIS)
    └── favicon.svg    # Gold "N" favicon
```

## ✏️ How to Customize

### 1. Change Your Photo

Replace `images/profile.jpg` with your actual profile picture:
- Recommended: Square image (400x400px or larger)
- Format: JPG or PNG
- The website will automatically display it in the hero section

If the image is missing, it shows a placeholder "ADD PHOTO" message.

### 2. Change Text and Links

Edit `js/data.js` - this file contains ALL your content:

```javascript
const SITE = {
    name: "NFK PRIME",
    tagline: "1V1 • 1V4 • LIVE ON TIKTOK",

    links: {
        tiktok: "https://www.tiktok.com/@nfkprime",
        youtube: "https://youtube.com/@nfk_prime?si=WUVYEZbxAJuRLOwZ",
        whatsapp: "https://whatsapp.com/channel/0029VbDEipmLo4hZkfNHVi1A"
    },

    clips: [
        { title: "1V1 / 1V4 • CLIP 01", url: "https://vt.tiktok.com/..." },
        // Add more clips here
    ],

    stats: null  // Add stats when you have real numbers
};
```

### 3. Add Stats

When you have real numbers, update `js/data.js`:

```javascript
stats: {
    followers: "10K+",
    videos: "100+",
    live: "50+"
}
```

The stats section will automatically appear in the About section.

### 4. Update Social Sharing Image

Replace `images/og.jpg` with a 1200x630px image for better social media previews on Twitter, Facebook, etc.

### 5. Update Domain Before Deploying

In `index.html`, find and replace:
- Line 15: `<meta property="og:url" content="https://your-domain.com">`
- Line 25: `<link rel="canonical" href="https://your-domain.com">`

Replace `https://your-domain.com` with your actual deployed URL.

## 🌐 How to Deploy (Free Options)

### Option 1: Netlify Drop (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `nfk-prime` folder
3. Your site will be live in seconds
4. Update the og:image URL in index.html to the full Netlify URL

### Option 2: Vercel
1. Go to https://vercel.com
2. Sign up/login
3. Import your project (or drag and drop)
4. Your site will be deployed automatically
5. Update the og:image URL in index.html to the full Vercel URL

### Option 3: GitHub Pages
1. Create a GitHub repository
2. Upload the `nfk-prime` folder contents
3. Go to Settings > Pages
4. Select main branch and save
5. Your site will be at `https://yourusername.github.io/repo-name`
6. Update the og:image URL in index.html to the full GitHub Pages URL

## 🎨 Design Features

- **Colors**: Black, white, and gold only
- **3D Background**: Three.js infinite grid, cyber city monoliths, floating particles
- **Animations**: GSAP scroll triggers, text scramble, typewriter effect
- **Mobile-First**: Responsive design, touch-friendly, swipe carousel on mobile
- **Performance**: Optimized for mid-range phones, pauses when tab hidden
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, reduced motion support

## 🔧 Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Custom properties, animations, responsive design
- **Vanilla JavaScript**: No frameworks, no build step
- **Three.js r128**: 3D background (CDN)
- **GSAP 3.12.5**: Animations (CDN)
- **Google Fonts**: Orbitron, Rajdhani, Share Tech Mono

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ♿ Accessibility

- Skip link for keyboard users
- ARIA labels on interactive elements
- Visible focus states
- Reduced motion support
- High contrast colors
- Semantic HTML landmarks

## 🚦 Performance Optimizations

- Pixel ratio capped at 1.5
- Fewer buildings/particles on mobile
- No antialias on mobile
- Pauses rendering when tab hidden
- Graceful fallback if WebGL fails
- Respects prefers-reduced-motion

## 🐛 Troubleshooting

### 3D Background Not Showing
- Check browser console for errors
- Verify WebGL is supported
- Fallback gradient will show if 3D fails

### Images Not Loading
- Ensure files exist in `images/` folder
- Check filenames match exactly (case-sensitive)
- Replace placeholder files with actual images

### Animations Not Working
- Check if reduced motion is enabled in OS settings
- Verify GSAP scripts loaded from CDN
- Check browser console for errors

## 📄 License

This website is for NFK PRIME's personal use.

---

Built with HTML, CSS, and vanilla JavaScript. No frameworks or build tools required.

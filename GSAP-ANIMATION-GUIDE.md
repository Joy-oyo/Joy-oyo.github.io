# 🎬 GSAP Animation Guide for Joy Chen's Portfolio

Complete guide to using GSAP + ScrollTrigger + Lottie animations on your portfolio website.

---

## 🎯 Quick Start

Simply add class names to your HTML elements to enable animations:

```html
<!-- Fade up when scrolling into view -->
<div class="fade-up">
    <h2>About Me</h2>
    <p>This content fades up smoothly</p>
</div>

<!-- Fade from left -->
<div class="fade-left">
    <img src="profile.jpg" alt="Profile">
</div>

<!-- Fade from right -->
<div class="fade-right">
    <div class="card">Card content</div>
</div>

<!-- Scale up with bounce -->
<button class="scale-up">Click Me</button>
```

---

## 📚 Available Animation Classes

### 1. **Fade Animations**

| Class | Effect | When to Use |
|-------|--------|-------------|
| `.fade-up` | Fades in from bottom | Sections, cards, text blocks |
| `.fade-left` | Fades in from left | Images, side content |
| `.fade-right` | Fades in from right | Images, side content |
| `.scale-up` | Scales up with fade | Buttons, icons, highlights |

**Example:**
```html
<section class="fade-up">
    <h2>My Work</h2>
    <div class="card fade-left">Left card</div>
    <div class="card fade-right">Right card</div>
</section>
```

---

### 2. **Parallax Effects**

Create depth by moving elements at different speeds while scrolling.

| Class | Effect | When to Use |
|-------|--------|-------------|
| `.parallax-slow` | Moves slowly (depth effect) | Background elements, decorative shapes |
| `.parallax-fast` | Moves faster | Foreground elements |

**Example:**
```html
<section style="position: relative;">
    <div class="parallax-slow" style="position: absolute; top: 0;">
        <img src="background-shape.svg" alt="">
    </div>
    <div class="content">
        <h2>Your content here</h2>
    </div>
</section>
```

---

### 3. **Text Animations**

#### Word-by-Word Reveal
```html
<h1 class="text-reveal">This text reveals word by word</h1>
```

#### Animated Underline
```html
<h2 class="underline-reveal">This gets an animated underline</h2>
```

**Use Cases:**
- Headlines
- Section titles
- Important quotes
- Call-to-action text

---

### 4. **Image Animations**

| Class | Effect | Best For |
|-------|--------|----------|
| `.image-reveal` | Clip-path slide reveal | Hero images, portfolio items |
| `.image-zoom` | Zoom out effect | Background images, galleries |

**Example:**
```html
<div class="image-reveal">
    <img src="project.jpg" alt="Project">
</div>

<div class="image-zoom" style="overflow: hidden;">
    <img src="hero.jpg" alt="Hero">
</div>
```

---

### 5. **Advanced Features**

#### Pin Section (Sticky Scroll)
Pin a section in place while content scrolls.

```html
<section data-pin="true">
    <h2>This section pins while scrolling</h2>
    <p>Great for showcasing important content</p>
</section>
```

#### Scroll Progress Bar
Add to your HTML (before closing `</body>`):

```html
<div class="scroll-progress"></div>
```

Then enable in JS by uncommenting in `gsap-animations.js`:
```javascript
// In GSAPAnimationController init() method, add:
this.initScrollProgress();
```

---

## 🎨 Real-World Examples

### Example 1: Animated About Section

```html
<section class="about-section">
    <div class="container">
        <h2 class="fade-up text-reveal">About Me</h2>
        <div class="row">
            <div class="col-md-6 fade-left">
                <img src="profile.jpg" alt="Joy Chen" class="image-reveal">
            </div>
            <div class="col-md-6 fade-right">
                <p class="fade-up">I'm a developer passionate about...</p>
                <ul class="feature-list fade-up">
                    <li>Web Development</li>
                    <li>Game Design</li>
                    <li>Photography</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

### Example 2: Portfolio Grid

```html
<section class="portfolio-grid">
    <h2 class="fade-up underline-reveal">My Projects</h2>
    <div class="card-group">
        <div class="card scale-up">
            <img src="project1.jpg" class="image-zoom" alt="Project 1">
            <h3>Project One</h3>
        </div>
        <div class="card scale-up">
            <img src="project2.jpg" class="image-zoom" alt="Project 2">
            <h3>Project Two</h3>
        </div>
        <div class="card scale-up">
            <img src="project3.jpg" class="image-zoom" alt="Project 3">
            <h3>Project Three</h3>
        </div>
    </div>
</section>
```

### Example 3: Hero Section with Parallax

```html
<section class="hero" style="position: relative; overflow: hidden;">
    <!-- Background parallax element -->
    <div class="parallax-slow" style="position: absolute; top: 0; width: 100%;">
        <div class="background-gradient"></div>
    </div>

    <!-- Main content -->
    <div class="hero-content">
        <h1 class="hero-title">Joy Chen</h1>
        <p class="hero-subtitle fade-up">Developer • Designer • Creator</p>
        <div class="hero-buttons">
            <button class="btn scale-up">View Work</button>
            <button class="btn scale-up">Contact Me</button>
        </div>
    </div>
</section>
```

---

## 🎭 Lottie Animations

### How to Add Lottie Animations

1. **Get a Lottie JSON file** from [LottieFiles.com](https://lottiefiles.com/)
2. **Save it** to your project (e.g., `/animations/loader.json`)
3. **Add to HTML**:

```html
<div data-lottie-src="animations/loader.json" style="width: 200px; height: 200px;"></div>
```

The animation will automatically load and play!

### Popular Use Cases

- **Loading animations**: Spinners, progress indicators
- **Icon animations**: Hover effects, click feedback
- **Success/Error states**: Checkmarks, error symbols
- **Decorative elements**: Background animations, accents

### Best Lottie Resources

- [LottieFiles](https://lottiefiles.com/) - Free animations
- [IconScout](https://iconscout.com/lottie-animations) - Premium animations
- [After Effects + Bodymovin](https://aescripts.com/bodymovin/) - Create custom

---

## 🛠️ Customization

### Adjust Animation Speed

Edit `js/gsap-animations.js` and modify duration values:

```javascript
// Slower animation (more dramatic)
gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 1.5,  // Change from 1 to 1.5
    ease: 'power3.out'
});

// Faster animation (snappier)
gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 0.6,  // Change from 1 to 0.6
    ease: 'power3.out'
});
```

### Change Easing Functions

Available easing options:
- `power1.out` - Gentle ease
- `power2.out` - Medium ease
- `power3.out` - Strong ease (default)
- `back.out(1.7)` - Bounce effect
- `elastic.out(1, 0.3)` - Elastic bounce
- `none` - Linear (for parallax)

```javascript
// Example with bounce
gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)'  // Adds bounce
});
```

### Adjust Scroll Trigger Points

```javascript
gsap.from(element, {
    scrollTrigger: {
        trigger: element,
        start: 'top 85%',     // Start when element is 85% down viewport
        end: 'bottom 20%',    // End when element is 20% up viewport
        toggleActions: 'play none none reverse'
    },
    // ... animation properties
});
```

---

## 🐛 Debugging

### Enable ScrollTrigger Markers

Uncomment this line in `gsap-animations.js`:

```javascript
scrollTrigger: {
    trigger: element,
    start: 'top 85%',
    markers: true  // Uncomment to see trigger points
}
```

This shows visual markers for when animations trigger.

### Common Issues

**Animation not working?**
1. Check browser console for errors
2. Verify element has the correct class
3. Make sure element is visible on page
4. Check that GSAP scripts loaded (view source)

**Animation triggers too early/late?**
- Adjust `start` value in ScrollTrigger (e.g., `'top 90%'` or `'top 70%'`)

**Animation too fast/slow?**
- Adjust `duration` value (higher = slower)

**Reduced motion detected?**
- Animations won't run if user has reduced-motion preference enabled (accessibility feature)

---

## 🚀 Performance Tips

1. **Don't animate everything** - Choose key elements for maximum impact
2. **Use `will-change` sparingly** - Already applied to animated elements
3. **Test on mobile devices** - Ensure smooth performance
4. **Lazy load heavy content** - Don't load all animations at once
5. **Keep Lottie files small** - Aim for <200KB per animation

---

## 🎯 Recommended Animation Strategy

### **Level 1: Basic (Start Here)**
- Hero section: Fade up title and buttons
- Section headings: `fade-up` or `text-reveal`
- Images: `fade-left` or `fade-right`

### **Level 2: Intermediate**
- Add parallax to backgrounds: `parallax-slow`
- Animate portfoli cards: `scale-up`
- Add underline reveals to headings: `underline-reveal`
- Stagger card grids (automatic)

### **Level 3: Advanced**
- Custom GSAP timelines for complex sequences
- Pin sections for storytelling
- Scroll progress bar
- Custom Lottie animations for micro-interactions

---

## 📊 Animation Checklist

Before going live, verify:

- [ ] Hero section has entrance animation
- [ ] All major sections fade in on scroll
- [ ] Images have reveal animations
- [ ] Call-to-action buttons have hover/scale effects
- [ ] Navigation hides/shows on scroll
- [ ] Animations respect reduced-motion preference
- [ ] Performance is smooth on mobile (60fps)
- [ ] No animation overwh (too many moving elements)
- [ ] Timing feels natural (not too fast/slow)

---

## 🔗 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Lottie Documentation](https://airbnb.io/lottie/)
- [LottieFiles](https://lottiefiles.com/) - Free animations
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)

---

## 💡 Next Steps

1. **Start simple** - Add `fade-up` to 3-5 key sections
2. **Test and refine** - Adjust timings and easing
3. **Add variety** - Mix in parallax and text reveals
4. **Add Lottie** - Find 2-3 micro-animations to enhance UX
5. **Optimize** - Remove any animations that feel unnecessary

Remember: **Less is more**. Quality animations > Quantity of animations.

---

Built with ❤️ using GSAP + ScrollTrigger + Lottie

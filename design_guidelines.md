# Purpose App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Tinder's intuitive card swiping mechanics and Headspace's calming, mindful aesthetic to create an engaging yet serene self-discovery experience.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Soft Teal: 174 65% 45% (growth, balance, freshness)
- Soft Peach: 35 100% 85% (comfort, friendliness, gentle optimism)  
- Vivid Coral: 358 100% 68% (energy, attention, playful accent)

**Neutral Background:**
- Off-white: 0 0% 98% (keeps focus on cards)

**Action Colors:**
- Swipe Right (Green): 134 83% 50%
- Swipe Left (Red): 4 100% 59%
- Super Swipe (Gold): 51 100% 50%

### B. Typography
**Primary Font:** Poppins (headings, card titles)
**Secondary Font:** Inter (body text, descriptions)
**Hierarchy:** Bold titles (24px), medium subtitles (18px), regular body (16px)

### C. Layout System
**Spacing Units:** Tailwind spacing of 4, 5, 6, and 8 units (16px, 20px, 24px, 32px)
**Primary Padding:** 20px (p-5) throughout
**Card Spacing:** 24px (gap-6) between interactive elements

### D. Component Library

**Card Stack:**
- Centered layout with perspective effect
- Soft shadows (shadow-lg) with 12px border radius (rounded-xl)
- Cards slightly offset and scaled for depth perception
- Smooth transform transitions (300ms ease-out)

**Navigation Controls:**
- Large circular action buttons (64px diameter) with icons
- Left button: Red with X icon, Right button: Green with heart icon
- Positioned below card stack with generous touch targets
- Subtle hover states with scale transforms

**Progress Indicators:**
- Minimal dot indicators showing current position in deck
- Category counter display with soft background cards

**Mobile Optimizations:**
- Touch-friendly 44px minimum touch targets
- Swipe gesture recognition with visual feedback
- Haptic feedback integration for actions

### E. Animations
**Card Interactions:**
- Smooth drag following with rotation based on direction
- Snap-back animation for incomplete swipes
- Exit animations: slide + fade for completed swipes
- Subtle spring animations for card reveals

**Micro-interactions:**
- Button press feedback with gentle scale (0.95)
- Color transitions on hover states
- Gentle pulse on super swipe activation

## Images
**Card Images:** Each purpose card features a relevant lifestyle image (family gathering, mountain adventure, business success, etc.) with soft overlay to ensure text readability. Images are 300x200px with rounded corners matching card design.

**No Hero Image:** The app uses a clean, minimal background to keep focus entirely on the interactive card experience.

## Key Design Principles
1. **Gesture-First Design:** Prioritize touch interactions over traditional UI controls
2. **Calming Aesthetics:** Use soft colors and gentle animations to create a meditative experience
3. **Clear Visual Hierarchy:** Each card tells its story through thoughtful typography and imagery
4. **Immediate Feedback:** Every interaction provides clear, satisfying visual response
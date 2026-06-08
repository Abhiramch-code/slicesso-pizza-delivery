---
name: Vibrant Hearth
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5d3f3e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#916e6d'
  outline-variant: '#e6bdbb'
  surface-tint: '#bf0029'
  primary: '#b90027'
  on-primary: '#ffffff'
  primary-container: '#e31837'
  on-primary-container: '#fffaf9'
  inverse-primary: '#ffb3b1'
  secondary: '#954a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd8100'
  on-secondary-container: '#5d2c00'
  tertiary: '#5a5b5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#727474'
  on-tertiary-container: '#fbfbfb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001d'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#ffb785'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#723700'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for a high-velocity Pizza Delivery SaaS, balancing the visceral energy of a kitchen with the clinical precision of modern software. The brand personality is **energetic, professional, and appetizing**. 

The aesthetic is **Modern Glassmorphic**, utilizing layered transparency to create depth without clutter. The UI evokes an "open kitchen" feel—transparent, clean, and organized. It relies on high-quality food photography as a core structural element, using glass panels to overlay controls directly onto vibrant imagery, ensuring the product (the pizza) remains the focal point while the SaaS tools feel lightweight and unobtrusive.

## Colors
This design system utilizes a high-octane palette designed to trigger appetite and urgency.
- **Primary (Vibrant Red):** Used for critical actions, price points, and "Order Now" triggers.
- **Secondary (Warm Orange):** Reserved for highlights, loyalty status, and appetizing accents like ingredient modifiers.
- **Neutral (Deep Charcoal):** Applied to primary text and iconography for maximum legibility against white and glass surfaces.
- **Surface (Crisp White):** The foundational base for the light-mode UI, providing a sterile, professional SaaS environment.
- **Glass Accents:** A 60% opacity white with a 20px backdrop blur is used for floating panels.

## Typography
The typography system uses **Inter** for its neutral, highly legible character, allowing the vibrant photography to do the heavy lifting. **JetBrains Mono** is introduced for technical labels, SKU numbers, and status badges to reinforce the "SaaS" and data-driven nature of the platform.

Headlines should use tight letter-spacing and heavy weights to maintain authority. For mobile devices, display type scales down significantly to ensure the pizza configuration wizards remain functional without excessive scrolling.

## Layout & Spacing
The layout follows a **fluid grid** model with a base-4 spacing rhythm. 
- **Mobile:** Single column layout with 16px side margins. High-use actions (like "Add to Cart") are pinned to the bottom of the viewport using a glassmorphic bar.
- **Desktop Dashboard:** A 12-column grid. Admin views utilize a fixed sidebar (240px) with fluid content areas for data-dense tables. 
- **Wizards:** Multi-step ingredient wizards center the "Live Preview" of the pizza on the left 60% of the screen (desktop) or top 40% (mobile), with configuration controls on the remaining space.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional shadows. 
- **Level 1 (Surface):** Solid white or very light gray backgrounds.
- **Level 2 (Cards):** Semi-transparent white (#FFFFFF99) with a 16px-24px `backdrop-filter: blur()`. A 1px solid border with 10% white opacity creates a "rim light" effect.
- **Level 3 (Modals/Popovers):** Increased blur (40px) and a subtle 20% opacity neutral shadow to separate the element from the blurred background below.

## Shapes
The design system adopts a **Rounded** corner strategy (0.5rem base). This choice mirrors the organic, circular nature of the product while maintaining a disciplined software structure. 
- Large containers and glass panels use `rounded-xl` (1.5rem) to feel friendly and modern.
- Interactive elements like buttons and input fields use the standard `rounded` (0.5rem) for a crisp, professional look.

## Components
- **Buttons:** Primary buttons are Solid Red (#E31837) with white text. Secondary buttons use a glass effect with a subtle border.
- **Ingredient Cards:** Visual squares featuring a high-res image of the ingredient (e.g., pepperoni, olives). When selected, they gain a 2px Orange border and a checkmark badge.
- **Multi-step Wizards:** A horizontal progress tracker at the top using "stepper" dots. The "Next" action is always anchored for thumb-reach on mobile.
- **Live Preview Panel:** A dedicated container that renders the pizza build in real-time. On mobile, this is a sticky header that shrinks as the user scrolls through ingredients.
- **Data Tables:** For the admin dashboard, tables use `inter` for data and `jetbrainsMono` for IDs. Rows have a subtle hover state (5% secondary color tint) and no vertical borders, only horizontal dividers.
- **Status Chips:** Using JetBrains Mono, these are small pill-shaped labels (e.g., "In Oven", "Out for Delivery") with low-saturation background tints of the status color (Green for "Delivered", Orange for "Cooking").
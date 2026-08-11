---
name: Obsidian Kinetic
colors:
  surface: '#16130c'
  surface-dim: '#16130c'
  surface-bright: '#3d3931'
  surface-container-lowest: '#100e08'
  surface-container-low: '#1e1b14'
  surface-container: '#221f18'
  surface-container-high: '#2d2a22'
  surface-container-highest: '#38342c'
  on-surface: '#e9e2d6'
  on-surface-variant: '#bec9c3'
  inverse-surface: '#e9e2d6'
  inverse-on-surface: '#343028'
  outline: '#89938d'
  outline-variant: '#3f4944'
  surface-tint: '#8bd5b9'
  primary: '#8bd5b9'
  on-primary: '#003829'
  primary-container: '#559e84'
  on-primary-container: '#003023'
  inverse-primary: '#1b6a53'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffb3ad'
  on-tertiary: '#561e1b'
  tertiary-container: '#cb7b74'
  on-tertiary-container: '#4d1715'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a6f2d4'
  primary-fixed-dim: '#8bd5b9'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#00513d'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#3a0908'
  on-tertiary-fixed-variant: '#72342f'
  background: '#16130c'
  on-background: '#e9e2d6'
  surface-variant: '#38342c'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style
This design system utilizes a high-contrast, technical aesthetic inspired by developer tools and precision engineering. The core personality is focused, industrial, and high-performance.

The style is a hybrid of **Minimalism** and **Technical Brutalism**. It prioritizes extreme legibility and rapid data scanning by using a pure black canvas to minimize eye strain and maximize the vibrancy of the forest green accents. Visual interest is generated through precise geometry and strict alignment rather than decorative flourishes.

## Colors
The palette is built on a "Void and Vitals" philosophy. 

- **Background & Surfaces:** The primary background is absolute `#000000` to provide infinite depth. Secondary containers use a subtle `#1A1A1A` to create enough contrast for grouping without breaking the dark aesthetic.
- **Primary Action:** The Forest Green (`#408A71`) is used strictly for interactive elements, progress indicators, and primary branding moments.
- **Typography:** All high-contrast text uses `#FFF7EB` (Off-White) to reduce the harshness of pure white on black while maintaining AAA accessibility.
- **Semantic Risk:** Colors are calibrated for high-visibility on black. **Critical** uses a vibrant red, **High** a saturated orange, **Medium** a sharp yellow, and **Low** a desaturated mint to differentiate from the Primary Forest Green.

## Typography
This design system exclusively uses **Geist** for its systematic, technical character. 

- **Headlines:** Use tighter letter spacing and heavier weights to create a strong visual anchor against the black background.
- **Body:** Generous line-height is applied to `body-lg` and `body-md` to ensure long-form text remains readable in high-contrast dark mode.
- **Labels:** Used for metadata and UI controls, utilizing medium weights and slight tracking for clarity at small sizes.

## Layout & Spacing
The layout follows a strict 4px grid system. 

- **Desktop:** A 12-column fluid grid with 24px gutters. Content is housed within a 1440px max-width container centered on the screen.
- **Mobile:** A 4-column grid with 16px margins. 
- **Rhythm:** Vertical spacing between sections should use multiples of 16px (e.g., 32, 64, 80) to maintain a disciplined, technical pace.

## Elevation & Depth
In this design system, depth is conveyed through **Tonal Layering** and **Low-contrast Outlines** rather than shadows. 

- **Level 0 (Base):** Pure Black `#000000`.
- **Level 1 (Card/Container):** Dark Grey `#1A1A1A`.
- **Borders:** To define edges, use a 1px solid border of `#333333` for containers and `#408A71` for active states. 
- **No Shadows:** Traditional drop shadows are omitted to maintain the "Kinetic" aesthetic. Depth is perceived via the contrast between the absolute black background and the slightly elevated dark grey surfaces.

## Shapes
The design system follows the 'ROUND_FOUR' logic, translating to a `Rounded` (Level 2) setting.

- **Standard Components:** Buttons and Input fields use a 0.5rem (8px) corner radius.
- **Containers:** Larger cards and modals use 1rem (16px) for `rounded-lg` and 1.5rem (24px) for `rounded-xl`.
- This level of rounding softens the aggressive high-contrast colors, making the professional UI feel more approachable and modern.

## Components
- **Buttons:** Primary buttons use a `#408A71` fill with `#000000` text for maximum impact. Secondary buttons are outlined with `#333333` and use `#FFF7EB` text.
- **Input Fields:** Backgrounds should be `#1A1A1A` with a `#333333` border. On focus, the border transitions to `#408A71`.
- **Chips:** Small, low-profile indicators with a background of `#1A1A1A` and text in semantic risk colors or primary green.
- **Lists:** Separated by 1px dividers of `#1A1A1A`. Active list items receive a subtle left-accent border of 4px in Forest Green.
- **Cards:** Defined by a `#1A1A1A` background. No shadows. Padding should be a consistent 24px.
- **Data Visuals:** Charts and graphs should utilize the semantic risk palette against the black background, ensuring line weights are at least 2px for visibility.
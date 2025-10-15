# 📏 Font Size Reference Guide

## Quick Reference Table

### Text Sizes (Tailwind → Pixels)

| Tailwind Class | Mobile | Tablet (sm) | Desktop (md) | Large (lg) | XL |
|----------------|--------|-------------|--------------|------------|-----|
| `text-[9px]` | 9px | - | - | - | - |
| `text-[10px]` | 10px | - | - | - | - |
| `text-[11px]` | 11px | - | - | - | - |
| `text-xs` | 12px | 12px | 12px | 12px | 12px |
| `text-sm` | 14px | 14px | 14px | 14px | 14px |
| `text-base` | 16px | 16px | 16px | 16px | 16px |
| `text-lg` | 18px | 18px | 18px | 18px | 18px |
| `text-xl` | 20px | 20px | 20px | 20px | 20px |
| `text-2xl` | 24px | 24px | 24px | 24px | 24px |
| `text-3xl` | 30px | 30px | 30px | 30px | 30px |
| `text-4xl` | 36px | 36px | 36px | 36px | 36px |
| `text-5xl` | 48px | 48px | 48px | 48px | 48px |
| `text-6xl` | 60px | 60px | 60px | 60px | 60px |

## Component Font Sizes

### 📱 ModelResponse & ServiceModal

#### Main Title
```jsx
className="text-base sm:text-xl md:text-2xl"
```
- Mobile: 16px
- Tablet: 20px
- Desktop: 24px

#### Section Headers (⚖️ 📋 🔄 ℹ️)
```jsx
className="text-[11px] sm:text-xs md:text-sm lg:text-base"
```
- Mobile: 11px
- Tablet: 12px
- Desktop: 14px
- Large: 16px

#### Body Text (Lists)
```jsx
className="text-[10px] sm:text-xs md:text-sm lg:text-base"
```
- Mobile: 10px
- Tablet: 12px
- Desktop: 14px
- Large: 16px

#### Icons (Emoji)
```jsx
className="text-sm sm:text-base md:text-lg"
```
- Mobile: 14px
- Tablet: 16px
- Desktop: 18px

#### Info Badge Labels (⏳ 📍 💰)
```jsx
className="text-[9px] sm:text-[10px] md:text-xs"
```
- Mobile: 9px
- Tablet: 10px
- Desktop: 12px

#### Info Badge Values
```jsx
className="text-[10px] sm:text-xs md:text-sm"
```
- Mobile: 10px
- Tablet: 12px
- Desktop: 14px

#### Number Circles (1, 2, 3...)
```jsx
className="text-[9px] sm:text-[10px] md:text-xs"
```
- Mobile: 9px
- Tablet: 10px
- Desktop: 12px

### 💬 Chat Messages

#### User & Model Messages
```jsx
className="text-xs sm:text-sm md:text-base"
```
- Mobile: 12px
- Tablet: 14px
- Desktop: 16px

### 🏠 Main App

#### Page Badge
```jsx
className="text-xs sm:text-sm"
```
- Mobile: 12px
- Tablet: 14px

#### Main Title
```jsx
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
```
- Mobile: 24px
- Tablet: 30px
- Desktop: 36px
- Large: 48px
- XL: 60px

#### Subtitle
```jsx
className="text-sm sm:text-base md:text-lg lg:text-xl"
```
- Mobile: 14px
- Tablet: 16px
- Desktop: 18px
- Large: 20px

#### Quick Category Buttons
```jsx
className="text-xs sm:text-sm"
```
- Mobile: 12px
- Tablet: 14px

#### Input Textarea
```jsx
className="text-sm sm:text-base md:text-lg"
```
- Mobile: 14px
- Tablet: 16px
- Desktop: 18px

## Spacing Reference

### Padding

| Class | Mobile | Tablet | Desktop | Large |
|-------|--------|--------|---------|-------|
| `p-2` | 8px | - | - | - |
| `p-2.5` | 10px | - | - | - |
| `p-3` | 12px | - | - | - |
| `sm:p-3` | - | 12px | - | - |
| `sm:p-4` | - | 16px | - | - |
| `md:p-4` | - | - | 16px | - |
| `md:p-6` | - | - | 24px | - |
| `lg:p-6` | - | - | - | 24px |
| `lg:p-8` | - | - | - | 32px |

### Margin

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `mb-1.5` | 6px | - | - |
| `mb-2` | 8px | - | - |
| `sm:mb-2` | - | 8px | - |
| `sm:mb-3` | - | 12px | - |
| `md:mb-3` | - | - | 12px |
| `md:mb-4` | - | - | 16px |

### Gap

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `gap-1.5` | 6px | - | - |
| `gap-2` | 8px | - | - |
| `sm:gap-2` | - | 8px | - |
| `sm:gap-3` | - | 12px | - |
| `md:gap-3` | - | - | 12px |
| `md:gap-4` | - | - | 16px |

## Size Reference

### Button Sizes

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Submit Button | 40x40px | 44x44px | 48x48px |
| Icon Inside | 20x20px | 24x24px | 24x24px |
| Quick Category | auto x 32px | auto x 36px | auto x 36px |

### Number Circles

| Screen | Size | Font |
|--------|------|------|
| Mobile | 16x16px | 9px |
| Tablet | 20x20px | 10px |
| Desktop | 24x24px | 12px |
| Large | 28x28px | 14px |

### Loading Dots

| Screen | Size |
|--------|------|
| Mobile | 8x8px |
| Tablet | 10x10px |
| Desktop | 12x12px |

## Border Radius

| Class | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `rounded-lg` | 8px | - | - |
| `sm:rounded-xl` | - | 12px | - |
| `md:rounded-2xl` | - | - | 16px |
| `rounded-2xl` | 16px | - | - |
| `sm:rounded-3xl` | - | 24px | - |

## Line Height

| Class | Value | Use Case |
|-------|-------|----------|
| `leading-snug` | 1.375 | Mobile body text |
| `leading-relaxed` | 1.625 | Tablet+ body text |
| `leading-tight` | 1.25 | Headings, badges |

## Breakpoints

```css
/* Tailwind Default Breakpoints */
sm: 640px   /* Small tablets & large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

## Usage Examples

### Responsive Text
```jsx
// Small to large progression
<p className="text-xs sm:text-sm md:text-base lg:text-lg">
  Content
</p>

// Custom mobile size
<p className="text-[10px] sm:text-xs md:text-sm">
  Small content
</p>
```

### Responsive Padding
```jsx
// Progressive padding
<div className="p-2 sm:p-3 md:p-4 lg:p-6">
  Content
</div>
```

### Responsive Spacing
```jsx
// Progressive spacing
<div className="space-y-2 sm:space-y-3 md:space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Tips

1. **Always start with mobile size** (mobile-first)
2. **Use custom sizes sparingly** (text-[10px])
3. **Keep minimum 10px** for readability
4. **Touch targets minimum 40x40px**
5. **Test on real devices**
6. **Use break-words** for long text
7. **Consistent spacing scale**
8. **Progressive enhancement**

## Accessibility

- ✅ Minimum font size: 10px (mobile)
- ✅ Minimum touch target: 40x40px
- ✅ Proper contrast ratios
- ✅ Readable line heights
- ✅ No text overflow
- ✅ Scalable with zoom

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        posterama: ['Posterama', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'medical-blue': "hsl(var(--medical-blue))",
        'medical-blue-light': "hsl(var(--medical-blue-light))",
        'medical-blue-dark': "hsl(var(--medical-blue-dark))",
        'medical-blue-ultra-light': "hsl(var(--medical-blue-ultra-light))",
        'medical-teal': "hsl(var(--medical-teal))",
        'medical-teal-light': "hsl(var(--medical-teal-light))",
        'medical-teal-dark': "hsl(var(--medical-teal-dark))",
        'luxury-navy': "hsl(var(--luxury-navy))",
        'luxury-navy-light': "hsl(var(--luxury-navy-light))",
        'soft-gray': "hsl(var(--soft-gray))",
        'soft-gray-dark': "hsl(var(--soft-gray-dark))",
        'luxury-gold': "hsl(var(--luxury-gold))",
        'luxury-gold-light': "hsl(var(--luxury-gold-light))",
        'luxury-gold-dark': "hsl(var(--luxury-gold-dark))",
        'premium-silver': "hsl(var(--premium-silver))",
        'premium-silver-light': "hsl(var(--premium-silver-light))",
        'premium-charcoal': "hsl(var(--premium-charcoal))",
        'premium-charcoal-light': "hsl(var(--premium-charcoal-light))",
        'accent-coral': "hsl(var(--accent-coral))",
        'accent-coral-light': "hsl(var(--accent-coral-light))",
        'accent-mint': "hsl(var(--accent-mint))",
        'accent-mint-light': "hsl(var(--accent-mint-light))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "slide-in-right": {
          "0%": { 
            opacity: "0",
            transform: "translateX(50px)" 
          },
          "100%": { 
            opacity: "1",
            transform: "translateX(0)" 
          }
        },
        "slide-in-left": {
          "0%": { 
            opacity: "0",
            transform: "translateX(-50px)" 
          },
          "100%": { 
            opacity: "1",
            transform: "translateX(0)" 
          }
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(var(--primary) / 0.6)" 
          }
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)"
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)"
          },
          "70%": {
            transform: "scale(0.9)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(100px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "rotate-in": {
          "0%": {
            opacity: "0",
            transform: "rotate(-10deg) scale(0.9)"
          },
          "100%": {
            opacity: "1",
            transform: "rotate(0deg) scale(1)"
          }
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "parallax": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50px)" }
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" }
        },
        "morph": {
          "0%, 100%": { borderRadius: "20px" },
          "50%": { borderRadius: "50px" }
        },
        "apple-reveal": {
          "0%": {
            opacity: "0",
            transform: "translateY(60px) scale(0.95)",
            filter: "blur(10px)"
          },
          "50%": {
            opacity: "0.8",
            transform: "translateY(20px) scale(0.98)",
            filter: "blur(2px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0)"
          }
        },
        "apple-scale": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" }
        },
        "apple-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(var(--medical-blue) / 0.2)" 
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(var(--medical-blue) / 0.4), 0 0 80px hsl(var(--medical-teal) / 0.2)" 
          }
        },
        "apple-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-8px) rotate(1deg)" },
          "50%": { transform: "translateY(-12px) rotate(0deg)" },
          "75%": { transform: "translateY(-8px) rotate(-1deg)" }
        },
        "apple-shimmer": {
          "0%": { 
            backgroundPosition: "-200% 0",
            opacity: "0.8"
          },
          "50%": { opacity: "1" },
          "100%": { 
            backgroundPosition: "200% 0",
            opacity: "0.8"
          }
        },
        "apple-morph": {
          "0%, 100%": { 
            borderRadius: "20px",
            transform: "scale(1)"
          },
          "25%": { 
            borderRadius: "30px",
            transform: "scale(1.02)"
          },
          "50%": { 
            borderRadius: "40px",
            transform: "scale(1.05)"
          },
          "75%": { 
            borderRadius: "30px",
            transform: "scale(1.02)"
          }
        },
        "apple-parallax": {
          "0%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.02)" },
          "100%": { transform: "translateY(0) scale(1)" }
        },
        "apple-reveal-stagger": {
          "0%": {
            opacity: "0",
            transform: "translateY(40px) scale(0.9)"
          },
          "60%": {
            opacity: "0.8",
            transform: "translateY(-5px) scale(1.02)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)"
          }
        },
        "apple-magnetic": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(2px, -2px) scale(1.01)" },
          "100%": { transform: "translate(0, 0) scale(1)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "slide-in-right": "slide-in-right 0.7s ease-out",
        "slide-in-left": "slide-in-left 0.7s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "bounce-in": "bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-up": "slide-up 0.6s ease-out",
        "rotate-in": "rotate-in 0.5s ease-out",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "parallax": "parallax 10s linear infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "morph": "morph 8s ease-in-out infinite",
        "apple-reveal": "apple-reveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "apple-scale": "apple-scale 0.6s ease-in-out",
        "apple-glow": "apple-glow 3s ease-in-out infinite",
        "apple-float": "apple-float 6s ease-in-out infinite",
        "apple-shimmer": "apple-shimmer 3s ease-in-out infinite",
        "apple-morph": "apple-morph 8s ease-in-out infinite",
        "apple-parallax": "apple-parallax 10s linear infinite",
        "apple-reveal-stagger": "apple-reveal-stagger 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "apple-magnetic": "apple-magnetic 2s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, require('@tailwindcss/line-clamp')],
} satisfies Config;

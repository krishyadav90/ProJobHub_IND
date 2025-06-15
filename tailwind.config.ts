
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				blob: {
					'0%': {
						transform: 'translate3d(0px, 0px, 0px) scale(1)',
					},
					'33%': {
						transform: 'translate3d(30px, -50px, 0px) scale(1.1)',
					},
					'66%': {
						transform: 'translate3d(-20px, 20px, 0px) scale(0.9)',
					},
					'100%': {
						transform: 'translate3d(0px, 0px, 0px) scale(1)',
					},
				},
				float: {
					'0%, 100%': {
						transform: 'translate3d(0px, 0px, 0px)',
					},
					'50%': {
						transform: 'translate3d(0px, -20px, 0px)',
					},
				},
				'gradient-shift': {
					'0%': {
						'background-position': '0% 50%',
					},
					'50%': {
						'background-position': '100% 50%',
					},
					'100%': {
						'background-position': '0% 50%',
					},
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translate3d(0px, 20px, 0px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translate3d(0px, 0px, 0px)',
					},
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale3d(0.95, 0.95, 1)',
					},
					'100%': {
						opacity: '1',
						transform: 'scale3d(1, 1, 1)',
					},
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translate3d(0px, 30px, 0px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translate3d(0px, 0px, 0px)',
					},
				},
				'pulse-glow': {
					'0%, 100%': {
						'box-shadow': '0 0 20px rgba(59, 130, 246, 0.3)',
					},
					'50%': {
						'box-shadow': '0 0 40px rgba(59, 130, 246, 0.6)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				blob: 'blob 7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				float: 'float 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'gradient-shift': 'gradient-shift 15s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce-smooth': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

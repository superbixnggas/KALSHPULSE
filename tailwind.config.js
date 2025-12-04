/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Dark theme base colors
				background: {
					DEFAULT: '#0a0a0f',
					secondary: '#111118',
					tertiary: '#1a1a24',
				},
				foreground: {
					DEFAULT: '#e5e5e5',
					muted: '#a0a0a0',
					dim: '#6b6b6b',
				},
				// Accent colors
				neon: {
					green: '#00ff88',
					purple: '#8b5cf6',
					blue: '#3b82f6',
				},
				// Status colors
				status: {
					opportunity: '#00ff88',
					balanced: '#fbbf24',
					risk: '#ef4444',
				},
				// UI elements
				border: '#2a2a36',
				card: {
					DEFAULT: '#111118',
					hover: '#1a1a24',
				},
				// Legacy support
				primary: {
					DEFAULT: '#00ff88',
					foreground: '#0a0a0f',
				},
				secondary: {
					DEFAULT: '#8b5cf6',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#1a1a24',
					foreground: '#a0a0a0',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff',
				},
			},
			borderRadius: {
				lg: '0.75rem',
				md: '0.5rem',
				sm: '0.25rem',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			keyframes: {
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(0, 255, 136, 0.3), 0 0 10px rgba(0, 255, 136, 0.1)' 
					},
					'50%': { 
						boxShadow: '0 0 15px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.2)' 
					},
				},
				'data-flow': {
					'0%': { transform: 'translateY(0)', opacity: '0.5' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-100%)', opacity: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' },
				},
			},
			animation: {
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'data-flow': 'data-flow 3s linear infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'glitch': 'glitch 0.5s ease-in-out',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}

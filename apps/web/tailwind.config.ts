import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
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
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)',
  				hover: 'var(--primary-hover)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)',
  				hover: 'var(--secondary-hover)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			},
  			sidebar: {
  				DEFAULT: 'var(--sidebar)',
  				foreground: 'var(--sidebar-foreground)',
  				primary: 'var(--sidebar-primary)',
  				'primary-foreground': 'var(--sidebar-primary-foreground)',
  				accent: 'var(--sidebar-accent)',
  				'accent-foreground': 'var(--sidebar-accent-foreground)',
  				border: 'var(--sidebar-border)',
  				ring: 'var(--sidebar-ring)'
  			}
  		},
  		spacing: {
  			xs: '0.25rem',  // 4px
  			sm: '0.5rem',   // 8px
  			md: '1rem',     // 16px
  			lg: '1.5rem',   // 24px
  			xl: '2rem'      // 32px
  		},
  		borderRadius: {
  			sm: '0.25rem',  // 4px
  			md: '0.5rem',   // 8px
  			lg: '0.75rem',  // 12px
  			full: '9999px'
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
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
  			'fade-in': {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			'fade-out': {
  				from: {
  					opacity: '1'
  				},
  				to: {
  					opacity: '0'
  				}
  			},
  			'slide-in-from-top': {
  				from: {
  					transform: 'translateY(-100%)'
  				},
  				to: {
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in-from-bottom': {
  				from: {
  					transform: 'translateY(100%)'
  				},
  				to: {
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in-from-left': {
  				from: {
  					transform: 'translateX(-100%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-in-from-right': {
  				from: {
  					transform: 'translateX(100%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			'float-delayed': {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-15px)'
  				}
  			},
  			'wiggle': {
  				'0%, 100%': {
  					transform: 'rotate(-3deg)'
  				},
  				'50%': {
  					transform: 'rotate(3deg)'
  				}
  			},
  			'shimmer': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			'construction-build': {
  				'0%': {
  					transform: 'translateY(20px) scale(0.8)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'translateY(-5px) scale(1.05)',
  					opacity: '0.8'
  				},
  				'100%': {
  					transform: 'translateY(0px) scale(1)',
  					opacity: '1'
  				}
  			},
  			'sparkle': {
  				'0%, 100%': {
  					opacity: '0',
  					transform: 'scale(0)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'perth-wave': {
  				'0%': {
  					transform: 'translateX(-100%) scaleX(1)'
  				},
  				'50%': {
  					transform: 'translateX(0%) scaleX(1.2)'
  				},
  				'100%': {
  					transform: 'translateX(100%) scaleX(1)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.15s ease-out',
  			'fade-out': 'fade-out 0.15s ease-out',
  			'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
  			'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
  			'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
  			'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
  			'float': 'float 6s ease-in-out infinite',
  			'float-delayed': 'float-delayed 4s ease-in-out infinite 1s',
  			'wiggle': 'wiggle 1s ease-in-out infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  			'construction-build': 'construction-build 0.6s ease-out forwards',
  			'sparkle': 'sparkle 1.5s ease-in-out infinite',
  			'perth-wave': 'perth-wave 3s ease-in-out infinite'
  		},
  		transitionDuration: {
  			fast: '150ms',
  			normal: '300ms',
  			slow: '500ms'
  		},
  		transitionTimingFunction: {
  			'ease-out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
  			'ease-in-cubic': 'cubic-bezier(0.32, 0, 0.67, 0)'
  		},
  		fontFamily: {
  			sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
  			serif: ['var(--font-serif)', 'Source Serif 4', 'serif'],
  			mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace']
  		},
  		width: {
  			'sidebar-width': 'var(--sidebar-width)',
  			'sidebar-width-icon': 'var(--sidebar-width-icon)',
  		},
  		fontSize: {
  			'2xs': [
  				'0.625rem',
  				{
  					lineHeight: '0.75rem'
  				}
  			],
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'6xl': [
  				'3.75rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'7xl': [
  				'4.5rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		}
  	}
  },
  plugins: [],
}

export default config

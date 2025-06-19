// tailwind.config.js
module.exports = {
  darkMode: ['class', 'class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/domain/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			dimWhite: 'rgba(255, 255, 255, 0.7)',
  			dimBlue: 'rgba(9, 151, 124, 0.1)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			poppins: [
  				'Poppins',
  				'sans-serif'
  			],
  			pretendard: [
  				'Pretendard Variable',
  				'Pretendard',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'system-ui',
  				'Roboto',
  				'Helvetica Neue',
  				'Segoe UI',
  				'Apple SD Gothic Neo',
  				'Noto Sans KR',
  				'Malgun Gothic',
  				'sans-serif'
  			]
  		},
  				borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		backdropBlur: {
			xs: '2px',
			sm: '4px',
			md: '8px',
			lg: '12px',
			xl: '16px',
			'2xl': '24px',
			'3xl': '40px',
		},
		animation: {
			'fade-in-up': 'fadeInUp 0.6s ease-out',
			'fade-in': 'fadeIn 0.6s ease-out',
			'slide-in-left': 'slideInLeft 0.6s ease-out',
			'slide-in-right': 'slideInRight 0.6s ease-out',
			'slideDown': 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
			'slideUp': 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
		},
		keyframes: {
			fadeInUp: {
				'0%': {
					opacity: '0',
					transform: 'translateY(30px)',
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)',
				},
			},
			fadeIn: {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' },
			},
			slideInLeft: {
				'0%': {
					opacity: '0',
					transform: 'translateX(-30px)',
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)',
				},
			},
			slideInRight: {
				'0%': {
					opacity: '0',
					transform: 'translateX(30px)',
				},
				'100%': {
					opacity: '1',
					transform: 'translateX(0)',
				},
			},
			slideDown: {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' },
			},
			slideUp: {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' },
			},
		}
  	},
  	screens: {
  		xs: '480px',
  		ss: '620px',
  		sm: '768px',
  		md: '1060px',
  		lg: '1200px',
  		xl: '1700px'
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

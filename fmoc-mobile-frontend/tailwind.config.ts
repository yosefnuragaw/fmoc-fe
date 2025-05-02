import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				'primary-base': 'var(--primary-base-color)',
				'primary-900': 'var(--primary-900)',
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				'accent-base': 'var(--accent-base)',
				'accent-900': 'var(--accent-900)',
				success: 'var(--success)',
				'success-base': 'var(--success-base)',
				'success-900': 'var(--success-900)',
				warning: 'var(--warning)',
				'warning-base': 'var(--warning-base)',
				'warning-900': 'var(--warning-900)',
				danger: 'var(--danger)',
				'danger-base': 'var(--danger-base)',
				'danger-900': 'var(--danger-900)',
				approved: 'var(--approved)',
				'approved-base': 'var(--approved-base)',
				'neutral-0': 'var(--neutral-0)',
				'neutral-100': 'var(--neutral-100)',
				'neutral-200': 'var(--neutral-200)',
				'neutral-300': 'var(--neutral-300)',
				'neutral-500': 'var(--neutral-500)',
				'neutral-700': 'var(--neutral-700)',
				'neutral-800': 'var(--neutral-800)',
				'neutral-900': 'var(--neutral-900)',
				'neutral-1000': 'var(--neutral-1000)',
				'text-icon-primary': 'var(--text-icon-primary)',
				'text-icon-secondary': 'var(--text-icon-secondary)',
				'text-icon-disabled': 'var(--text-icon-disabled)',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		function (components: { addComponents: (components: Record<string, any>) => void }) {
			const { addComponents } = components;
			addComponents({
				".heading-1, h1": {
					fontSize: "4rem",
					lineHeight: "4rem",
					letterSpacing: "var(--letter-spacing-tight)",
				},
				".heading-2, h2": {
					fontSize: "3rem",
					lineHeight: "3.99rem",
					letterSpacing: "var(--letter-spacing-tight)",
				},
				".heading-3, h3": {
					fontSize: "2.5rem",
					lineHeight: "2.5rem",
					letterSpacing: "var(--letter-spacing-tight)",
				},
				".heading-4, h4": {
					fontSize: "2rem",
					lineHeight: "2rem",
					letterSpacing: "var(--letter-spacing-tight)",
				},
				".heading-5, h5": {
					fontSize: "1.5rem",
					lineHeight: "1.995rem",
					letterSpacing: "var(--letter-spacing-normal)",
				},
				".heading-6, h6": {
					fontSize: "1.25rem",
					lineHeight: "1.875rem",
					letterSpacing: "var(--letter-spacing-normal)",
				},

				".body-1, .body-1-medium": {
					fontSize: "1rem",
					lineHeight: "1.5rem",
					letterSpacing: "var(--letter-spacing-normal)",
				},
				".body-2, .body-2-medium": {
					fontSize: "0.875rem",
					lineHeight: "1.25rem",
					letterSpacing: "var(--letter-spacing-normal)",
				},
				".body-3, .body-3-bold": {
					fontSize: "0.75rem",
					lineHeight: "1.125rem",
					letterSpacing: "var(--letter-spacing-wide)",
				},
				".body-4, .body-4-bold": {
					fontSize: "0.625rem",
					lineHeight: "0.9375rem",
					letterSpacing: "var(--letter-spacing-wide)",
				},

				".truncate": {
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				},
			});
		},
		require("tailwindcss-animate"),
		require("tailwind-scrollbar-hide")
	],
} satisfies Config;
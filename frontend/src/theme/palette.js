import { alpha } from '@mui/material/styles'

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
	0: '#FFFFFF',
	100: '#F9FAFB',
	200: '#F4F6F8',
	300: '#DFE3E8',
	400: '#C4CDD5',
	500: '#919EAB',
	600: '#637381',
	700: '#454F5B',
	800: '#212B36',
	900: '#161C24',
}

export const primary = {
	lighter: '#D4A98F', // Lighter shade of #8B4513
	light: '#B06B3B', // Light shade of #8B4513
	main: '#8B4513', // Base saddle brown color
	dark: '#662F0D', // Dark shade of #8B4513
	darker: '#401D08', // Darker shade of #8B4513
	contrastText: '#FFFFFF',
}

export const secondary = {
	lighter: '#EFD6FF',
	light: '#C684FF',
	main: '#8E33FF',
	dark: '#5119B7',
	darker: '#27097A',
	contrastText: '#FFFFFF',
}

export const info = {
	lighter: '#CAFDF5',
	light: '#61F3F3',
	main: '#00B8D9',
	dark: '#006C9C',
	darker: '#003768',
	contrastText: '#FFFFFF',
}

export const success = {
	lighter: '#C8FAD6',
	light: '#5BE49B',
	main: '#00A76F',
	dark: '#007867',
	darker: '#004B50',
	contrastText: '#FFFFFF',
}

export const warning = {
	lighter: '#FFF5CC',
	light: '#FFD666',
	main: '#FFAB00',
	dark: '#B76E00',
	darker: '#7A4100',
	contrastText: grey[800],
}

export const error = {
	lighter: '#FFE9D5',
	light: '#FFAC82',
	main: '#FF5630',
	dark: '#B71D18',
	darker: '#7A0916',
	contrastText: '#FFFFFF',
}

export const common = {
	black: '#000000',
	white: '#FFFFFF',
}

export const action = {
	hover: alpha(grey[500], 0.08),
	selected: alpha(grey[500], 0.16),
	disabled: alpha(grey[500], 0.8),
	disabledBackground: alpha(grey[500], 0.24),
	focus: alpha(grey[500], 0.24),
	hoverOpacity: 0.08,
	disabledOpacity: 0.48,
}

const base = {
	primary,
	secondary,
	info,
	success,
	warning,
	error,
	grey,
	common,
	divider: alpha(grey[500], 0.2),
	action,
}

// ----------------------------------------------------------------------

export function palette(mode = 'light') {
	const isLight = mode === 'light'

	return {
		...base,
		mode,
		text: {
			primary: isLight ? grey[800] : grey[0],
			secondary: isLight ? grey[600] : grey[400],
			disabled: grey[500],
		},
		background: {
			paper: isLight ? '#FDF5E6' : grey[800],
			default: isLight ? grey[100] : grey[900],
			neutral: isLight ? grey[200] : grey[700],
		},
		action: {
			...base.action,
			active: grey[600],
		},
	}
}

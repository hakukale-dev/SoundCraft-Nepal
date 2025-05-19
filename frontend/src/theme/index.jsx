import { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import CssBaseline from '@mui/material/CssBaseline'
import {
	createTheme,
	ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles'

import { palette } from './palette'
import { shadows } from './shadows'
import { overrides } from './overrides'
import { typography } from './typography'
import { customShadows } from './custom-shadows'
import { adminPalette } from './adminPalette'
// ----------------------------------------------------------------------

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export function useColorMode() {
	const context = useContext(ColorModeContext)
	if (!context) {
		throw new Error('useColorMode must be used within a ThemeProvider')
	}
	return context
}

function AdminThemeProvider({ children }) {
	const [mode, setMode] = useState('light')

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
			},
		}),
		[]
	)

	const memoizedValue = useMemo(
		() => ({
			palette: adminPalette(mode),
			typography,
			shadows: shadows(),
			customShadows: customShadows(),
			shape: { borderRadius: 8 },
			components: {},
		}),
		[mode]
	)

	const theme = createTheme(memoizedValue)

	theme.components = overrides(theme)

	return (
		<ColorModeContext.Provider value={colorMode}>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ColorModeContext.Provider>
	)
}

function ThemeProvider({ children }) {
	const [mode, setMode] = useState('light')

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
			},
			mode,
		}),
		[mode]
	)

	const memoizedValue = useMemo(
		() => ({
			palette: palette(mode),
			typography,
			shadows: shadows(),
			customShadows: customShadows(),
			shape: { borderRadius: 8 },
			components: {},
		}),
		[mode]
	)

	const theme = createTheme(memoizedValue)

	theme.components = overrides(theme)

	return (
		<ColorModeContext.Provider value={colorMode}>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ColorModeContext.Provider>
	)
}

ThemeProvider.propTypes = {
	children: PropTypes.node,
}

AdminThemeProvider.propTypes = {
	children: PropTypes.node,
}

export { ThemeProvider, AdminThemeProvider }

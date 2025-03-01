import { useMemo } from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { adminPalette } from './adminPalette';
// ----------------------------------------------------------------------

function AdminThemeProvider({ children }) {
    const memoizedValue = useMemo(
        () => ({
            palette: adminPalette(),
            typography,
            shadows: shadows(),
            customShadows: customShadows(),
            shape: { borderRadius: 8 },
            components: {},
        }),
        []
    );

    const theme = createTheme(memoizedValue);

    theme.components = overrides(theme);

    return (
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    );
}

function ThemeProvider ( { children } )
{
    const memoizedValue = useMemo(
        () => ( {
            palette: palette(),
            typography,
            shadows: shadows(),
            customShadows: customShadows(),
            shape: { borderRadius: 8 },
            components: {},
        } ),
        []
    );

    const theme = createTheme( memoizedValue );

    theme.components = overrides( theme );
    
    return (
        <MUIThemeProvider theme={ theme }>
            <CssBaseline />
            { children }
        </MUIThemeProvider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

AdminThemeProvider.propTypes = {
    children: PropTypes.node,
};

export { ThemeProvider, AdminThemeProvider };
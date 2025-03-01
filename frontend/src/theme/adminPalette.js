import { alpha } from '@mui/material/styles';

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
};

export const primary = {
    lighter: '#D1E9FC',
    light: '#76B0F1', 
    main: '#2065D1',
    dark: '#103996',
    darker: '#061B64',
    contrastText: '#FFFFFF',
};

export const secondary = {
    lighter: '#D6E4FF',
    light: '#84A9FF',
    main: '#3366FF',
    dark: '#1939B7',
    darker: '#091A7A',
    contrastText: '#FFFFFF',
};

export const info = {
    lighter: '#CAFDF5',
    light: '#61F3F3',
    main: '#00B8D9',
    dark: '#006C9C',
    darker: '#003768',
    contrastText: '#FFFFFF',
};

export const success = {
    lighter: '#E9FCD4',
    light: '#AAF27F',
    main: '#54D62C',
    dark: '#229A16',
    darker: '#08660D',
    contrastText: '#FFFFFF',
};

export const warning = {
    lighter: '#FFF7CD',
    light: '#FFE16A',
    main: '#FFC107',
    dark: '#B78103',
    darker: '#7A4F01',
    contrastText: grey[800],
};

export const error = {
    lighter: '#FFE7D9',
    light: '#FFA48D',
    main: '#FF4842',
    dark: '#B72136',
    darker: '#7A0C2E',
    contrastText: '#FFFFFF',
};

export const common = {
    black: '#000000',
    white: '#FFFFFF',
};

export const action = {
    hover: alpha(grey[500], 0.08),
    selected: alpha(grey[500], 0.16),
    disabled: alpha(grey[500], 0.8),
    disabledBackground: alpha(grey[500], 0.24),
    focus: alpha(grey[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
};

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
};

// ----------------------------------------------------------------------

export function adminPalette() {
    return {
        ...base,
        mode: 'light',
        text: {
            primary: grey[800],
            secondary: grey[600],
            disabled: grey[500],
        },
        background: {
            paper: '#FFFFFF',
            default: '#F9FAFB',
            neutral: grey[200],
        },
        action: {
            ...base.action,
            active: grey[600],
        },
    };
}

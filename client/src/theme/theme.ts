import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

export const theme = createTheme(
  {
    direction: 'rtl',
    typography: {
      fontFamily: '"Assistant", "Arial", sans-serif',
    },
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#9c27b0',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      success: {
        main: '#4caf50',
      },
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  },
  heIL
);

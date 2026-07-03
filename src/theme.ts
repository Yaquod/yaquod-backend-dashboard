import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#0051d5' },
    error: { main: '#ba1a1a' },
    background: { default: '#f7f9fb', paper: '#ffffff' },
    text: { primary: '#191c1e', secondary: '#45464d' },
    divider: '#e0e3e5',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body2: { fontSize: '0.75rem', lineHeight: 1.4 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f7f9fb', fontFamily: '"Inter", sans-serif' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #e0e3e5',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.6875rem' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f2f4f6',
            color: '#45464d',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:hover': { backgroundColor: '#f2f4f680' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e3e5',
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#0051d5' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#2d3133', color: '#e0e3e5' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
  },
});

export default theme;

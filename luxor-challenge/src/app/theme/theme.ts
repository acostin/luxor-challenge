export const theme = {
  // Color palette
  colors: {
    // Primary colors
    primary: {
      main: '#d4af37', // Gold
      light: '#e6c547', // Lighter gold for hover
      dark: '#b8941f', // Darker gold
    },
    // Background colors
    background: {
      main: '#1a1a1a', // Main dark background
      secondary: '#2d2d2d', // Secondary dark background
      tertiary: '#3d3d3d', // Tertiary dark background
      header: '#0f0f0f', // Header background
    },
    // Text colors
    text: {
      primary: '#d4af37', // Gold text
      secondary: '#ccc', // Light gray text
      tertiary: '#999', // Darker gray text
      white: '#ffffff', // White text
      dark: '#1a1a1a', // Dark text for light backgrounds
    },
    // Status colors
    status: {
      success: '#4caf50', // Green for success/accept
      error: '#f44336', // Red for error/reject
      warning: '#ff9800', // Orange for warning
      info: '#2196f3', // Blue for info
    },
    // Border colors
    border: {
      primary: '#444', // Primary border
      secondary: '#555', // Secondary border
      accent: '#d4af37', // Gold accent border
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    fontSize: {
      xs: '0.7rem',
      sm: '0.8rem',
      md: '1rem',
      lg: '1.2rem',
      xl: '1.5rem',
      xxl: '2rem',
    },
  },

  // Spacing
  spacing: {
    xs: 0.5,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },

  // Border radius
  borderRadius: {
    sm: 1,
    md: 2,
    lg: 4,
  },

  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.2)',
    lg: '0 8px 32px rgba(0,0,0,0.3)',
  },

  // Transitions
  transitions: {
    fast: '0.2s',
    medium: '0.3s',
    slow: '0.5s',
  },

  // Component-specific styles
  components: {
    // Header styles
    header: {
      backgroundColor: '#2d2d2d',
      color: '#d4af37',
      boxShadow: 3,
      minHeight: 56,
    },

    // Table styles
    table: {
      header: {
        backgroundColor: '#0f0f0f',
        color: '#d4af37',
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '3px solid #d4af37',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#1a1a1a',
        },
      },
      row: {
        backgroundColor: '#2d2d2d',
        '&:hover': {
          backgroundColor: '#3d3d3d',
        },
      },
      cell: {
        borderBottom: '1px solid #444',
        padding: '12px 16px',
      },
      bidRow: {
        backgroundColor: '#3d3d3d',
      },
      bidCell: {
        padding: '8px 16px',
        borderBottom: '1px solid #555',
      },
      loadingCell: {
        padding: '32px 16px',
        backgroundColor: '#2d2d2d',
      },
      emptyCell: {
        padding: '24px 16px',
        backgroundColor: '#3d3d3d',
      },
    },

    // Button styles
    button: {
      primary: {
        backgroundColor: '#d4af37',
        color: '#1a1a1a',
        '&:hover': {
          backgroundColor: '#e6c547',
        },
      },
      secondary: {
        borderColor: '#d4af37',
        color: '#d4af37',
        '&:hover': {
          borderColor: '#e6c547',
          color: '#e6c547',
        },
      },
      text: {
        color: '#ccc',
      },
      icon: {
        padding: '4px',
        color: '#d4af37',
        '&:hover': {
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
        },
      },
      danger: {
        color: '#f44336',
        '&:hover': {
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
        },
      },
      success: {
        color: '#4caf50',
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
        },
      },
    },

    // Input styles
    input: {
      color: '#d4af37',
      borderColor: '#d4af37',
      '&:hover': {
        borderColor: '#e6c547',
      },
      '&.Mui-focused': {
        borderColor: '#d4af37',
      },
      label: {
        color: '#d4af37',
      },
      helperText: {
        color: '#ff6b6b',
      },
    },

    // Chip styles
    chip: {
      pending: {
        backgroundColor: '#d4af37',
        color: '#1a1a1a',
      },
      accepted: {
        backgroundColor: '#4caf50',
        color: '#ffffff',
      },
      rejected: {
        backgroundColor: '#f44336',
        color: '#ffffff',
      },
      bidCount: {
        backgroundColor: '#d4af37',
        color: '#1a1a1a',
        height: 24,
        fontSize: '0.8rem',
        fontWeight: 600,
      },
      stock: {
        height: 24,
        fontSize: '0.8rem',
        fontWeight: 600,
      },
    },

    // Dialog styles
    dialog: {
      backgroundColor: '#2d2d2d',
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      title: {
        backgroundColor: '#1a1a1a',
        color: '#d4af37',
        borderBottom: '2px solid #d4af37',
      },
      content: {
        backgroundColor: '#2d2d2d',
      },
      actions: {
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid #444',
      },
    },

    // Paper styles
    paper: {
      backgroundColor: '#1a1a1a',
      borderRadius: 2,
      border: '1px solid #444',
      stats: {
        padding: '16px',
        flex: 1,
        textAlign: 'center',
        backgroundColor: '#2d2d2d',
      },
      modal: {
        padding: '24px',
        backgroundColor: '#1a1a1a',
        borderRadius: 2,
        border: '1px solid #444',
      },
    },

    // Icon styles
    icon: {
      color: '#d4af37',
      fontSize: 20,
      small: {
        fontSize: 16,
        marginRight: '4px',
      },
      medium: {
        fontSize: 18,
      },
      large: {
        fontSize: 24,
      },
    },

    // Pagination styles
    pagination: {
      backgroundColor: '#0f0f0f',
      color: '#d4af37',
      selectLabel: {
        color: '#d4af37',
        fontWeight: 500,
      },
      select: {
        color: '#d4af37',
        '& .MuiSvgIcon-root': {
          color: '#d4af37',
        },
      },
      actions: {
        '& .MuiIconButton-root': {
          color: '#d4af37',
          '&:disabled': {
            color: '#666',
          },
        },
      },
    },

    // Snackbar styles
    snackbar: {
      success: {
        backgroundColor: '#2d5a2d',
        color: '#ffffff',
      },
      error: {
        backgroundColor: '#5a2d2d',
        color: '#ffffff',
      },
      info: {
        backgroundColor: '#2d4a5a',
        color: '#ffffff',
      },
    },

    // Typography styles
    typography: {
      heading: {
        fontWeight: 600,
        color: '#d4af37',
      },
      body: {
        color: '#ccc',
      },
      price: {
        fontWeight: 700,
        color: '#4caf50',
      },
      owner: {
        fontWeight: 500,
        color: '#d4af37',
      },
      description: {
        color: '#ccc',
        maxWidth: 200,
      },
    },

    // Layout styles
    layout: {
      container: {
        paddingY: 2,
      },
      statsContainer: {
        display: 'flex',
        gap: 2,
        marginBottom: 3,
      },
      headerContainer: {
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        paddingX: 2,
      },
      formControl: {
        minWidth: 180,
        marginRight: 2,
      },
    },
  },
};

// Helper functions for common style patterns
export const styleHelpers = {
  // Get status color for chips
  getStatusColor: (status: string) => {
    switch (status) {
      case 'accepted': return theme.colors.status.success;
      case 'rejected': return theme.colors.status.error;
      default: return theme.colors.primary.main;
    }
  },

  // Get stock color based on quantity
  getStockColor: (stocks: number) => {
    if (stocks > 50) return theme.colors.status.success;
    if (stocks > 20) return theme.colors.status.warning;
    return theme.colors.status.error;
  },

  // Get snackbar background color
  getSnackbarColor: (severity: string) => {
    switch (severity) {
      case 'success': return theme.components.snackbar.success.backgroundColor;
      case 'error': return theme.components.snackbar.error.backgroundColor;
      case 'info': return theme.components.snackbar.info.backgroundColor;
      default: return theme.components.snackbar.info.backgroundColor;
    }
  },

  // Common input styles
  getInputStyles: () => ({
    color: theme.colors.primary.main,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colors.primary.main,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colors.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colors.primary.main,
    },
  }),

  // Common button styles
  getButtonStyles: (variant: 'primary' | 'secondary' | 'text' | 'icon' | 'danger' | 'success' = 'primary') => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary.main,
          color: theme.colors.text.dark,
          '&:hover': {
            backgroundColor: theme.colors.primary.light,
          },
        };
      case 'secondary':
        return {
          borderColor: theme.colors.primary.main,
          color: theme.colors.primary.main,
          '&:hover': {
            borderColor: theme.colors.primary.light,
            color: theme.colors.primary.light,
          },
        };
      case 'text':
        return {
          color: theme.colors.text.secondary,
        };
      case 'icon':
        return theme.components.button.icon;
      case 'danger':
        return theme.components.button.danger;
      case 'success':
        return theme.components.button.success;
      default:
        return {};
    }
  },

  // Common table header styles
  getTableHeaderStyles: () => ({
    fontWeight: theme.typography.fontWeight.bold,
    backgroundColor: theme.colors.background.header,
    color: theme.colors.primary.main,
    cursor: 'pointer',
    borderBottom: `3px solid ${theme.colors.primary.main}`,
    fontSize: theme.typography.fontSize.md,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '&:hover': {
      backgroundColor: theme.colors.background.main,
    },
  }),

  // Common table row styles
  getTableRowStyles: () => ({
    backgroundColor: theme.colors.background.secondary,
    '&:hover': {
      backgroundColor: theme.colors.background.tertiary,
    },
  }),

  // Common table cell styles
  getTableCellStyles: () => ({
    borderBottom: `1px solid ${theme.colors.border.primary}`,
    padding: `${theme.spacing.sm * 6}px ${theme.spacing.sm * 8}px`,
  }),

  // Bid row styles
  getBidRowStyles: () => theme.components.table.bidRow,

  // Bid cell styles
  getBidCellStyles: () => theme.components.table.bidCell,

  // Loading cell styles
  getLoadingCellStyles: () => theme.components.table.loadingCell,

  // Empty cell styles
  getEmptyCellStyles: () => theme.components.table.emptyCell,

  // Chip styles
  getChipStyles: (type: 'bidCount' | 'stock' | 'status' = 'bidCount') => {
    switch (type) {
      case 'bidCount':
        return theme.components.chip.bidCount;
      case 'stock':
        return theme.components.chip.stock;
      case 'status':
        return theme.components.chip.pending;
      default:
        return {};
    }
  },

  // Typography styles
  getTypographyStyles: (type: 'heading' | 'body' | 'price' | 'owner' | 'description' = 'body') => {
    switch (type) {
      case 'heading':
        return theme.components.typography.heading;
      case 'body':
        return theme.components.typography.body;
      case 'price':
        return theme.components.typography.price;
      case 'owner':
        return theme.components.typography.owner;
      case 'description':
        return theme.components.typography.description;
      default:
        return {};
    }
  },

  // Icon styles
  getIconStyles: (size: 'small' | 'medium' | 'large' = 'medium') => {
    switch (size) {
      case 'small':
        return theme.components.icon.small;
      case 'medium':
        return theme.components.icon.medium;
      case 'large':
        return theme.components.icon.large;
      default:
        return theme.components.icon;
    }
  },
};

export default theme; 
export const CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '201862446765-q3gtt6b82gbqb82fj9o428mdmrcsfg41.apps.googleusercontent.com',
  SHEET_ID: import.meta.env.VITE_SHEET_ID || '1tbbgQX33uOrCZ2LobYB2tq758iUmlppInMUjPydB_Ho',
  SHEETS: {
    LUXURY:        'Inventory',
    LOCAL:         'Local Inventory',
    LUXURY_PAYOUT: 'Payout Log',
    LOCAL_PAYOUT:  'Local Payout Log',
    CONSIGNORS:    'Consignors',
  },
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
  DATA_START_ROW: 4,
}

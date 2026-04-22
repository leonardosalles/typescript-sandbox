import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Alert } from "../../types";
import { api } from "../../services/api";
import type { RootState } from "../store";

interface AlertsState {
  items: Alert[];
  loading: boolean;
  error: string | null;
}

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await api.alerts.getAll();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch alerts"
      );
    }
  }
);

const alertsSlice = createSlice({
  name: "alerts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  } as AlertsState,
  reducers: {
    dismissAlert(state, action) {
      const alert = state.items.find((a) => a.id === action.payload);
      if (alert) alert.resolved = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { dismissAlert } = alertsSlice.actions;
export default alertsSlice.reducer;

export const alertsSelectors = {
  selectAll: (state: RootState) => state.alerts.items,
  selectActive: (state: RootState) =>
    state.alerts.items.filter((a) => !a.resolved),
  selectLoading: (state: RootState) => state.alerts.loading,
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardSummary } from "../../types";
import { api } from "../../services/api";
import type { RootState } from "../store";

interface SummaryState {
  data: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export const fetchSummary = createAsyncThunk(
  "summary/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await api.summary.get();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch summary"
      );
    }
  }
);

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  } as SummaryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default summarySlice.reducer;

export const summarySelectors = {
  selectData: (state: RootState) => state.summary.data,
  selectLoading: (state: RootState) => state.summary.loading,
  selectLastUpdated: (state: RootState) => state.summary.lastUpdated,
};

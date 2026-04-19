import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Server, ServerStatus } from "../../types";
import { api } from "../../services/api";
import type { RootState } from "../store";

const serversAdapter = createEntityAdapter<Server>();

interface ServersExtraState {
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  selectedServerId: string | null;
  filters: {
    status: ServerStatus | "all";
    environment: "production" | "staging" | "development" | "all";
    region: string | "all";
  };
  pollingActive: boolean;
}

export const fetchServers = createAsyncThunk(
  "servers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await api.servers.getAll();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch servers",
      );
    }
  },
);

export const fetchServerById = createAsyncThunk(
  "servers/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await api.servers.getById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : `Failed to fetch server ${id}`,
      );
    }
  },
);

const initialState = serversAdapter.getInitialState<ServersExtraState>({
  loading: false,
  error: null,
  lastFetched: null,
  selectedServerId: null,
  filters: {
    status: "all",
    environment: "all",
    region: "all",
  },
  pollingActive: false,
});

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    selectServer(state, action: PayloadAction<string | null>) {
      state.selectedServerId = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<ServerStatus | "all">) {
      state.filters.status = action.payload;
    },
    setEnvironmentFilter(
      state,
      action: PayloadAction<"production" | "staging" | "development" | "all">,
    ) {
      state.filters.environment = action.payload;
    },
    setRegionFilter(state, action: PayloadAction<string>) {
      state.filters.region = action.payload;
    },
    setPollingActive(state, action: PayloadAction<boolean>) {
      state.pollingActive = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServers.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetched = new Date().toISOString();
        serversAdapter.setAll(state, action.payload);
      })
      .addCase(fetchServers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServerById.fulfilled, (state, action) => {
        serversAdapter.upsertOne(state, action.payload);
      });
  },
});

export const {
  selectServer,
  setStatusFilter,
  setEnvironmentFilter,
  setRegionFilter,
  setPollingActive,
  clearError,
} = serversSlice.actions;

export default serversSlice.reducer;

const baseSelectors = serversAdapter.getSelectors<RootState>(
  (state) => state.servers,
);

export const serversSelectors = {
  selectAll: baseSelectors.selectAll,
  selectById: baseSelectors.selectById,
  selectIds: baseSelectors.selectIds,
  selectTotal: baseSelectors.selectTotal,

  selectFiltered: (state: RootState): Server[] => {
    const all = baseSelectors.selectAll(state);
    const { status, environment, region } = state.servers.filters;

    return all.filter((server) => {
      if (status !== "all" && server.status !== status) return false;
      if (environment !== "all" && server.environment !== environment)
        return false;
      if (region !== "all" && server.region !== region) return false;
      return true;
    });
  },

  selectSelectedServer: (state: RootState): Server | undefined => {
    const id = state.servers.selectedServerId;
    return id ? baseSelectors.selectById(state, id) : undefined;
  },

  selectLoading: (state: RootState) => state.servers.loading,
  selectError: (state: RootState) => state.servers.error,
  selectLastFetched: (state: RootState) => state.servers.lastFetched,
  selectFilters: (state: RootState) => state.servers.filters,
  selectPollingActive: (state: RootState) => state.servers.pollingActive,
};

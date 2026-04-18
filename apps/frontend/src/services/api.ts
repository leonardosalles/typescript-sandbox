import type { Server, Alert, DashboardSummary, ApiResponse } from "../types";

const BASE_URL = "http://localhost:3001/api/v1";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message ?? `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  servers: {
    getAll: () =>
      apiFetch<ApiResponse<Server[]>>("/servers").then((r) => r.data),

    getById: (id: string) =>
      apiFetch<ApiResponse<Server>>(`/servers/${id}`).then((r) => r.data),

    getByRegion: (region: string) =>
      apiFetch<ApiResponse<Server[]>>(`/servers/region/${region}`).then(
        (r) => r.data,
      ),
  },

  alerts: {
    getAll: () => apiFetch<ApiResponse<Alert[]>>("/alerts").then((r) => r.data),

    getActive: () =>
      apiFetch<ApiResponse<Alert[]>>("/alerts?resolved=false").then(
        (r) => r.data,
      ),
  },

  summary: {
    get: () =>
      apiFetch<{ data: DashboardSummary; timestamp: string }>("/summary").then(
        (r) => r.data,
      ),
  },
};

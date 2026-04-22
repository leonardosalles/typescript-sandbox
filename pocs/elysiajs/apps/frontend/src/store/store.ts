import { configureStore } from "@reduxjs/toolkit";
import serversReducer from "./slices/serversSlice";
import alertsReducer from "./slices/alertsSlice";
import summaryReducer from "./slices/summarySlice";

export const store = configureStore({
  reducer: {
    servers: serversReducer,
    alerts: alertsReducer,
    summary: summaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["servers/fetchAll/fulfilled"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

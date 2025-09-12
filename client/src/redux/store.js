import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage
import { combineReducers } from "redux";
import authReducer from "./authSlice"; // ✅ Now valid because of default export

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ only persist auth state
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Wrap root reducer with persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Required for redux-persist
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);

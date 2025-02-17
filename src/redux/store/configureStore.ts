import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import newsReducer from "../slice/newsSlice";
import searchReducer from "../slice/filterNewsSlice";

// Combine your reducers
const rootReducer = combineReducers({
  news: newsReducer,
  search: searchReducer,
});

// Configure persistence; whitelist the "search" slice (adjust if needed)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["search"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// Create a persistor instance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

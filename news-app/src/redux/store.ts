import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./articleSlice";

const store = configureStore({
  reducer: {
    articles: articleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../../utils/api";

interface Article {
  id: number;
  title: string;
  active: boolean;
  created_date: string;
  updated_date: string;
  views: number;
}

interface ArticleState {
  articles: Article[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  status: "idle",
  error: null,
};

export const fetchArticles = createAsyncThunk<Article[]>(
  "articles/fetchArticles",
  async () => {
    const response = await apiFetch("/api/articles/all/", "GET");
    return response;
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default articleSlice.reducer;

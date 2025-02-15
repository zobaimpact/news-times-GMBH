import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for news articles
export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Define the state type
export interface newsState {
  articles: NewsArticle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state with proper typing
const initialState: newsState = {
  articles: [],
  status: "idle",
  error: null,
};

const API_KEY = "82fdb1f391db40b28e8b0e7c5a17b05a"; 
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

// Define the async thunk to fetch news
export const fetchNews = createAsyncThunk<NewsArticle[], void, { rejectValue: string }>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(NEWS_API_URL);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch news");
      }
      const data = await response.json();
      return data.articles as NewsArticle[]; // Type-casting the API response
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

// Define the news slice with proper typings
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default newsSlice.reducer;

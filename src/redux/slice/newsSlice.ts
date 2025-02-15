import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for news articles
export interface NewsArticle {
  source?: { id: string | null; name: string };
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null; // Used by NewsAPI & Guardian
  multimedia?: { url: string }[]; // Used by NYT API
  publishedAt?: string; // Used by NewsAPI & normalized Guardian
  published_date?: string; // Used by NYT API
  byline?: string; // Used by NYT API
}

// Define the state type
export interface NewsState {
  articles: NewsArticle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state with proper typing
const initialState: NewsState = {
  articles: [],
  status: "idle",
  error: null,
};

const API_KEY = "82fdb1f391db40b28e8b0e7c5a17b05a"; 
const API_KEY2 = "5YG3TMerX8C874K6zOWTubPQutqm75ok"; 
const GUARDIAN_API_KEY = "f4b554fb-ec83-4a2f-876d-0558ebeb063a"; 

const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const NEW_YORK_TIMES_API_URL = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY2}`;
const GUARDIAN_API_URL = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,trailText`;

// Fetch NewsAPI Articles
export const fetchNewsApi = createAsyncThunk<NewsArticle[], void, { rejectValue: string }>(
  "news/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(NEWS_API_URL);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch news");
      }
      const data = await response.json();
      
      const formattedArticles: NewsArticle[] = data.articles.map((article: any) => ({
        ...article,
        urlToImage: article.urlToImage || "https://via.placeholder.com/150",
      }));

      return formattedArticles;
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

// Fetch New York Times Articles
export const fetchNewYorkTimes = createAsyncThunk<NewsArticle[], void, { rejectValue: string }>(
  "news/fetchNewYorkTimes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(NEW_YORK_TIMES_API_URL);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch New York Times news");
      }
      const data = await response.json();

      // Normalize NYT response format
      const formattedArticles: NewsArticle[] = data.results.map((article: any) => ({
        title: article.title,
        url: article.url,
        description: article.abstract || null,
        byline: article.byline || null,
        publishedAt: article.published_date || null,
        urlToImage: article.multimedia?.[0]?.url || "https://via.placeholder.com/150",
      }));

      return formattedArticles;
    } catch (error) {
      return rejectWithValue("Something went wrong while fetching NYT news");
    }
  }
);

// Fetch The Guardian Articles
export const fetchGuardian = createAsyncThunk<NewsArticle[], void, { rejectValue: string }>(
  "news/fetchGuardian",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(GUARDIAN_API_URL);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch Guardian news");
      }
      const data = await response.json();

      // Normalize Guardian response format
      const formattedArticles: NewsArticle[] = data.response.results.map((article: any) => ({
        title: article.webTitle,
        url: article.webUrl,
        description: article.fields?.trailText || null,
        author: null, // The Guardian API may not provide author info by default
        publishedAt: article.webPublicationDate || null,
        urlToImage: article.fields?.thumbnail || "https://via.placeholder.com/150",
      }));

      return formattedArticles;
    } catch (error) {
      return rejectWithValue("Something went wrong while fetching Guardian news");
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
      // NewsAPI Cases
      .addCase(fetchNewsApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewsApi.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchNewsApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })
      // New York Times Cases
      .addCase(fetchNewYorkTimes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewYorkTimes.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchNewYorkTimes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })
      // The Guardian Cases
      .addCase(fetchGuardian.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGuardian.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchGuardian.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default newsSlice.reducer;

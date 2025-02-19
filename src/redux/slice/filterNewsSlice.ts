import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Define the types for news articles
export interface NewsArticle {
  source?: { id: string | null; name: string };
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  multimedia?: { url: string }[];
  publishedAt?: string;
  published_date?: string;
  byline?: string;
}

// Define filter parameters for article search and filtering (using a single date)
export interface Filters {
  keyword: string;
  date: string | null;
  category: string | null;
  source: string | null;
  author?: string | null;
}

// Define the slice state for search news
export interface SearchNewsState {
  searchResult: NewsArticle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: SearchNewsState = {
  searchResult: [],
  status: "idle",
  error: null,
};

// API keys and endpoints for each news source
// NOTE: Below API KEYS should be in the .env file in real world application
const NYT_API_ENDPOINT =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
const NYT_API_KEY = "api-key=5YG3TMerX8C874K6zOWTubPQutqm75ok";

const NEWSAPI_ENDPOINT = "https://newsapi.org/v2/everything?";
const NEWSAPI_API_KEY = "apiKey=82fdb1f391db40b28e8b0e7c5a17b05a";

const GUARDIAN_API_ENDPOINT = "https://content.guardianapis.com/search?";
const GUARDIAN_API_KEY = "api-key=f4b554fb-ec83-4a2f-876d-0558ebeb063a";

// Define a unified async thunk to search news based on the supplied filters and news source.
export const searchNews = createAsyncThunk<
  NewsArticle[],
  { source: "nyt" | "newsapi" | "guardian"; filters: Partial<Filters> },
  { rejectValue: string }
>("searchNews/searchNews", async ({ source, filters }, { rejectWithValue }) => {
  let url = "";
  try {
    switch (source) {
      case "nyt": {
        // Build query parameters for New York Times
        const params = new URLSearchParams();
        if (filters.keyword) params.append("q", filters.keyword);
        if (filters.date) {
          // NYT expects date in YYYYMMDD format
          const d = new Date(filters.date);
          const yyyy = d.getFullYear();
          const mm = (d.getMonth() + 1).toString().padStart(2, "0");
          const dd = d.getDate().toString().padStart(2, "0");
          params.append("begin_date", `${yyyy}${mm}${dd}`);
        }
        if (filters.category) {
          // Filter by section name
          params.append("fq", `section_name:("${filters.category}")`);
        }
        if (filters.author) {
          // Filter by author (byline)
          const existingFq = params.get("fq");
          const authorFq = `byline:("${filters.author}")`;
          params.set(
            "fq",
            existingFq ? `${existingFq} AND ${authorFq}` : authorFq
          );
        }
        url = `${NYT_API_ENDPOINT}${params.toString()}&${NYT_API_KEY}`;
        break;
      }
      case "newsapi": {
        // Build query parameters for News API
        const params = new URLSearchParams();
        if (filters.keyword) params.append("q", filters.keyword);
        if (filters.date) params.append("from", filters.date);
        if (filters.category) params.append("category", filters.category);
        if (filters.source) params.append("sources", filters.source);
        // Note: News API does not support direct filtering by author.
        url = `${NEWSAPI_ENDPOINT}${params.toString()}&${NEWSAPI_API_KEY}`;
        break;
      }
      case "guardian": {
        // Build query parameters for The Guardian
        const params = new URLSearchParams();
        if (filters.keyword) params.append("q", filters.keyword);
        if (filters.date) {
          params.append("from-date", filters.date);
          params.append("to-date", filters.date);
        }
        if (filters.category) params.append("section", filters.category);
        // Guardian API doesn't support author filtering directly; add author as additional query
        if (filters.author) params.append("q", filters.author);
        // Include additional fields
        params.append("show-fields", "thumbnail,trailText");
        url = `${GUARDIAN_API_ENDPOINT}${params.toString()}&${GUARDIAN_API_KEY}`;
        break;
      }
      default:
        return rejectWithValue("Unsupported news source");
    }

    const response = await fetch(url);
    if (!response.ok) {
      toast.error("Failed to fetch search results");
      return rejectWithValue("Failed to fetch search results");
    }
    const data = await response.json();
    let formattedArticles: NewsArticle[] = [];

    // Format the results based on the source
    switch (source) {
      case "nyt":
        formattedArticles = data.response.docs.map((doc: any) => ({
          title: doc.headline.main,
          url: doc.web_url,
          description: doc.abstract,
          author:
            doc.byline && doc.byline.original ? doc.byline.original : null,
          publishedAt: doc.pub_date,
          urlToImage:
            doc.multimedia && doc.multimedia.length > 0
              ? `https://www.nytimes.com/${doc.multimedia[0].url}`
              : "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
        }));
        break;
      case "newsapi":
        formattedArticles = data.articles.map((article: any) => ({
          ...article,
          urlToImage: article.urlToImage || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
        }));
        break;
      case "guardian":
        formattedArticles = data.response.results.map((article: any) => ({
          title: article.webTitle,
          url: article.webUrl,
          description: article.fields?.trailText || null,
          author: null,
          publishedAt: article.webPublicationDate,
          urlToImage:
            article.fields?.thumbnail || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
        }));
        break;
    }
    return formattedArticles;
  } catch (error) {
    return rejectWithValue(
      "Something went wrong while fetching search results"
    );
  }
});

const searchNewsSlice = createSlice({
  name: "searchNews",
  initialState,
  reducers: {
    // Optional reducers can be added here if needed.
    clearSearchResults(state) {
      state.searchResult = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        searchNews.fulfilled,
        (state, action: PayloadAction<NewsArticle[]>) => {
          state.status = "succeeded";
          state.searchResult = action.payload;
        }
      )
      .addCase(searchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSearchResults } = searchNewsSlice.actions;
export default searchNewsSlice.reducer;

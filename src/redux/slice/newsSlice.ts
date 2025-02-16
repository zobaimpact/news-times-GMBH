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

// Define filter parameters for article search and filtering (using a single date)
export interface Filters {
  keyword: string;
  date: string | null;
  category: string | null;
  source: string | null;
}

// Define user preferences for a personalized news feed
export interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

// Extend the state to include filters and preferences
export interface NewsState {
  articles: NewsArticle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: Filters;
  preferences: Preferences;
}

// Initial state with proper typing
const initialState: NewsState = {
  articles: [],
  status: "idle",
  error: null,
  filters: {
    keyword: "",
    date: null,
    category: null,
    source: null,
  },
  preferences: {
    sources: [],
    categories: [],
    authors: [],
  },
};

const NY_API_KEY = "82fdb1f391db40b28e8b0e7c5a17b05a"; 
const NEWS_API_KEY = "5YG3TMerX8C874K6zOWTubPQutqm75ok"; 
const GUARDIAN_API_KEY = "f4b554fb-ec83-4a2f-876d-0558ebeb063a"; 

const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NY_API_KEY}`;
const NEW_YORK_TIMES_API_URL = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${NEWS_API_KEY}`;
const GUARDIAN_API_URL = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=thumbnail,trailText`;

/**
 * Helper function to filter articles based on the provided filters.
 * - Keyword: Checks if the keyword exists in the title or description (case-insensitive).
 * - Date: Compares the article's published date (using publishedAt or published_date) with the filter date.
 * - Category & Source: Matches using case-insensitive substring checks.
 */
function filterArticles(
  articles: NewsArticle[],
  filters: Partial<Filters>
): NewsArticle[] {
  return articles.filter((article) => {
    let matches = true;

    // Keyword filter
    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase();
      const title = article.title.toLowerCase();
      const description = article.description ? article.description.toLowerCase() : "";
      if (!title.includes(lowerKeyword) && !description.includes(lowerKeyword)) {
        matches = false;
      }
    }

    // Date filter (assuming filtering by articles published on the specific date)
    if (filters.date) {
      const articleDate = new Date(
        article.publishedAt || article.published_date || ""
      ).toDateString();
      const filterDate = new Date(filters.date).toDateString();
      if (articleDate !== filterDate) {
        matches = false;
      }
    }

    // Category filter (assuming article may contain a 'category' property)
    if (filters.category) {
      const articleCategory = ((article as any).category || "").toLowerCase();
      if (!articleCategory.includes(filters.category.toLowerCase())) {
        matches = false;
      }
    }

    // Source filter
    if (filters.source) {
      const articleSource = article.source?.name.toLowerCase() || "";
      if (!articleSource.includes(filters.source.toLowerCase())) {
        matches = false;
      }
    }

    return matches;
  });
}

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
        urlToImage: article.urlToImage || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
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
        urlToImage: article.multimedia?.[0]?.url || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
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
        urlToImage: article.fields?.thumbnail || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
      }));

      return formattedArticles;
    } catch (error) {
      return rejectWithValue("Something went wrong while fetching Guardian news");
    }
  }
);

// Search articles with filters (client-side filtering)
export const searchArticles = createAsyncThunk<
  NewsArticle[],
  Partial<Filters>,
  { rejectValue: string }
>(
  "news/searchArticles",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await fetch(NEWS_API_URL);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch articles");
      }
      const data = await response.json();
      const allArticles: NewsArticle[] = data.articles.map((article: any) => ({
        ...article,
        urlToImage: article.urlToImage || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
      }));

      const filteredArticles = filterArticles(allArticles, filters);
      return filteredArticles;
    } catch (error) {
      return rejectWithValue("Something went wrong while fetching search results");
    }
  }
);

// Fetch personalized news based on user preferences (client-side filtering)
export const fetchPersonalizedNews = createAsyncThunk<
  NewsArticle[],
  void,
  { state: { news: NewsState }, rejectValue: string }
>(
  "news/fetchPersonalizedNews",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(NEWS_API_URL);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch articles");
      }
      const data = await response.json();
      const allArticles: NewsArticle[] = data.articles.map((article: any) => ({
        ...article,
        urlToImage: article.urlToImage || "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk",
      }));

      const { preferences } = getState().news;
      const filteredArticles = allArticles.filter((article) => {
        let matches = true;
        // Filter by preferred sources
        if (preferences.sources.length > 0) {
          const articleSource = article.source?.name.toLowerCase() || "";
          if (!preferences.sources.some((pref) => articleSource.includes(pref.toLowerCase()))) {
            matches = false;
          }
        }
        // Filter by preferred categories (assuming article has a 'category' property)
        if (preferences.categories.length > 0) {
          const articleCategory = ((article as any).category || "").toLowerCase();
          if (!preferences.categories.some((pref) => articleCategory.includes(pref.toLowerCase()))) {
            matches = false;
          }
        }
        // Filter by preferred authors
        if (preferences.authors.length > 0) {
          const articleAuthor = (article.author || "").toLowerCase();
          if (!preferences.authors.some((pref) => articleAuthor.includes(pref.toLowerCase()))) {
            matches = false;
          }
        }
        return matches;
      });
      return filteredArticles;
    } catch (error) {
      return rejectWithValue("Something went wrong while fetching personalized news");
    }
  }
);

// Define the news slice with proper typings
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    // Update search filters
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
    },
    // Update user preferences for personalized feed
    setPreferences(state, action: PayloadAction<Preferences>) {
      state.preferences = action.payload;
    },
  },
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
      })
      // Search Articles Cases
      .addCase(searchArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchArticles.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })
      // Personalized News Cases
      .addCase(fetchPersonalizedNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPersonalizedNews.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "succeeded";
        state.articles = action.payload;
      })
      .addCase(fetchPersonalizedNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { setFilters, setPreferences } = newsSlice.actions;
export default newsSlice.reducer;

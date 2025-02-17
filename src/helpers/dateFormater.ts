import { NewsArticle } from "../redux/slice/newsSlice";

export const formatPublishedDate = (article: NewsArticle): string => {
  if (article.publishedAt) {
    return new Date(article.publishedAt).toLocaleDateString();
  }
  if (article.published_date) {
    return new Date(article.published_date).toLocaleDateString();
  }
  return "Unknown date";
};

import { NewsArticle } from "../redux/slice/newsSlice";

const DEFAULT_IMAGE = "https://unsplash.com/photos/man-sitting-on-bench-reading-newspaper-_Zua2hyvTBk";

export const getImageSrc = (article: NewsArticle): string => {
  return article.urlToImage || DEFAULT_IMAGE;
};

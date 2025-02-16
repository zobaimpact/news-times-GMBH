import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/configureStore";
import { fetchNewsApi } from "../../../redux/slice/newsSlice";
import Card from "../../Card";
import { Loader } from "../../Loader";
import NewsFilter from "../../Filters";

const NewsApi: React.FC = () => {
  // Use the typed dispatch for Redux actions
  const dispatch = useDispatch<AppDispatch>();

  // Retrieve news articles, status, and error from the Redux store.
  const { articles, status, error } = useSelector(
    (state: RootState) => state.news
  );

  // On component mount, fetch initial articles from the News API.
  useEffect(() => {
    dispatch(fetchNewsApi());
  }, [dispatch]);

  return (
    <div className="columns-2xs">
      {articles && <NewsFilter source="newsapi" />}
      {/* Display loader, error, or the news cards based on the current state */}
      {status === "loading" && <Loader />}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && articles && <Card news={articles} />}
    </div>
  );
};

export default NewsApi;

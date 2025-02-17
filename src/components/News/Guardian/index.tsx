import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/configureStore";
import { fetchGuardian } from "../../../redux/slice/newsSlice";
import Card from "../../Card";
import { Loader } from "../../Loader";
import NewsFilter from "../../Filters";

const TheGuardian: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Access articles, loading status, and any error from Redux.
  const { articles, status, error } = useSelector(
    (state: RootState) => state.news
  );

  // Fetch initial Guardian articles on mount.
  useEffect(() => {
    dispatch(fetchGuardian());
  }, [dispatch]);

  return (
    <div aria-labelledby="guardian-news">
      <h2 id="guardian-news" className="sr-only">
        The Guardian News
      </h2>
      {articles && <NewsFilter source="guardian" />}
      <div className="columns-2xs">
        {/* Display loader, error, or the news cards based on the current state */}
        {status === "loading" && <Loader />}
        {status === "failed" && (
          <p role="alert" className="text-red-600">
            Error: {error}
          </p>
        )}
        {status === "succeeded" && articles && <Card news={articles} />}
      </div>
    </div>
  );
};

export default TheGuardian;

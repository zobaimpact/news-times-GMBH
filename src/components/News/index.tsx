import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/configureStore";
import { fetchNews } from "../../redux/slice/newsSlice";
import Card from "../Card/index";

const News = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { articles, status, error } = useSelector(
    (state: RootState) => state.news
  );

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div
      className="columns-2xs"
    >
      {status === "loading" && <p>Loading news...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && articles && <Card news={articles} />}
    </div>
  );
};

export default News;

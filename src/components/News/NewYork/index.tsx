import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/configureStore";
import { fetchNewYorkTimes } from "../../../redux/slice/newsSlice";
import Card from "../../Card";
import { Loader } from "../../Loader";
import NewsFilter from "../../Filters";

const NewYorkTimes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { articles, status, error } = useSelector(
    (state: RootState) => state.news
  );

  // Fetch initial articles.
  useEffect(() => {
    dispatch(fetchNewYorkTimes());
  }, [dispatch]);

  return (
    <div className="">
      {articles && <NewsFilter source="nyt" />}

      <div className="columns-2xs">
        {status === "loading" && <Loader />}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && articles && <Card news={articles} />}
      </div>
    </div>
  );
};

export default NewYorkTimes;

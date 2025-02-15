import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/configureStore";
import { fetchNewYorkTimes } from "../../../redux/slice/newsSlice";
import Card from "../../Card/index";
import { Loader } from "../../Loader";

const NewYorkTimes = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { articles, status, error } = useSelector(
    (state: RootState) => state.news
  );

  useEffect(() => {
    dispatch(fetchNewYorkTimes());
  }, [dispatch]);

  return (
    <div
      className="columns-2xs"
    >
      {status === "loading" && <Loader/>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && articles && <Card news={articles} />}
    </div>
  );
};

export default NewYorkTimes;

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/configureStore";
import Card from "../../Card";
import { Loader } from "../../Loader";
import { useNavigate } from "react-router-dom";

const SearchResult: React.FC = () => {
  const { searchResult, status, error } = useSelector(
    (state: RootState) => state.search
  );
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="columns-2xs">
        {status === "loading" && <Loader />}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && searchResult && <Card news={searchResult} />}
      </div>
    </div>
  );
};

export default SearchResult;

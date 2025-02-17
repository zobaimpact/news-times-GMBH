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
    <div aria-labelledby="search-result">
      <button
        className="mb-4 mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 id="search-result" className="sr-only">
        Search Result
      </h2>
      <div className="columns-2xs">
        {status === "loading" && <Loader />}
        {status === "failed" && (
          <p role="alert" className="text-red-600">
            Error: {error}
          </p>
        )}
        {status === "succeeded" && searchResult && <Card news={searchResult} />}
      </div>
    </div>
  );
};

export default SearchResult;

import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../redux/store/configureStore"; // Adjust the path as needed
import { setPreferences, Filters, Preferences } from "../../redux/slice/newsSlice";
import { searchNews } from "../../redux/slice/filterNewsSlice";

interface NewsFilterProps {
  source: "nyt" | "newsapi" | "guardian";
  isPreferencesMode?: boolean;
}

const NewsFilter: React.FC<NewsFilterProps> = ({
  source,
  isPreferencesMode = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // State for article search (non-preferences mode)
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [sourceInput, setSourceInput] = useState("");
  const [author, setAuthor] = useState("");

  // State for personalized news feed (preferences mode)
  const [prefSources, setPrefSources] = useState("");
  const [prefCategories, setPrefCategories] = useState("");
  const [prefAuthors, setPrefAuthors] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPreferencesMode) {
      const preferences: Preferences = {
        sources: prefSources.split(",").map((s) => s.trim()).filter(Boolean),
        categories: prefCategories.split(",").map((s) => s.trim()).filter(Boolean),
        authors: prefAuthors.split(",").map((s) => s.trim()).filter(Boolean),
      };
      dispatch(setPreferences(preferences));
    } else {
      const filters: Partial<Filters> = {
        keyword: keyword.trim(),
        date: date.trim() || null,
        category: category.trim() || null,
        source: sourceInput.trim() || null,
      };

      dispatch(searchNews({ source, filters }))
        .unwrap()
        .then(() => {
          navigate("/search-result");
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  };

  return (
    <div className="bg-white p-4 shadow-md sm:flex sm:items-center sm:justify-center gap-4 mb-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mx-auto"
      >
        {isPreferencesMode ? (
          <>
            <Input
              value={prefSources}
              onChange={(e) => setPrefSources(e.target.value)}
              type="text"
              placeholder="Preferred Sources (comma separated)"
              size="sm"
              className="w-full sm:w-auto"
            />
            <Input
              value={prefCategories}
              onChange={(e) => setPrefCategories(e.target.value)}
              type="text"
              placeholder="Preferred Categories (comma separated)"
              size="sm"
              className="w-full sm:w-auto"
            />
            <Input
              value={prefAuthors}
              onChange={(e) => setPrefAuthors(e.target.value)}
              type="text"
              placeholder="Preferred Authors (comma separated)"
              size="sm"
              className="w-full sm:w-auto"
            />
          </>
        ) : (
          <>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              placeholder="Keyword"
              size="sm"
              className="w-full sm:w-auto"
            />
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              placeholder="Date"
              size="sm"
              className="w-full sm:w-auto"
            />
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              placeholder="Category"
              size="sm"
              className="w-full sm:w-auto"
            />
            <Input
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              type="text"
              placeholder="Source"
              size="sm"
              className="w-full sm:w-auto"
            />
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              type="text"
              placeholder="Author"
              size="sm"
              className="w-full sm:w-auto"
            />
          </>
        )}
        <Button
          type="submit"
          variant="shadow"
          size="md"
          className="bg-black rounded text-white"
        >
          {isPreferencesMode ? "Update Preferences" : "Apply Filters"}
        </Button>
      </form>
    </div>
  );
};

export default NewsFilter;

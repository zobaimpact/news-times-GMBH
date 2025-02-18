import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../redux/store/configureStore";
import { searchNews } from "../../redux/slice/filterNewsSlice";
import { useTranslation } from "react-i18next";
import { Filters } from "../../redux/slice/newsSlice";

interface NewsFilterProps {
  source: "nyt" | "newsapi" | "guardian";
  isPreferencesMode?: boolean;
}

const NewsFilter: React.FC<NewsFilterProps> = ({ source }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    keyword: "",
    date: "",
    category: "",
    source: "",
    author: "",
  });
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [language, setLanguage] = useState("en");

  const isFormEmpty = Object.values(formData).every((val) => val.trim() === "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setLanguage(language);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filters: Partial<Filters> = {
      keyword: formData.keyword.trim(),
      date: formData.date.trim() || null,
      category: formData.category.trim() || null,
      source: formData.source.trim() || null,
    };

    dispatch(searchNews({ source, filters }))
      .unwrap()
      .then(() => navigate("/search-result"))
      .catch((error) => console.error("Error fetching search results:", error));
  };

  return (
    <div className="bg-white p-4 sm:w-full sm:flex sm:items-center sm:justify-center gap-4 mb-auto w-full">
        <h2 id="change-language" className="sr-only">
        Change Language
      </h2>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-white rounded text-black p-2 mb-2 sm:mb-0 border w-full sm:w-auto"
      >
        <option value="en">English</option>
        <option value="de">German</option>
      </select>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mx-auto"
      >
        {Object.keys(formData).map((field) => (
          <div key={field} className="w-full w-60 sm:w-auto">
            <Input
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              onBlur={handleBlur}
              type={field === "date" ? "date" : "text"}
              placeholder={t(field)}
              size="md"
              className="w-full"
            />
            {touched[field] && !formData[field as keyof typeof formData] && (
              <p className="text-red-500 text-sm">{t("required")}</p>
            )}
          </div>
        ))}
        <Button
          type="submit"
          variant="shadow"
          size="md"
          className="bg-black rounded text-white p-4 mb-4 sm:mb-0"
          disabled={isFormEmpty}
        >
          {t("apply")}
        </Button>
      </form>
    
    </div>
  );
};

export default NewsFilter;

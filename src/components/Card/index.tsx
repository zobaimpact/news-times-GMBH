import React from "react";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { NewsArticle } from "../../redux/slice/newsSlice";

interface CardComponentProps {
  news: NewsArticle[];
}

const CardComponent: React.FC<CardComponentProps> = ({ news }) => {
  return (
    <div className="news_container">
      {news.map((article, index) => (
        <Card
          key={article.url || index}
          isPressable
          shadow="sm"
          onPress={() => window.open(article.url, "_blank")}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              alt={article.title}
              className="w-full object-cover h-[140px]"
              radius="lg"
              shadow="sm"
              src={article.urlToImage || "https://via.placeholder.com/150"} 
              width="100%"
            />
          </CardBody>
          <CardFooter className="p-4 flex flex-col">
            <b className="text-lg">{article.title}</b>
            {article.byline && <p className="text-gray-600">{article.byline}</p>}
            {article.author && <p className="text-gray-500">By {article.author}</p>}
            <p className="text-xs text-gray-500">
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : article.published_date
                ? new Date(article.published_date).toLocaleDateString()
                : "Unknown date"}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CardComponent;

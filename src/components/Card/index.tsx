import React from "react";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { NewsArticle } from "../../redux/slice/newsSlice";

// Define the props for CardComponent
interface CardComponentProps {
  news: NewsArticle[];
}

// News Card Component
const CardComponent: React.FC<CardComponentProps> = ({ news }) => {
  return (
    <div className="news_container">
      {news.slice(0, 9).map((article, index) => (
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
              src={article.urlToImage || "https://via.placeholder.com/150"} // Fallback image
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small flex flex-col">
            <b>{article.title}</b>
            {article.author && (
              <p className="text-default-500">By {article.author}</p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CardComponent;

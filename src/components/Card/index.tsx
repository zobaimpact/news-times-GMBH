import React from "react";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { NewsArticle } from "../../redux/slice/newsSlice";
import { formatPublishedDate } from "../../helpers/dateFormater";
import { getImageSrc } from "../../helpers/getImageUrl";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const handleCardPress = () => {
    window.open(article.url, "_blank");
  };

  return (
    <Card isPressable shadow="sm" onPress={handleCardPress}>
      <CardBody className="overflow-visible p-0">
        <Image
          alt={article.title}
          className="w-full object-cover h-[140px]"
          radius="lg"
          shadow="sm"
          src={getImageSrc(article)}
          width="100%"
        />
      </CardBody>
      <CardFooter className="p-4 flex flex-col">
        <b className="text-lg">{article.title}</b>
        {article.byline && <p className="text-gray-600">{article.byline}</p>}
        {article.author && <p className="text-gray-500">By {article.author}</p>}
        <p className="text-xs text-gray-500">{formatPublishedDate(article)}</p>
      </CardFooter>
    </Card>
  );
};

interface CardComponentProps {
  news: NewsArticle[];
}

const CardComponent: React.FC<CardComponentProps> = ({ news }) => {
  return (
    <div className="news_container">
      {news.map((article, index) => (
        <NewsCard key={article.url || index} article={article} />
      ))}
    </div>
  );
};

export default CardComponent;

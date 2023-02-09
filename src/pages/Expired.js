import { useDispatch } from "react-redux";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../layouts/Layout";
import { Spinner } from "reactstrap";
import parse from "html-react-parser";

import classes from "./MyArticles.module.css";

async function fetchArticles(authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/articles/?expired=true",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken),
      },
    }
  );
  const data = await response.json();
  return data;
}

const Expired = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const [updatedArticles, setUpdatedArticles] = useState("");

  const { isLoading, data } = useQuery(["expired", updatedArticles], () =>
    fetchArticles(authToken.access_token)
  );

  let content = "";

  if (!isLoading) {
    content = data.map((article) => {
      return (
        <Layout
          key={article.id}
          id={article.id}
          title={article.title}
          text={parse(article.text)}
          tags={article.tags}
          comment={article.comment}
          expired={article.is_expired}
          updatedArticles={updatedArticles}
          setUpdatedArticles={setUpdatedArticles}
        ></Layout>
      );
    });
  }
  if (isLoading) {
    content = (
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner
          className="container"
          style={{
            height: "15rem",
            width: "15rem",
          }}
        >
          Loading...
        </Spinner>
      </div>
    );
  }

  return <div className={`container ${classes.div}`}>{content}</div>;
};
export default Expired;

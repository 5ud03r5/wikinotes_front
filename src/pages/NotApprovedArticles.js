import Layout from "../layouts/Layout";

import classes from "./Articles.module.css";
import { Spinner } from "reactstrap";
import parse from "html-react-parser";

import { useQuery, QueryClientProvider, QueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notApprovedArticlesActions } from "../store";
import Compared from "./Compared";

async function fetchArticles(authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/articles/?not_approved=True",
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



const NotApprovedArticles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comparedArticles, setComparedArticles] = useState([]);
  const [articleBeingCompared, setArticleBeingCompared] = useState();
  const authToken = useSelector((state) => state.auth.authToken);
  const [updatedArticle, setUpdatedArticle] = useState("");
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const { isLoading, data, isFetchedAfterMount } = useQuery(
    ["not_approved_articles", [updatedArticle]],
    () => fetchArticles(authToken.access_token)
  );

  async function compareInBackend(id) {
    setIsLoadingCompare(true);
    console.log(id)
    const response = await fetch(
      "http://127.0.0.1:8000/api/articles/?compare=" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken.access_token),
        },
      }
    );
    const comparison = await response.json();
      console.log(comparison)
    setComparedArticles(
      comparison.map((article) => {
        return article;
      })
    );
    setIsLoadingCompare(false);
  }

  const compareArticles = (article) => {
    compareInBackend(article.id);
    setArticleBeingCompared(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let content = "";
  if (isFetchedAfterMount) {
    content = data.map((article) => {
      return (
        <Layout
          key={article.id}
          id={article.id}
          title={article.title}
          text={parse(article.text)}
          tags={article.tags}
          approved={article.approved}
          comment={article.comment}
          expired={article.is_expired}
          compareArticles={compareArticles}
          updatedArticles={updatedArticle}
          setUpdatedArticles={setUpdatedArticle}
        ></Layout>
      );
    });
  }
  if (!isFetchedAfterMount) {
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
  console.log(comparedArticles);
  console.log(articleBeingCompared);

  return (
    <div className={`container ${classes.div}`}>
      {articleBeingCompared && !isLoadingCompare && (
        <Compared
          comparedArticles={comparedArticles}
          articleBeingCompared={articleBeingCompared}
          isLoadingCompare={isLoadingCompare}
          setArticleBeingCompared={setArticleBeingCompared}
          updatedArticles={updatedArticle}
          setUpdatedArticles={setUpdatedArticle}
        ></Compared>
      )}
      {isLoadingCompare && (
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
      )}
      {content}
    </div>
  );
};

export default NotApprovedArticles;

import Layout from "../layouts/Layout";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import classes from "./Compared.module.css";
import { useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import ReactDOMServer from "react-dom/server";
const Compared = (props) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const authToken = useSelector((state) => state.auth.authToken);
  const [preparedPost, setPreparedPost] = useState();

  const updateArticle = useCallback(async () => {
    console.log(preparedPost);
    if (preparedPost !== undefined) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/articles/" + preparedPost.id + "/",
        {
          method: "PUT",
          body: JSON.stringify(preparedPost),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not edit article.");
      }
      navigate("/articles");
    }
  }, [preparedPost]);

  useEffect(() => {
    updateArticle();
  }, [updateArticle, preparedPost]);

  const approveArticle = (article) => {
    console.log(article.text);
    const text_1 = ReactDOMServer.renderToString(article.text);
    setPreparedPost({
      id: article.id,
      title: article.title,
      text: text_1,
      tag: article.tags.map((tag) => {
        return tag.id;
      }),
      approved: true,
      is_expired: false,
    });
  };
  console.log(props.articleBeingCompared);
  return (
    <>
      {props.articleBeingCompared !== undefined && (
        <Layout
          key={props.articleBeingCompared.id}
          id={props.articleBeingCompared.id}
          title={props.articleBeingCompared.title}
          text={props.articleBeingCompared.text}
          tags={props.articleBeingCompared.tags}
          expired={props.articleBeingCompared.is_expired}
          comment={props.articleBeingCompared.comment}
          approved={props.articleBeingCompared.approved}
          approveArticle={approveArticle}
          updatedArticles={props.updatedArticles}
          setUpdatedArticles={props.setUpdatedArticles}
        ></Layout>
      )}

      {props.comparedArticles.length > 0 && (
        <h2 className={classes.h2}>Found possible conflicts</h2>
      )}
      {props.comparedArticles.length > 0 ? (
        props.comparedArticles.map((article) => (
          <Layout
            key={article.id}
            id={article.id}
            title={article.title}
            text={parse(article.text)}
            tags={article.tags}
            votes={article.votes}
            voted={article.voted}
            is_favorite={article.is_favorite}
            expired={article.is_expired}
            approved={article.approved}
            comment={article.comment}
          ></Layout>
        ))
      ) : (
        <h2 className={classes.h2}>No conflicts found</h2>
      )}
      <hr></hr>
    </>
  );
};

export default Compared;

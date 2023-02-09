import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Spinner } from "reactstrap";
import parse from "html-react-parser";
import classes from "./Article.module.css";
import { useSelector } from "react-redux";
import Comments from "./Comments";
import { findAllByAltText } from "@testing-library/react";

async function fetchNotes(articleId, authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/articles/" + articleId,
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

async function createVote(articleId, authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/vote/" + articleId, {
    method: "POST",
    body: JSON.stringify({ article_id: articleId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "You already voted");
  }
  return data;
}

async function deleteVote(articleId, authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/vote/" + articleId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not delete vote");
  }
  return data;
}
async function removeArticle(postId, authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/articles/" + postId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not delete article.");
  }
}
async function createComment(postId, commentText, authToken) {
  if (commentText.length > 0) {
    const response = await fetch("http://127.0.0.1:8000/api/comment", {
      method: "POST",
      body: JSON.stringify({ article_id: postId, body: commentText }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken),
      },
    });
    const data = await response.json();
    return data;
  }
}
async function updateComment(commentId, commentText, authToken) {
  if (commentText.length > 0) {
    const response = await fetch(
      "http://127.0.0.1:8000/api/comment/" + commentId,
      {
        method: "PUT",
        body: JSON.stringify({ id: commentId, body: commentText }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken),
        },
      }
    );
    const data = await response.json();
  }
}
async function deleteComment(commentId, authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/comment/" + commentId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken),
      },
    }
  );
  const data = await response.json();
}
async function createFav(articleId, authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/favorite/" + articleId,
    {
      method: "POST",
      body: JSON.stringify({ article_id: articleId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken.access_token),
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "It is already your favorite article");
  }
  return data;
}
async function deleteFav(articleId, authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/favorite/" + articleId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken.access_token),
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
async function expiredSetter(propsId, propsExpired, authToken) {
  console.log(propsExpired);
  const response = await fetch(
    "http://127.0.0.1:8000/api/articles/" + propsId,
    {
      method: "PUT",
      body: JSON.stringify({ id: propsId, is_expired: propsExpired }),
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
  return data;
}
const Article = () => {
  const params = useParams();
  const [updatedArticle, setUpdatedArticle] = useState("");
  const authToken = useSelector((state) => state.auth.authToken);
  const queryClient = useQueryClient();
  const [showFull, setShowFull] = useState(true)
  const [commentText, setCommentText] = useState("");
  const [commentTextUpdate, setCommentTextUpdate] = useState();
  const [commentId, setCommentId] = useState();
  //const queryData = useQuery(["articles", search, tag, filtered, authToken], fetchArticles);
  const expiredMutation = useMutation(
    (articleId, value) => expiredSetter(articleId, false, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
      },
    }
  );

  const setExpireMutation = useMutation(
    (articleId) => expiredSetter(articleId, true, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
      },
    }
  );
  const createCommentMutation = useMutation(
    (postId) => createComment(postId, commentText, authToken.access_token),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => removeArticle(postId, authToken.access_token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles", "detail", params.articleId]);
      },
    }
  );
  const updateCommentMutation = useMutation(
    () => updateComment(commentId, commentTextUpdate, authToken.access_token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles", "detail", params.articleId]);
      },
    }
  );
  const deleteCommentMutation = useMutation(
    () => deleteComment(commentId, authToken.access_token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles", "detail", params.articleId]);
      },
    }
  );

  const createVoteMutation = useMutation(
    (articleId) => createVote(articleId, authToken.access_token),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
        console.log(data);
      },
    }
  );

  const deleteVoteMutation = useMutation(
    (articleId) => deleteVote(articleId, authToken.access_token),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
      },
    }
  );
  const createFavMutation = useMutation(
    (articleId) => createFav(articleId, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
      },
    }
  );

  const deleteFavMutation = useMutation(
    (articleId) => deleteFav(articleId, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          ["articles", "detail", params.articleId],
          data
        );
      },
    }
  );
  const { data, isFetchedAfterMount } = useQuery(
    ["articles", "detail", params.articleId],
    () => fetchNotes(params.articleId, authToken.access_token)
  );

  return (
    <div className={`container ${classes.div}`}>
      {!isFetchedAfterMount && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spinner
            style={{
              height: "15rem",
              width: "15rem",
            }}
          >
            Loading...
          </Spinner>
        </div>
      )}
      {isFetchedAfterMount && (
        <>
          <Layout
            id={data.id}
            deleteMutation={deleteMutation}
            deleteVoteMutation={deleteVoteMutation}
            createVoteMutation={createVoteMutation}
            deleteFavMutation={deleteFavMutation}
            createFavMutation={createFavMutation}
            expiredMutation={expiredMutation}
            setExpireMutation={setExpireMutation}
            is_favorite={data.is_favorite}
            tags={data.tags}
            title={data.title}
            text={parse(data.text)}
            expired={data.is_expired}
            comment={data.comment}
            votes={data.votes}
            voted={data.voted}
            showFull={showFull}
            setUpdatedArticles={setUpdatedArticle}
          ></Layout>
          <Comments
            articleId={data.id}
            comments={data.comment}
            createCommentMutation={createCommentMutation}
            updateCommentMutation={updateCommentMutation}
            deleteCommentMutation={deleteCommentMutation}
            setCommentId={setCommentId}
            commentId={commentId}
            commentText={commentText}
            setCommentText={setCommentText}
            commentTextUpdate={commentTextUpdate}
            setCommentTextUpdate={setCommentTextUpdate}
          ></Comments>
        </>
      )}
    </div>
  );
};

export default Article;

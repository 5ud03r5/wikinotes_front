import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQueryClient, useMutation, useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import Layout from "../layouts/Layout";
import { Spinner } from "reactstrap";
import parse from "html-react-parser";

import classes from "./MyArticles.module.css";

async function fetchNotes(authToken, _url) {
  const response = await fetch(_url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function createVote(articleId, authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/vote/" + articleId, {
    method: "POST",
    body: JSON.stringify({ article_id: articleId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken.access_token),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "You already voted");
  }
}

async function deleteVote(articleId, authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/vote/" + articleId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken.access_token),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Could not delete vote");
  }
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

const MyArticles = () => {
  const authToken = useSelector((state) => state.auth.authToken);

  const [expiredCount, setExpiredCount] = useState(0);
  const [notApprovedCount, setNotApprovedCount] = useState(0);
  const [expired, setExpired] = useState(false);
  const [notApproved, setNotApproved] = useState(false);
  const queryClient = useQueryClient();
  let url = `http://127.0.0.1:8000/api/my_articles/?page=1`;
  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) {
      queryClient.setQueriesData(["articles", "my"], () => ({
        pages: [data.pages[0]],
        pageParams: [url],
      }));
    }

    return () => {
      window.scrollTo(0, 0);
    };
  }, []);
  const deleteMutation = useMutation(
    (postId) => removeArticle(postId, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles", "my"]);
      },
    }
  );

  const createVoteMutation = useMutation(
    (articleId) => createVote(articleId, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles", "my"]);
      },
    }
  );

  const deleteVoteMutation = useMutation(
    (articleId) => deleteVote(articleId, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles", "my"]);
      },
    }
  );
  const { isLoading, data, isFetchedAfterMount, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["articles", "my"],
      ({ pageParam = url }) => fetchNotes(authToken.access_token, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        refetchOnWindowFocus: false,
      }
    );

  /*   useEffect(() => {
    if (data) {
      const expiredArticles = data.pages.map((pageData) =>
        pageData.articles.filter((article) => article.is_expired === true)
      );
      setExpiredCount(expiredArticles.length);
      const notApprovedArticles = data.pages.map((pageData) =>
        pageData.articles.filter((article) => article.approved == false)
      );
      setNotApprovedCount(notApprovedArticles.length);
    }
  }, [data]); */

  const getExpired = () => {
    setExpired(!expired);
    setNotApproved(false);
  };

  const getNotApproved = () => {
    setNotApproved(!notApproved);
    setExpired(false);
  };

  let content = "";

  if (isFetchedAfterMount && notApproved) {
    const filteredData = data.pages.map((pageData) =>
      pageData.articles.filter((article) => {
        return article.approved === false;
      })
    );
    console.log(filteredData);
    content = filteredData[0].map((article) => {
      return (
        <Layout
          key={article.id}
          id={article.id}
          title={article.title}
          text={parse(article.text)}
          tags={article.tags}
          expired={article.is_expired}
          comment={article.comment}
          voted={article.voted}
          votes={article.votes}
          deleteVoteMutation={deleteVoteMutation}
          createVoteMutation={createVoteMutation}
          deleteMutation={deleteMutation}
        ></Layout>
      );
    });
  } else if (isFetchedAfterMount && expired) {
    const filteredData = data.pages.map((pageData) =>
      pageData.articles.filter((article) => article.is_expired === true)
    );
    content = filteredData[0].map((article) => {
      return (
        <Layout
          key={article.id}
          id={article.id}
          title={article.title}
          text={parse(article.text)}
          tags={article.tags}
          votes={article.votes}
          comment={article.comment}
          deleteVoteMutation={deleteVoteMutation}
          createVoteMutation={createVoteMutation}
          deleteMutation={deleteMutation}
          expired={article.is_expired}
          voted={article.voted}
        ></Layout>
      );
    });
  } else if (isFetchedAfterMount && !expired && !notApproved) {
    content = data.pages.map((pageData) =>
      pageData.articles.map((article) => {
        return (
          <Layout
            key={article.id}
            id={article.id}
            title={article.title}
            comment={article.comment}
            text={parse(article.text)}
            voted={article.voted}
            deleteVoteMutation={deleteVoteMutation}
            createVoteMutation={createVoteMutation}
            deleteMutation={deleteMutation}
            tags={article.tags}
            votes={article.votes}
            expired={article.is_expired}
          ></Layout>
        );
      })
    );
  } else if (!isFetchedAfterMount) {
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

  return (
    <div className={`container ${classes.div}`}>
      <div className={`d-flex ${classes.counter}`}>
        <button
          onClick={() => {
            getExpired();
          }}
          className={`position-relative ${
            !expired ? classes.action : classes.actionClicked
          }`}
        >
          Expired
          {expiredCount > 0 && (
            <span
              class={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${classes.count}`}
            >
              {expiredCount}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            getNotApproved();
          }}
          className={`position-relative ${
            !notApproved ? classes.action : classes.actionClicked
          }`}
        >
          Awaiting approval
          {notApprovedCount > 0 && (
            <span
              class={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${classes.count}`}
            >
              {notApprovedCount}
            </span>
          )}
        </button>
      </div>
      {isFetchedAfterMount && (
        <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
          {content}
        </InfiniteScroll>
      )}
    </div>
  );
};
export default MyArticles;

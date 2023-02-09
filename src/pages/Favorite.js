import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import { useQueryClient } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "reactstrap";
import Layout from "../layouts/Layout";
import parse from "html-react-parser";
import classes from "./Favorite.module.css";
async function fetchFavorite(authToken, _url) {
  const response = await fetch(_url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken.access_token),
    },
  });
  const data = await response.json();

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
  console.log(data);
  return data;
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
  console.log(data);
  return data;
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

const Favorite = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const queryClient = useQueryClient();
  let url = `http://127.0.0.1:8000/api/favorite/?page=1`;
  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) {
      queryClient.setQueriesData(["articles", "favorite"], () => ({
        pages: [data.pages[0]],
        pageParams: [url],
      }));
    }

    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  const expiredMutation = useMutation(
    (articleId, value) => expiredSetter(articleId, false, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "favorite"], (previous) => {
          previous.pages.forEach((page, index) => {
            page.articles = page.articles.map((article) => {
              return article.id === data.id ? data : article;
            });
          });
          return { ...previous };
        });
      },
    }
  );

  const setExpireMutation = useMutation(
    (articleId) => expiredSetter(articleId, true, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "favorite"], (previous) => {
          previous.pages.forEach((page, index) => {
            page.articles = page.articles.map((article) => {
              return article.id === data.id ? data : article;
            });
          });
          return { ...previous };
        });
      },
    }
  );

  const createVoteMutation = useMutation(
    (articleId) => createVote(articleId, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "favorite"], (previous) => {
          console.log(previous);
          previous.pages.forEach((page, index) => {
            page.articles = page.articles.map((article) => {
              return article.id === data.id ? data : article;
            });
          });
          return { ...previous };
        });
      },
    }
  );

  const deleteVoteMutation = useMutation(
    (articleId) => deleteVote(articleId, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "favorite"], (previous) => {
          console.log(previous);
          previous.pages.forEach((page, index) => {
            page.articles = page.articles.map((article) => {
              return article.id === data.id ? data : article;
            });
          });
          return { ...previous };
        });
      },
    }
  );

  const createFavMutation = useMutation(
    (articleId) => createFav(articleId, authToken),
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.setQueriesData(["articles", "favorite"], (previous) => {
          previous.pages.forEach((page, index) => {
            page.articles = page.articles.map((article) => {
              return article.id === data.id ? data : article;
            });
          });
          return { ...previous };
        });
      },
    }
  );

  const deleteFavMutation = useMutation(
    (articleId) => deleteFav(articleId, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "favorite"], (previous) => {
          previous.pages.forEach((page, index) => {
            page.articles = page.articles.map((article) => {
              return article.id === data.id ? data : article;
            });
          });
          return { ...previous };
        });
      },
    }
  );
  const { data, isFetchedAfterMount, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["articles", "favorite"],
      ({ pageParam = url }) => fetchFavorite(authToken, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        refetchOnWindowFocus: false,
      }
    );

  let content = "";
  if (isFetchedAfterMount) {
    console.log(data);
    content = data.pages.map((pageData) =>
      pageData.articles.map((article) => {
        return (
          <Layout
            key={article.id}
            id={article.id}
            title={article.title}
            text={parse(article.text)}
            tags={article.tags}
            expired={article.is_expired}
            approved={article.approved}
            createVoteMutation={createVoteMutation}
            deleteVoteMutation={deleteVoteMutation}
            createFavMutation={createFavMutation}
            deleteFavMutation={deleteFavMutation}
            expiredMutation={expiredMutation}
            setExpireMutation={setExpireMutation}
            comment={article.comment}
            votes={article.votes}
            voted={article.voted}
            is_favorite={article.is_favorite}
          ></Layout>
        );
      })
    );
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
  return (
    <div className={`container ${classes.div}`}>
      {isFetchedAfterMount && (
        <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
          {content}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Favorite;

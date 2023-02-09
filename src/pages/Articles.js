import Layout from "../layouts/Layout";
import GetAll from "../components/GetAll";
import classes from "./Articles.module.css";
import { Spinner, Nav, Button } from "reactstrap";
import parse from "html-react-parser";
import ArticleFilter from "../components/ArticleFilter";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import MyFilters from "../components/MyFilters";
import { searchActions, tagActions } from "../store";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect } from "react";
async function fetchArticles(
  search,
  tag,
  filtered,
  authToken,
  skip,
  limit,
  _url
) {
  let url = _url;
  if (tag && !search && filtered.length === 0) {
    url = url + "&tag=" + tag;
  } else if (search && !tag && filtered.length === 0) {
    url = url + "&search=" + search;
  } else if (search && !tag && filtered.length > 0) {
    url =
      url +
      "&filter=" +
      filtered.map((tag) => {
        return tag.id;
      }) +
      "&search=" +
      search;
  } else if (filtered.length > 0 && !search && !tag) {
    url =
      url +
      "&filter=" +
      filtered.map((tag) => {
        return tag.id;
      });
  }
  url = url;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
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

const Articles = () => {
  const [updatedArticles, setUpdatedArticles] = useState("");
  const search = useSelector((state) => state.search.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const comment = useSelector((state) => state.comment.comment);
  const tag = useSelector((state) => state.tag.tag);
  const authToken = useSelector((state) => state.auth.authToken);
  const filter = useSelector((state) => state.filter.filter);
  const [filtered, setFiltered] = useState([]);
  const [deletedArticle, setDeletedArticle] = useState();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  //const queryData = useQuery(["articles", search, tag, filtered, authToken], fetchArticles);
  let url = `http://127.0.0.1:8000/api/articles/?page=1`;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) {
      queryClient.setQueriesData(["articles", "all"], () => ({
        pages: [data.pages[0]],
        pageParams: [url],
      }));
    }

    return () => {
      window.scrollTo(0, 0);
    };
  }, [search, filtered, tag]);

  const expiredMutation = useMutation(
    (articleId, value) => expiredSetter(articleId, false, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "all"], (previous) => {
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
        queryClient.setQueriesData(["articles", "all"], (previous) => {
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
  const deleteMutation = useMutation(
    (postId) => removeArticle(postId, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles"]);
      },
    }
  );

  const createVoteMutation = useMutation(
    (articleId) => createVote(articleId, authToken),
    {
      onSuccess: (data) => {
        queryClient.setQueriesData(["articles", "all"], (previous) => {
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
        queryClient.setQueriesData(["articles", "all"], (previous) => {
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
        queryClient.setQueriesData(["articles", "all"], (previous) => {
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
        queryClient.setQueriesData(["articles", "all"], (previous) => {
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

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchedAfterMount,
  } = useInfiniteQuery(
    ["articles", "all", [search, tag, filtered]],
    ({ pageParam = url }) =>
      fetchArticles(
        search,
        tag,
        filtered,
        authToken.access_token,
        skip,
        limit,
        pageParam
      ),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      refetchOnWindowFocus: false,
    }
  );

  const resetFilters = () => {
    setFiltered([]);
    dispatch(searchActions.searchReducer(""));
    dispatch(tagActions.tagReducer(""));
    navigate("/articles");
  };

  const onFilter = (filter) => {
    dispatch(tagActions.tagReducer(""));

    setFiltered(filter);
  };

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
            filteredRemoval={setFiltered}
            setUpdatedArticles={setUpdatedArticles}
            comment={article.comment}
            deleteMutation={deleteMutation}
            createVoteMutation={createVoteMutation}
            deleteVoteMutation={deleteVoteMutation}
            createFavMutation={createFavMutation}
            deleteFavMutation={deleteFavMutation}
            expiredMutation={expiredMutation}
            setExpireMutation={setExpireMutation}
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

  if (isError) {
    content = (
      <div>
        <h3>{error.toString()}</h3>
      </div>
    );
  }

  return (
    <div className={`container ${classes.div}`}>
      <div className={classes.top}>
        {(search.length > 0 || filtered.length > 0 || tag.length > 0) && (
          <h5 className={classes.h5}>
            Filters enabled, click 'Reset filters' button to reset them
          </h5>
        )}
        <div className="d-flex">
          <GetAll resetFilters={resetFilters} />

          <ArticleFilter className="ml-auto p-2" onFilter={onFilter} />
        </div>

        <hr></hr>
        <MyFilters onFilter={onFilter} />
      </div>
      {isFetchedAfterMount && (
        <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
          {content}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Articles;

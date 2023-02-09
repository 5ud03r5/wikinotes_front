import React from "react";
import TagCard from "../components/TagCard";
import TagFilter from "../components/TagFIlter";
import LayoutTagCard from "../layouts/LayoutTagCard";
import classes from "./Tags.module.css";
import { Spinner } from "reactstrap";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddTag from "../components/AddTag";

async function fetchTags(authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/tags/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken.access_token,
    },
  });
  const data = await response.json();
  return data;
}

async function deleteTag(tagId, authToken) {
  const response = await fetch(
    "http://127.0.0.1:8000/api/tags/" + tagId + "/",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken.access_token),
      },
    }
  );
}

async function createTag(preparedTag, authToken) {
  
  const response = await fetch("http://127.0.0.1:8000/api/tags/", {
    method: "POST",
    body: JSON.stringify(preparedTag),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken.access_token),
    },
  });
  const data = await response.json();
  if (!response.ok){
    throw new Error(data.message || "Could not add tag");
  }
  
}

const Tags = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const [filter, setFilter] = useState();
  const queryClient = useQueryClient();
  
  const { data, isFetchedAfterMount } = useQuery(["tags"], () =>
    fetchTags(authToken)
  );
  const createNotify = () =>
    toast.success("Tag succesfully created!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const deleteNotify = () =>
    toast.success("Tag deleted!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const errorNotify = () => 
    toast.error('Could not add tag', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const deleteTagMutation = useMutation(
    (tagId) => deleteTag(tagId, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tags"]);
        deleteNotify();
      },
    }
  );

  const createTagMutation = useMutation(
    (preparedTag) => createTag(preparedTag, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tags"]);
        createNotify();
      },
      onError: (error) => {
        console.log(error)
        errorNotify()
      }
    }
  );

  const tagsFiltering = (value) => {
    setFilter(value);
  };

  let content = "";
  if (isFetchedAfterMount) {
    content = data.map((tag) => {
      return (
        <div data-testid="tag" className={classes.div}>
          <TagCard
            key={tag.id}
            deleteTagMutation={deleteTagMutation}
            name={tag.name}
            description={tag.description}
            id={tag.id}
          ></TagCard>
        </div>
      );
    });
    if (filter && isFetchedAfterMount) {
      const filteredTags = data.filter((tag) => {
        let tagName = tag.name.toLowerCase();
        return tagName.includes(filter);
      });
      content = filteredTags.map((tag) => {
        return (
          <div data-testid="tag" className={classes.div}>
            <TagCard
              key={tag.id}
              deleteTagMutation={deleteTagMutation}
              name={tag.name}
              description={tag.description}
              id={tag.id}
            ></TagCard>
          </div>
        );
      });
    }
  }
  if (!isFetchedAfterMount) {
    content = (
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
    );
  }

  return (
    <div className="container">
      <div className={classes.flex}>
        <div>
          <TagFilter tagsFiltering={tagsFiltering}></TagFilter>
        </div>

        <AddTag createTagMutation={createTagMutation} />
      </div>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
      <LayoutTagCard>{content}</LayoutTagCard>
    </div>
  );
};
export default Tags;

import classes from "./TagInput.module.css";
import React, { useImperativeHandle, useState } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useEffect } from "react";
import { filterActions } from "../store";

const TagInput = (props) => {
  const filter = useSelector((state) => state.filter.filter);
  const authToken = useSelector((state) => state.auth.authToken);
  const dispatch = useDispatch();
  const [width, setWidth] = useState(19);
  const [isNotZero, setIsNotZero] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const [chosenTag, setChosenTag] = useState(0);
  const [checkedTags, setCheckedTags] = useState();
  const [tags, setTags] = useState([]);
  const [isChosen, setIsChosen] = useState();
  const [removeAll, setRemoveAll] = useState(false);
  const [isUlOpen, setIsUlOpen] = useState(false);

  const toggleUl = () => {
    setIsUlOpen(!isUlOpen);
  };

  const handleInputChange = (event) => {
    if (event.target.value.length > 0) {
      setIsUlOpen(true);
    } else {
      setIsUlOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = (event) => {
    const ul = document.getElementById("ul-tags");
    if (!ul.contains(event.target)) {
      ul.style.display = "none";
    }
  };

  const fetchTags = useCallback(async () => {
    const response = await fetch("http://127.0.0.1:8000/api/tags/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken.access),
      },
    });
    const data = await response.json();

    if (props.articleFilter) {
      setTags(
        data.map((tag) => {
          return { name: tag.name, id: tag.id, description: tag.description };
        })
      );
    } else {
      setTags(
        data.filter((tag) => {
          return !filter.find(
            (f) =>
              f.id === tag.id &&
              f.name === tag.name &&
              f.description === tag.description
          );
        })
      );
    }
  }, []);
  console.log(tags);
  useEffect(() => {
    fetchTags();
  }, []); 
  const focusOnInput = () => {
    document.getElementById("searchFilter").focus();
  };
  function clearFilter() {
    document.getElementById("searchFilter").value = "";
  }

  const filterTags = (value) => {
    let search = value;

    if (search.trim().length > 0) {
      const filteredTags = tags.filter((tag) => {
        return tag.name.toLowerCase().includes(search);
      });
      setFilteredTags(filteredTags);
    } else {
      setFilteredTags([]);
    }
    console.log(filteredTags);
  };
  const addTagsToFilter = (event) => {
    event.preventDefault();

    dispatch(
      filterActions.filterReducer({
        name: event.target.text,
        id: event.target.id,
      })
    );
    /* props.setFilter((prev) => {
      return [...prev, { name: event.target.text, id: event.target.id }];
    }); */

    setTags(
      tags.filter((tag) => {
        return tag.name !== event.target.text;
      })
    );
    setFilteredTags([]);
    clearFilter();
    setWidth(19);
    focusOnInput();
  };

  const removeTagFromFilter = (value) => {
    dispatch(
      filterActions.filterReducerNew(
        filter.filter((tag) => {
          return tag.name !== value.name;
        })
      )
    );

    setTags(
      tags.filter((tag) => {
        return tag.id !== value.id;
      })
    );
    setTags((prevState) => {
      return [...prevState, { name: value.name, id: value.id }];
    });
  };
  console.log(tags);
  const tagFilter = (event) => {
    console.log("onKeyUp");
    event.preventDefault();
    setWidth(19 + event.target.value.length * 10);

    if (event.key === "Enter" && filteredTags.length > 0) {
      event.preventDefault();
      dispatch(filterActions.filterReducer(filteredTags[chosenTag]));
      /* props.setFilter((prev) => {
        return [...prev, filteredTags[chosenTag]];
      }); */

      setTags(
        tags.filter((tag) => {
          return tag.name !== filteredTags[chosenTag].name;
        })
      );
      setFilteredTags([]);
      clearFilter();
      setWidth(19);
      focusOnInput();
    }

    if (event.key === "ArrowDown" && filteredTags.length > 0) {
      focusOnInput();
      if (chosenTag < filteredTags.length - 1) {
        setChosenTag(chosenTag + 1);
      }
    }

    if (event.key === "ArrowUp" && filteredTags.length > 0) {
      focusOnInput();
      if (chosenTag > 0) {
        setChosenTag(chosenTag - 1);
      }
    }

    if (event.key.length === 1 && !removeAll) {
      setChosenTag(0);
      setWidth(width + 10);
    }

    if (event.target.value.length === 1) {
      setIsNotZero(true);
    } else {
      setIsNotZero(false);
    }
    if (
      event.key === "Backspace" &&
      filter.length > 0 &&
      event.target.value.length === 0 &&
      !isNotZero &&
      !removeAll
    ) {
      //setWidth(19 + props.filter[props.filter.length - 1].name.length * 10);
      setChosenTag(0);
      updateInput();
    }
    console.log(width);

    if (
      event.key === "Backspace" &&
      event.target.value.length >= 0 &&
      width > 19 &&
      !removeAll
    ) {
      setWidth(19 + event.target.value.length * 10);
      setChosenTag(0);
    }

    if (removeAll && event.key === "Backspace") {
      setWidth(19);
      setRemoveAll(false);
    }

    filterTags(event.target.value);
  };

  const selectTag = () => {
    if (filteredTags.length > 0) {
      setIsChosen(filteredTags[chosenTag].id);
    }
  };

  useEffect(() => {
    selectTag();
    
  }, [chosenTag, tagFilter]);

  const updateInput = () => {
    let lastItem = filter[filter.length - 1].name;
    console.log(lastItem);
    setWidth(19 + filter[filter.length - 1].name.length * 10);
    removeTagFromFilter(filter[filter.length - 1]);
    document.getElementById("searchFilter").value = lastItem;
    setIsNotZero(false);
  };

  const catchCtrlA = (event) => {
    console.log("onKeyDown");
    if (event.key === "Enter") {
      props.setEnterPressed(true);
    }

    if (event.ctrlKey && event.key === "a") {
      setRemoveAll(true);
    } else if (
      removeAll &&
      event.key !== "Control" &&
      event.key !== "a" &&
      event.key !== "Backspace"
    ) {
      setWidth(19);
      setRemoveAll(false);
    }
  };

  const handleInputWidth = (event) => {
    if (event.target.value.length > 0) {
      setWidth(19 + event.target.value.length * 10);
    }
  };

  useEffect(() => {
    if (props.clear) {
      console.log("Cleared");
      dispatch(filterActions.reset());
      setFilteredTags([]);
      fetchTags();
      props.setClear(false);
    }
  }, [props.clear]);

  return (
    <>
      <div onClick={() => focusOnInput()} className={`${classes["div-input"]}`}>
        <div className={classes["div-tags"]}>
          {filter.map((item) => {
            return (
              <div className={classes.div}>
                <span className={classes.tag}>
                  {item.name}

                  <Link
                    className={classes.close}
                    title="Delete"
                    onClick={() => {
                      removeTagFromFilter(item);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                    </svg>
                  </Link>
                </span>
              </div>
            );
          })}

          <input
            style={{ width: width, maxWidth: 290 }}
            type="text"
            placeholder=""
            className={classes.input}
            onKeyUp={tagFilter}
            onKeyDown={catchCtrlA}
            onKeyPress={handleInputWidth}
            id="searchFilter"
            autocomplete="off"
            onClick={toggleUl}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <ul
        id="ul-tags"
        style={{ display: isUlOpen ? "block" : "none" }}
        className={`list-group ${classes.ul}`}
      >
        {filteredTags.map((tag) => {
          return (
            <li
              className={
                tag.id === isChosen
                  ? `list-group-item ${classes.active}`
                  : "list-group-item"
              }
            >
              <Link
                className={classes.linkitem}
                id={tag.id}
                key={tag.id}
                onClick={addTagsToFilter}
              >
                {tag.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TagInput;

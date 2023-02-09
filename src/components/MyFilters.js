import { useQuery, QueryClientProvider, QueryClient } from "react-query";
import { Collapse, Card, CardBody, ListGroupItem } from "reactstrap";
import classes from "./MyFilters.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { myFilterActions } from "../store";
const MyFilters = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const filter = useSelector((state) => state.myFilter.myFilter);
  const [deleteFilter, setDeleteFilter] = useState("");

  const fetchFilters = useCallback(async () => {
    const response = await fetch("http://127.0.0.1:8000/api/filter/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken.access_token),
      },
    });
    const data = await response.json();
    setData(data);
    dispatch(myFilterActions.myFilterRemoveReducer(false));
  });

  const removeFilter = useCallback(async () => {
    
    if (deleteFilter.length > 0) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/filter/" + deleteFilter,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );

      const data = await response.json();
    }
  });

  useEffect(() => {
    removeFilter();
    setDeleteFilter("");
  }, [deleteFilter, removeFilter]);

  useEffect(() => {
    fetchFilters();
  }, [filter === true, deleteFilter]);

  const toggle = () => setIsOpen(!isOpen);

  const onClickRemove = (filter_id) => {
    setDeleteFilter(filter_id);
  };

  const onClickSelect = (filter) => {
    setIsOpen(!isOpen);

    props.onFilter(filter.tags);
  };

  return (
    <div className={classes.main}>
      <Button className={`btn ${classes.button}`} onClick={toggle}>
        {!isOpen && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-right-circle"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
            />
          </svg>
        )}
        {isOpen && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-down-circle"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
            />
          </svg>
        )}
        <span> Saved filters</span>
      </Button>
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            {!isLoading && (
              <ul>
                {data.map((filter) => {
                  return (
                    <span className={`${classes.tagdiv}`} title={filter.tags.map((tag) => tag.name)}>
                      <div
                        className={`${classes.tag}`}
                        onClick={() => {
                          onClickSelect(filter);
                        }}
                      >
                        {filter.name}
                      </div>
                      <Link
                        className={classes.tagremove}
                        onClick={() => {
                          onClickRemove(filter.id);
                        }}
                        title="remove"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                      </Link>
                    </span>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
};

export default MyFilters;

import classes from "./Layout.module.css";

import { Link } from "react-router-dom";
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import ReactDOMServer from "react-dom/server";
import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tagActions, searchActions, commentActions } from "../store";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  Alert,
  Form,
  ModalHeader,
  Collapse,
  Card,
  CardBody,
} from "reactstrap";
import Comments from "../components/Comments";
import { useQueryClient, useMutation } from "react-query";

async function updateArticle(propsId, propsExpired, authToken) {
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
}

const Layout = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [showFull, setShowFull] = useState(props.showFull);
  const authToken = useSelector((state) => state.auth.authToken);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const toggleComment = () => setIsOpen(!isOpen);

  const updateMutation = useMutation(
    (expired) => updateArticle(props.id, expired, authToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles"]);
        queryClient.invalidateQueries(["article"]);
      },
    }
  );

  const toggle = () => {
    setModal(!modal);
  };
  const toggleDelete = () => {
    setModalDelete(!modalDelete);
  };
  const buttonHandler = (event) => {
    dispatch(tagActions.tagReducer(event.target.value));
    dispatch(searchActions.searchReducer(""));
    navigate("/articles");
  };

  const editHandler = (article) => {
    navigate("/edit_article/" + article.id);
  };

  const onDeleteHandler = (event) => {
    event.preventDefault();
    setModalDelete(!modalDelete);
    props.deleteMutation.mutate(props.id);
  };

  const addVote = () => {
    if (props.voted === false) {
      props.createVoteMutation.mutate(props.id);
    } else if (props.voted === true) {
      props.deleteVoteMutation.mutate(props.id);
    }
  };

  const addFav = () => {
    if (props.is_favorite === false) {
      props.createFavMutation.mutate(props.id);
    } else if (props.is_favorite === true) {
      props.deleteFavMutation.mutate(props.id);
    }
  };

  const addExp = () => {
    console.log("func");
    if (props.expired === true) {
      props.expiredMutation.mutate(props.id);
    } else if (props.expired === false) {
      console.log("here");
      props.setExpireMutation.mutate(props.id);
    }
  };

  return (
    <>
      <div className={`${classes.layout}`}>
        <>
          <div className={classes.div}>
            <Link
              key={props.id}
              to={`/articles/${props.id}`}
              className={classes.header}
            >
              {props.title}
            </Link>

            <UncontrolledDropdown className={classes.uncontrolled}>
              <DropdownToggle className={classes.threedots}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    editHandler(props);
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    toggleDelete();
                  }}
                >
                  Delete
                </DropdownItem>
                {props.approved === false && (
                  <DropdownItem
                    color="info"
                    className={classes.buttonCompare}
                    onClick={() => {
                      props.compareArticles(props);
                    }}
                  >
                    Compare
                  </DropdownItem>
                )}
                {props.approveArticle && (
                  <DropdownItem
                    color="info"
                    className={classes.buttonCompare}
                    onClick={() => {
                      props.approveArticle(props);
                    }}
                  >
                    Approve
                  </DropdownItem>
                )}
                {!props.expired && (
                  <DropdownItem
                    color="info"
                    className={classes.buttonCompare}
                    onClick={() => addExp()}
                  >
                    Expired
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
            {props.expired && (
              <b onClick={addExp} className={classes.expired}>
                Expired
              </b>
            )}
            {props.tags &&
              props.tags.map((tag) => {
                return (
                  <button
                    onClick={buttonHandler}
                    className={classes.button}
                    value={tag.name}
                  >
                    {tag.name}
                  </button>
                );
              })}

            <Modal
              isOpen={modalDelete}
              toggle={toggleDelete}
              size="lg"
              style={{ marginTop: 200 }}
            >
              <Form>
                <ModalHeader>
                  <b>{props.title}</b>
                </ModalHeader>
                <ModalBody>
                  Are you sure want to delete "{props.title}"?
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    color="primary"
                    onClick={onDeleteHandler}
                  >
                    Yes
                  </Button>{" "}
                  <Button
                    type="button"
                    color="secondary"
                    onClick={toggleDelete}
                  >
                    No
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          </div>
          <hr></hr>
          {!showFull ? (
            <div onClick={() => setShowFull(true)} className={classes.text}>
              {props.text}
            </div>
          ) : (
            <div className={classes.textMore}>{props.text}</div>
          )}
        </>
        <br></br>
        <div className={classes.footer}>
          {props.comment && (
            <Link
              key={props.id}
              to={`/articles/${props.id}`}
              className={classes.discussion}
            >
              {props.comment.length > 0
                ? `Discussion (${props.comment.length})`
                : `Begin discussion`}
            </Link>
          )}
          {(props.voted === false || props.voted === true) && (
            <div
              className={props.voted === false ? classes.vote : classes.voted}
              onClick={() => addVote()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-hand-thumbs-up-fill"
                viewBox="0 0 16 16"
              >
                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
              </svg>
              {props.votes > 0 && <span>{props.votes}</span>}
            </div>
          )}

          {(props.is_favorite === true || props.is_favorite === false) && (
            <div
              className={
                props.is_favorite === false ? classes.notFav : classes.fav
              }
              onClick={() => addFav()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-star-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Layout;

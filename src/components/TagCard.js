import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardText, Button } from "reactstrap";
import { useState } from "react";
import classes from "./TagCard.module.css";
import { useDispatch } from "react-redux";
import { tagActions, searchActions } from "../store";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  ModalHeader,
  Form,
  Modal,
  ModalFooter,
} from "reactstrap";

const TagCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tagId, setTagId] = useState("");
  const [modalDelete, setModalDelete] = useState(false);

  const onClickTagHandler = (event) => {
    dispatch(tagActions.tagReducer(event.target.value));
    dispatch(searchActions.searchReducer(""));
    navigate("/articles");
  };

  const toggleDelete = () => {
    setModalDelete(!modalDelete);
  };

  const onDeleteHandler = (event) => {
    event.preventDefault();
    props.deleteTagMutation.mutate(props.id);
  };

  return (
    <>
      <Card className={`my-1 ${classes.card}`}>
        <CardBody
          className={classes.body}
          onMouseEnter={() => setTagId(props.id)}
          onMouseLeave={() => setTagId("")}
        >
          <div>
            <Button
              data-testid="tagButton"
              value={props.name}
              onClick={(e) => onClickTagHandler(e)}
              className={classes.button}
            >
              {props.name}
            </Button>
            {props.id === tagId && (
              <div
                className={classes.remove}
                title="Delete tag"
                onClick={toggleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            )}
          </div>

          <hr></hr>
          <CardText className={classes.description}>
            {props.description}
          </CardText>
          {tagId === props.id && (
            <div className={classes.title}>{props.description}</div>
          )}
        </CardBody>
      </Card>
      <Modal
        isOpen={modalDelete}
        toggle={toggleDelete}
        size="lg"
        style={{ marginTop: 200 }}
      >
        <Form onSubmit={onDeleteHandler}>
          <ModalHeader>
            <b>{props.name}</b>
          </ModalHeader>
          <ModalBody>Are you sure want to delete "{props.name}"?</ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" onClick={toggleDelete}>
              Yes
            </Button>{" "}
            <Button type="button" color="secondary" onClick={toggleDelete}>
              No
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default TagCard;

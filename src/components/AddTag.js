import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
} from "reactstrap";
import classes from "./AddTag.module.css";

const AddTag = (props) => {
  const [modal, setModal] = useState(false);
  const [preparedTag, setPreparedTag] = useState();
  const toggle = () => setModal(!modal);
  const [tagName, setTagName] = useState("");
  const [tagDescription, setTagDescription] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setPreparedTag({ name: tagName, description: tagDescription });
  };

  useEffect(() => {
    if (preparedTag !== undefined) {
      props.createTagMutation.mutate(preparedTag);
      setTagName("");
      setTagDescription("");
      setPreparedTag();
    }
  }, [preparedTag]);

  return (
    <div>
      <Button
        title="Add tag"
        type="button"
        color="dark"
        className={classes.button}
        onClick={toggle}
      >
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-tag-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
        <span> Add tag</span>
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <Form onSubmit={onSubmitHandler}>
          <ModalHeader toggle={toggle}>
            <Input
              autoComplete="off"
              onChange={(e) => {
                setTagName(e.target.value);
              }}
              value={tagName}
              name="name"
              type="text"
              placeholder="Tag name..."
            ></Input>
          </ModalHeader>
          <ModalBody>
            <Input
              autoComplete="off"
              onChange={(e) => setTagDescription(e.target.value)}
              value={tagDescription}
              name="description"
              type="textarea"
              placeholder="Tag description..."
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="info" onClick={toggle}>
              Add
            </Button>

            <Button type="button" color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default AddTag;

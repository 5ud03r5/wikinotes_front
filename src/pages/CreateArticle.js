import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
} from "reactstrap";

import TagInput from "../components/TagInput";
import { Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CreateArticle.module.css";
import { useNavigate } from "react-router-dom";
import { filterActions } from "../store";
import { CKEditor } from "ckeditor4-react";

const CreateArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [preparedPost, setPreparedPost] = useState();
  const [clear, setClear] = useState(false);
  const [enterPressed, setEnterPressed] = useState();
  const authToken = useSelector((state) => state.auth.authToken);
  const filter = useSelector((state) => state.filter.filter);
  const [isLoading, setIsLoading] = useState(true);

  const createArticle = useCallback(async () => {
    if (preparedPost !== undefined) {
      const response = await fetch("http://127.0.0.1:8000/api/articles/", {
        method: "POST",
        body: JSON.stringify(preparedPost),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken.access_token),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add article.");
      }
      navigate("/my_articles");
    }
  }, [preparedPost]);

  useEffect(() => {
    dispatch(filterActions.reset());
    createArticle();
    setIsLoading(false);
  }, [createArticle]);

  const onChangeTextHandler = (event) => {
    setText(event.editor.getData());
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log(text);
    if (!enterPressed) {
      if (text.length > 0 && event.target.title.value.length > 0) {
        setPreparedPost({
          title: event.target.title.value,
          text: text,
          tag: filter.map((tag) => {
            return tag.id;
          }),
          approved: false,
        });
      }
    } else {
      setEnterPressed(false);
    }
  };

  return (
    <div className={`${classes.div}`}>
      <div className={classes.divInsider}>
        {isLoading && (
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
        )}
        {!isLoading && (
          <Form onSubmit={onSubmitHandler}>
            <div className={`${classes.flex}`}>
              <div>
                <Input
                  placeholder="Article name..."
                  className={classes.input}
                  name="title"
                ></Input>
              </div>

              <div>
                <TagInput
                  setClear={setClear}
                  clear={clear}
                  setEnterPressed={setEnterPressed}
                ></TagInput>
              </div>
              <div>
                <Button type="submit" color="dark" className={classes.button}>
                  Create
                </Button>
              </div>
            </div>
            <CKEditor
              config={{ height: 700 }}
              onChange={onChangeTextHandler}
            ></CKEditor>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CreateArticle;

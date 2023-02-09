import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { CKEditor } from "ckeditor4-react";
import TagInput from "../components/TagInput";
import { Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import classes from "./CreateArticle.module.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { filterActions } from "../store";
import { Spinner } from "reactstrap";
const EditArticle = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [preparedPost, setPreparedPost] = useState();
  const [clear, setClear] = useState();
  const [enterPressed, setEnterPressed] = useState();
  const authToken = useSelector((state) => state.auth.authToken);
  const filter = useSelector((state) => state.filter.filter);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState();
  const [isMounting, setIsMounting] = useState(true)
  const fetchArticle = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(
      "http://127.0.0.1:8000/api/articles/" + params.articleId + "/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken.access_token),
        },
      }
    );
    const data = await response.json();
    
    setText(data.text);
    setId(data.id);
    setTitle(data.title);
    console.log(data)
    dispatch(filterActions.filterReducerNew(data.tags));
    
    setIsLoading(false);
  },[]);

  useEffect(() => {

    fetchArticle();
    setIsMounting(false);
  }, []);

  const updateArticle = useCallback(async () => {
    if (preparedPost !== undefined) {
      console.log(preparedPost);
      const response = await fetch(
        "http://127.0.0.1:8000/api/articles/" + params.articleId + "/",
        {
          method: "PUT",
          body: JSON.stringify(preparedPost),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update article.");
      }
      navigate("/articles/" + params.articleId);
    }
  }, [preparedPost]);

  useEffect(() => {
    updateArticle();
  }, [updateArticle]);

  const onChangeTextHandler = (event) => {
    setText(event.editor.getData());
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!enterPressed) {
      if (text.length > 0 && event.target.title.value.length > 0) {
        
        setPreparedPost({
          id: id,
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
  //console.log(filter)
  return (
    <div className={`container ${classes.div}`}>
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
      {!isLoading && !isMounting && (
        <Form onSubmit={onSubmitHandler}>
          <div className={`${classes.flex}`}>
            <div>
              <Input
                placeholder="Article name..."
                value={title}
                className={classes.input}
                name="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
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
                Update
              </Button>
            </div>
          </div>

          <CKEditor
            config={{ height: 500 }}
            name="text"
            onChange={onChangeTextHandler}
            initData={text}
          />
        </Form>
      )}
    </div>
  );
};

export default EditArticle;

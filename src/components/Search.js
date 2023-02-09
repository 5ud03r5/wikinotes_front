import { useState } from "react";
import { Form } from "reactstrap";
import { useDispatch } from "react-redux";
import { Input } from "reactstrap";
import classes from "./Search.module.css";
import { useNavigate } from "react-router-dom";
import { searchActions, tagActions } from "../store";
const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState();

  const inputHandler = (event) => {
    setInput(event.target.value);
  };
  function clearInput() {
    document.getElementById("input").value = "";
  }
  const searchFormHandler = (event) => {
    event.preventDefault();

    dispatch(searchActions.searchReducer(input));
    dispatch(tagActions.tagReducer(""));
    setInput("");
    clearInput();
    if (input.trim().length > 0) {
      navigate("articles/?search=" + input);
    } else {
      navigate("articles");
    }
  };
  return (
    <div className={` container ${classes.searchdiv}`}>
      <Form onSubmit={searchFormHandler}>
        <Input
          id="input"
          className={classes.search}
          placeholder="Search articles..."
          onChange={inputHandler}
          autoComplete="off"
        ></Input>
      </Form>
    </div>
  );
};

export default Search;

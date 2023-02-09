import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
} from "reactstrap";

import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import classes from "./ArticleFilter.module.css";

import TagInput from "./TagInput";
import { useDispatch, useSelector } from "react-redux";
import { filterActions, myFilterActions } from "../store";

const ArticleFilter = (props) => {
  const filter = useSelector((state) => state.filter.filter);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);
  const [selected, setSelected] = useState("Newest");
  const [preparedFilter, setPreparedFilter] = useState();
  const [enterPressed, setEnterPressed] = useState(false);
  const [clear, setClear] = useState(false);
  const [modal, setModal] = useState(false);
  const [filterName, setFilterName] = useState("");

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => setModal(!modal);

  const getFilteredArticles = () => {
    setIsOpen(!isOpen);
    props.onFilter(
      filter.map((tag) => {
        return tag;
      })
    );
  };
  const submitForm = (event) => {
    console.log("lel");
    event.preventDefault();

    console.log(event);
    dispatch(myFilterActions.myFilterAddReducer());
    setPreparedFilter({
      name: filterName,
      tag: filter.map((tag) => {
        return tag.id;
      }),
    });
    setClear(true);
  };

  const onSelectHandler = (event) => {
    setSelected(event.target.value);
  };

  const createFilter = useCallback(async () => {
    console.log(preparedFilter);
    if (preparedFilter !== undefined) {
      const response = await fetch("http://127.0.0.1:8000/api/filter/", {
        method: "POST",
        body: JSON.stringify(preparedFilter),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken.access_token),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add filter");
      }
      setSelected("Newest");
    }
    setFilterName("");
  }, [preparedFilter]);

  useEffect(() => {
    console.log("yo");
    dispatch(filterActions.reset());
    createFilter();
  }, [preparedFilter]);

  return (
    <div>
      <Button
        onClick={toggle}
        style={{ marginBottom: "1rem" }}
        className={classes.button1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-filter"
          viewBox="0 0 16 16"
        >
          <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
        </svg>
        <span> Filter</span>
      </Button>
      <Collapse isOpen={isOpen} navbar>
        <Card className={classes.card}>
          <CardBody>
            <div>
              <FormGroup>
                <Label for="tagsSelect">Tags</Label>

                <TagInput
                  setEnterPressed={setEnterPressed}
                  clear={clear}
                  setClear={setClear}
                  articleFilter={true}
                ></TagInput>
              </FormGroup>
            </div>
            {/* <div>
                <Label for="radio">Filter by</Label>
                <FormGroup check>
                  <Input
                    name="radio2"
                    type="radio"
                    value="Newest"
                    onClick={onSelectHandler}
                    checked={selected === "Newest"}
                  />{" "}
                  <Label check>Newest</Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    name="radio2"
                    type="radio"
                    value="Oldest"
                    onClick={onSelectHandler}
                    checked={selected === "Oldest"}
                  />{" "}
                  <Label check>Oldest</Label>
                </FormGroup>
              </div> */}

            <Nav className="float-right">
              <Button
                type="button"
                onClick={() => {
                  toggleModal();
                }}
                className={` ${classes.button}`}
              >
                Save filter
              </Button>
              <Modal isOpen={modal} toggle={toggleModal}>
                <Form onSubmit={submitForm}>
                  <ModalHeader toggle={toggleModal}>Modal title</ModalHeader>
                  <ModalBody>
                    <Input
                      value={filterName}
                      onChange={(e) => {
                        setFilterName(e.target.value);
                      }}
                    ></Input>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit" onClick={toggleModal}>
                      Create filter
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>

              <Button
                color="dark"
                style={{ marginLeft: 10 }}
                className={classes.button}
                type="button"
                onClick={getFilteredArticles}
              >
                Apply filter
              </Button>
            </Nav>
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
};

export default React.memo(ArticleFilter);

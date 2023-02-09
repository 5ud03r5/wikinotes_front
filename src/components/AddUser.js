import {
  Button,
  Modal,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import classes from "./AddUser.module.css";

const AddUser = (props) => {
  const authToken = useSelector((state) => state.auth.authToken);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);

  const [preparedUser, setPreparedUser] = useState();
  const createUser = useCallback(async () => {
    if (preparedUser !== undefined) {
      const response = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        body: JSON.stringify(preparedUser),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        props.setUpdateUsers(data);
        setIsAdmin(false);
        setUsername();
        setPassword();
        setEmail();
        setFirstName();
        setLastName();
      } else {
        throw new Error("Could not add user.");
      }
    }
  }, [preparedUser]);

  useEffect(() => {
    createUser();
  }, [createUser, preparedUser]);

  const onAddHandler = (event) => {
    console.log(isAdmin);
    event.preventDefault();
    if (username && password !== undefined) {
      
      setPreparedUser({
        username: username,
        password: password,
        is_superuser: isAdmin,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
    }
  };
  const toggleAdd = () => {
    setModalAdd(!modalAdd);
  };
  return (
    <>
      <Button
        color="dark"
        onClick={() => {
          toggleAdd();
        }}
        className={classes.button}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-person-add"
          viewBox="0 0 16 16"
        >
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
        </svg>
        <span> Add user</span>
      </Button>
      <Modal
        isOpen={modalAdd}
        toggle={toggleAdd}
        size="lg"
        className={classes.modal}
      >
        <Form onSubmit={onAddHandler}>
          <ModalHeader>
            <b>Add user</b>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                placeholder="username"
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                type="password"
                placeholder="password"
              />
            </FormGroup>
            <FormGroup>
              <Input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                placeholder="email (optional)"
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
                placeholder="first name (optional)"
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
                placeholder="last name (optional)"
              ></Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="checkbox"
                onChange={(e) => {
                  setIsAdmin(!isAdmin);
                }}
              />
              <Label check>Admin</Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" onClick={toggleAdd}>
              Add
            </Button>{" "}
            <Button type="button" color="secondary" onClick={toggleAdd}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default AddUser;

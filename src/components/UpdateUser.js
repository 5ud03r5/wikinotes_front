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

const UpdateUser = (props) => {
  const authToken = useSelector((state) => state.auth.authToken);
  const [username, setUsername] = useState(props.data.username);
  const [password, setPassword] = useState(props.data.password);
  const [email, setEmail] = useState(props.data.email);
  const [firstName, setFirstName] = useState(props.data.first_name);
  const [lastName, setLastName] = useState(props.data.last_name);
  const [isAdmin, setIsAdmin] = useState(props.data.is_superuser);
  const [modalAdd, setModalAdd] = useState(false);
  const [checked, setChecked] = useState(props.data.is_superuser);
  const [preparedUser, setPreparedUser] = useState();
  const createUser = useCallback(async () => {
    if (preparedUser !== undefined) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/" + props.data.id + "/",
        {
          method: "PUT",
          body: JSON.stringify(preparedUser),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not add user.");
      }
    }
    props.setUpdateUsers(preparedUser);
    setIsAdmin(false);
  }, [preparedUser]);

  useEffect(() => {
    
    createUser();
  }, [createUser, preparedUser]);

  const onAddHandler = (event) => {
    console.log(isAdmin);
    event.preventDefault();
    if (username !== undefined) {
      setPreparedUser({
        id: props.data.id,
        username: username,
        is_superuser: checked,
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
        color="info"
        className={props.className}
        title="Edit"
        onClick={() => {
          toggleAdd();
          setChecked(props.data.is_superuser)
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-gear"
          viewBox="0 0 16 16"
        >
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        </svg>
      </Button>

      <Modal
        isOpen={modalAdd}
        toggle={toggleAdd}
        size="lg"
        className={classes.modal}
      >
        <Form onSubmit={onAddHandler}>
          <ModalHeader>
            <b>Update user</b>
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
                checked={checked}
                onClick={() => {
                  setChecked(!checked);
                }}
                onChange={(e) => {
                  setIsAdmin(!isAdmin);
                }}
              />
              <Label> Admin</Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" onClick={toggleAdd}>
              Update
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

export default UpdateUser;

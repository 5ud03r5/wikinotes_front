import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const PasswordChange = (props) => {
  const [password, setPassword] = useState();
  const [modal, setModal] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);

  const updatePassword = useCallback(async () => {
    console.log(password);
    if (password !== undefined) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/" + props.data.id + "/",
        {
          method: "PUT",
          body: JSON.stringify(password),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not change user.");
      }
      
    }
  }, [password]);

  useEffect(() => {
    updatePassword();
  }, [updatePassword, password]);

  const toggle = () => setModal(!modal);
  const passwordChangeHandler = () => {
    
    var length = 16,
      charset =
        "abcdefghijklm&nopqrstuvw_?xyzABCDEFGHIJKLMN-!OPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    setPassword({
      id: props.data.id,
      username: props.data.username,
      password: retVal,
    });
    toggle();
  };
  return (
    <>
      <Button
        title="Change password"
        onClick={() => {
          passwordChangeHandler();
        }}
        className={props.className}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-key"
          viewBox="0 0 16 16"
        >
          <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
          <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      </Button>
      {password && (
        <Modal isOpen={modal} toggle={toggle} style={{ marginTop: 200 }}>
          <ModalHeader toggle={toggle}>
            New password for {props.data.username}
          </ModalHeader>
          <ModalBody>
            <h2 style={{ textAlign: "center" }}>{password.password}</h2>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default PasswordChange;

import classes from "./Users.module.css";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import { useQuery, QueryClientProvider, QueryClient } from "react-query";
import { Button, Input, Spinner } from "reactstrap";
import Delete from "../helpers/Delete";
import { useState } from "react";
import { useEffect, useCallback } from "react";
import AddUser from "../components/AddUser";
import UpdateUser from "../components/UpdateUser";
import PasswordChange from "../components/PasswordChange";
async function fetchUsers(authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/users/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
  return data;
}
const queryClient = new QueryClient();
const Users = () => {
  const [modalDelete, setModalDelete] = useState(false);
  const [deleteUser, setDeleteUser] = useState();
  const [userToDelete, setUserToDelete] = useState("");
  const [updateUsers, setUpdateUsers] = useState();
  const [filter, setFilter] = useState("");

  const authToken = useSelector((state) => state.auth.authToken);
  const { isLoading, data } = useQuery(["users", updateUsers], () =>
    fetchUsers(authToken.access)
  );

  const removeUser = useCallback(async () => {
    if (deleteUser !== undefined) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/" + deleteUser + "/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      setUpdateUsers(deleteUser);
      setDeleteUser();
    }
  }, [deleteUser]);

  useEffect(() => {
    removeUser();
  }, [deleteUser, removeUser]);

  const toggleDelete = () => {
    setModalDelete(!modalDelete);
  };

  const userDeleter = (user) => {
    setDeleteUser(user);
  };
  let content = "";
  if (!isLoading) {
    const filteredData = data.filter((item) => {
      {
        return (
          item.username.toLowerCase().includes(filter) ||
          item.first_name.toLowerCase().includes(filter) ||
          item.last_name.toLowerCase().includes(filter) ||
          item.email.toLowerCase().includes(filter)
        );
      }
    });
    content = (
      <tbody>
        {filteredData.map((user) => (
          <tr>
            <td title={user.username} className={classes.td}>
              {user.username}
            </td>
            <td title={user.first_name} className={classes.td}>
              {user.first_name}
            </td>
            <td title={user.last_name} className={classes.td}>
              {user.last_name}
            </td>
            <td title={user.email} className={classes.td}>
              {user.email}
            </td>
            {user.is_superuser ? (
              <td className={classes.td}>Admin</td>
            ) : (
              <td className={classes.td}>User</td>
            )}
            <td style={{ width: 200 }}>
              <UpdateUser data={user} setUpdateUsers={setUpdateUsers} className={classes.button}/>
              <Button
                color="danger"
                className={classes.button}
                title="Delete"
                onClick={() => {
                  toggleDelete();
                  setUserToDelete({
                    name: user.username,
                    id: user.id,
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-dash-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                </svg>
              </Button>
              <Delete
                id={userToDelete.id}
                name={userToDelete.name}
                toggleDelete={toggleDelete}
                modalDelete={modalDelete}
                userDeleter={userDeleter}
              ></Delete>
              <PasswordChange data={user} className={classes.button}></PasswordChange>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
  return (
    <>
      <div className={`container ${classes.maindiv}`}>
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
            <>
              <div className={`d-flex ${classes.flex}`}>
                <div>
                  <Input
                    placeholder="Search users..."
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                  ></Input>
                </div>
                <div>
                  <AddUser setUpdateUsers={setUpdateUsers} />
                </div>
              </div>
              <div className={`${classes.div}`}>
                <Table className={classes.table}>
                  <thead>
                    <tr>
                      <th style={{ maxWidth: 200, width: 200 }}>Username</th>
                      <th style={{ maxWidth: 200, width: 200 }}>First Name</th>
                      <th style={{ maxWidth: 200, width: 200 }}>Last Name</th>
                      <th style={{ maxWidth: 200, width: 200 }}>Email</th>
                      <th style={{ maxWidth: 200, width: 200 }}>Role</th>
                      <th style={{ maxWidth: 200, width: 200 }}>Options</th>
                    </tr>
                  </thead>
                  {content}
                </Table>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default function Wraped() {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Users />
    </QueryClientProvider>
  );
}

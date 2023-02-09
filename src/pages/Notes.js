import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import classes from "./Notes.module.css";
import parse from "html-react-parser";
import { Input } from "reactstrap";
import { useState } from "react";
async function fetchNotes(authToken) {
  const response = await fetch("http://127.0.0.1:8000/api/sections/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(authToken),
    },
  });
  const data = await response.json();
  return data;
}

const Notes = () => {
  const [isSearch, setIsSearch] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);
  const { isLoading, data } = useQuery(["notes"], () =>
    fetchNotes(authToken.access_token)
  );

  return (
    <div className={`container ${classes.div}`}>
      <div className={classes.searchdiv}>
        {" "}
        <Input
          placeholder="search in notes..."
          className={classes.search}
        ></Input>
      </div>

      {!isLoading &&
        data.map((section) => {
          return (
            <div className={classes.note}>
              <div className={classes.title}>{section.title}</div>
              <hr></hr>
              <div className={classes.body}>{parse(section.body)}</div>
            </div>
          );
        })}
    </div>
  );
};

export default Notes;

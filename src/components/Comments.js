import { Input, Form, Collapse } from "reactstrap";
import classes from "./Comments.module.css";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentActions } from "../store";
import { useQuery } from "react-query";

const Comments = (props) => {
  const dispatch = useDispatch();
  const [preparedComment, setPreparedComment] = useState();
  const [commentText, setCommentText] = useState("");
  const authToken = useSelector((state) => state.auth.authToken);
  const filter = useSelector((state) => state.filter.filter);
  const [commentIdLocal, setCommentIdLocal] = useState("");

  const user = useSelector((state) => state.auth.user);
  const comments = useSelector((state) => state.comment.comments);

  const handlePrepareComment = (event) => {
    event.preventDefault();
    if (props.commentText.length > 0) {
      props.createCommentMutation.mutate(props.articleId);
      props.setCommentText("");
    }
  };

  const handleOnBlur = (event) => {
    event.preventDefault();
    props.updateCommentMutation.mutate(props.articleId);
    props.setCommentTextUpdate("");
  };

  return (
    <div className={classes.collapse}>
      <div className={classes.div}>
        {props.comments && (
          <>
            {props.comments.map((comment) => (
              <>
                <div
                  onMouseEnter={() => props.setCommentId(comment.id)}
                  onMouseLeave={() => props.setCommentId("")}
                  className={
                    comment.owner_id === user.id
                      ? classes.myComment
                      : classes.comment
                  }
                >
                  {props.commentId === comment.id &&
                    comment.owner_id === user.id && (
                      <div
                        className={classes.dropdown}
                        onClick={() => props.deleteCommentMutation.mutate()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-x"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </div>
                    )}
                  <div
                    className={classes.contentEdit}
                    suppressContentEditableWarning={true}
                    contentEditable={
                      comment.owner_id === user.id ? "true" : "false"
                    }
                    dangerouslySetInnerHTML={{ __html: comment.body }}
                    onInput={(event) => {
                      props.setCommentTextUpdate(event.target.innerHTML);
                      props.setCommentId(comment.id);
                    }}
                    onBlur={handleOnBlur}
                  ></div>
                </div>
              </>
            ))}
          </>
        )}

        <Form onSubmit={handlePrepareComment}>
          <Input
            value={props.commentText}
            onChange={(e) => props.setCommentText(e.target.value)}
            placeholder="write comment..."
            className={classes.input}
          ></Input>
        </Form>
      </div>
    </div>
  );
};

export default Comments;

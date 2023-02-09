import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "../pages/MyNotes.module.css";
import { notesActions } from "../store";
import { filterActions } from "../store";
import { useNavigate } from "react-router-dom";
const Sections = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const [sectionTitle, setSectionTitle] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState();
  const [sectionDelete, setSectionDelete] = useState();
  const [noteDeleted, setNoteDeleted] = useState(false);
  const [preparedPost, setPreparedPost] = useState();

  const notes = useSelector((state) => state.notes.notes);

  const createArticle = useCallback(async () => {
    if (preparedPost !== undefined) {
      console.log('its here in createArticle',preparedPost);
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
      //console.log(data)
      navigate("/my_articles/");
    }
  }, [preparedPost]);

  useEffect(() => {
    dispatch(filterActions.reset());
    createArticle();
  }, [createArticle]);

  const addSection = useCallback(async () => {
    if (props.newSection === true) {
      const response = await fetch("http://127.0.0.1:8000/api/sections", {
        method: "POST",
        body: JSON.stringify({ note_id: props.clickedNoteId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken.access_token),
        },
      });
      const data = await response.json();

      dispatch(notesActions.notesUpdateReducer(data));
      props.setSelectedNote(data);
      props.setNewSection(false);
    }
  }, [props.newSection]);

  const deleteSection = useCallback(async () => {
    if (sectionDelete !== undefined) {
      console.log("deleting section");
      const response = await fetch(
        "http://127.0.0.1:8000/api/sections/" + sectionDelete.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      const data = await response.json();
      if (data !== null) {
        dispatch(notesActions.notesUpdateReducer(data));
        props.setSelectedNote(data);
        props.setSelectedSection(data.section[0]);
      } else {
        dispatch(notesActions.notesDeleteReducer(props.selectedNote.id));
        setNoteDeleted(true);
      }
      setSectionDelete();
    }
  }, [sectionDelete]);

  useEffect(() => {
    deleteSection();
    if (notes.length > 0 && noteDeleted) {
      props.setSelectedNote(notes[notes.length - 1]);
      props.setSelectedSection(notes[notes.length - 1].section[0]);
      setNoteDeleted(false);
    }
    if (notes.length === 0) {
      props.setSelectedNote("");
    }
  }, [deleteSection, sectionDelete]);

  useEffect(() => {
    if (props.newSection === true) {
      addSection();
      props.addSectionHandler(props.selectedNote);
    }
  }, [props.newSection]);

  const onClickSection = () => {
    console.log(sectionTitle)
    props.setNewSection(true);
  };

  const catchRightClick = (event, section) => {
    event.preventDefault();
    console.log('catch right click')
    //props.handlerSetSelectedSection(event, section);
    setSelectedSectionId(section.id);
  };

  return (
    <div onClick={() => setSelectedSectionId()} className={classes.section}>
      <div
        onClick={() => {
          onClickSection();
        }}
        className={classes.addNewSection}
      >
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-sign-intersection"
          viewBox="0 0 16 16"
        >
          <path d="M7.25 4v3.25H4v1.5h3.25V12h1.5V8.75H12v-1.5H8.75V4h-1.5Z" />
          <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435Zm-1.4.7a.495.495 0 0 1 .7 0l6.516 6.515a.495.495 0 0 1 0 .7L8.35 14.866a.495.495 0 0 1-.7 0L1.134 8.35a.495.495 0 0 1 0-.7L7.65 1.134Z" />
        </svg>
        <span> Add new section</span>
      </div>
      <div className={classes.sectionSeparator}>
        {props.selectedNote.section.map((section) => {
          {
            return (
              <>
                <div
                  key={section.id}
                  onClick={(event) => {
                    console.log(section);
                    props.handlerSetSelectedSection(event, section);
                  }}
                  onContextMenu={(e) => catchRightClick(e, section)}
                  contenteditable="true"
                  spellcheck="false"
                  onInput={(event) => {
                    props.handlerSetSelectedSection(event, section);
                    setSectionTitle(event.target.innerText);
                  }}
                  onBlur={() => {
                    sectionTitle.length > 0 &&
                      props.setPreparedSection({ title: sectionTitle });
                    setSectionTitle("");
                  }}
                  className={
                    props.selectedSection.id == section.id
                      ? classes.sectionItemActive
                      : classes.sectionItem
                  }
                >
                  <div>{section.title}</div>
                </div>
                {selectedSectionId === section.id && (
                  <div className={classes.dropdown}>
                    <div
                      title="Delete section"
                      className={classes.dropdownItem2}
                      onClick={() => {
                        setSectionDelete(section);
                      }}
                    >
                      Delete
                    </div>
                    {!section.public ? (
                      <div
                        title="Make section public so others can see it"
                        className={classes.dropdownItem2}
                        onClick={() => {
                          props.setPreparedSection({ public: true });
                        }}
                      >
                        Publish
                      </div>
                    ) : (
                      <div
                        title="Make section private so others can't see it"
                        className={classes.dropdownItem2}
                        onClick={() => {
                          props.setPreparedSection({ public: false });
                        }}
                      >
                        Private
                      </div>
                    )}

                    <div
                      title="Create an article from this section"
                      className={classes.dropdownItem2}
                      onClick={() => {
                        setPreparedPost({
                          title: section.title,
                          text: section.body,
                          tag: [],
                        });
                        setSectionDelete(section);
                      }}
                    >
                      Create article
                    </div>
                  </div>
                )}
              </>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Sections;

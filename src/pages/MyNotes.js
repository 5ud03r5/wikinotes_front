import classes from "./MyNotes.module.css";
import React, { useEffect, useState, useCallback } from "react";
import parse from "html-react-parser";
import ReactDOMServer from "react-dom/server";
import { useDispatch, useSelector } from "react-redux";

import Sections from "../components/Sections";
import { useRef } from "react";
import { notesActions } from "../store";
import { Input, List } from "reactstrap";
import { produceWithPatches } from "immer";

const MyNotes = () => {
  const dispatch = useDispatch();
  const [selectedNote, setSelectedNote] = useState();
  const [selectedSection, setSelectedSection] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [newNote, setNewNote] = useState(false);
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState(false);
  const [filteredSections, setFilteredSections] = useState([]);
  const [deletedNote, setDeletedNote] = useState("");
  const authToken = useSelector((state) => state.auth.authToken);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clickedNoteId, setClickedNoteId] = useState(null);
  const [preparedSection, setPreparedSection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [textSearch, setTextSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const data = useSelector((state) => state.notes.notes);

  const notesContentRef = useRef(null);
  useEffect(() => {
    setSections([]);
    if (data) {
      data.map((note) => {
        note.section.map((section) => {
          setSections((prevState) => {
            return [...prevState, section];
          });
        });
      });
    }
  }, [data]);

  const addSectionHandler = (note) => {
    setNewSection(true);
  };

  const fetchNotes = useCallback(async () => {
    console.log("fetching");
    const response = await fetch("http://127.0.0.1:8000/api/my_notes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authToken.access_token),
      },
    });
    const data = await response.json();
    dispatch(notesActions.notesReducer(data));
    setIsLoading(false);
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchDeleteNote = useCallback(async () => {
    if (deletedNote.length > 0) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/notes/" + deletedNote,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      console.log(deletedNote);
      dispatch(notesActions.notesDeleteReducer(deletedNote));

      setDeletedNote("");
    }
  }, [deletedNote]);

  useEffect(() => {
    fetchDeleteNote();
    if (data.length > 0) {
      setSelectedNote(data[data.length - 1]);
      setSelectedSection(data[data.length - 1].section[0]);
    } else if (data.length === 0) {
      setSelectedNote("");
    }
  }, [deletedNote]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const noteUpdateHandler = (event, note) => {
    event.preventDefault();

    setSelectedNote(note);
    if (note.section.length > 0) {
      setSelectedSection(note.section[0]);
    }
  };

  const createNote = useCallback(async () => {
    if (newNote === true) {
      const response = await fetch("http://127.0.0.1:8000/api/notes/", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authToken.access_token),
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add note.");
      }
      dispatch(notesActions.notesAddReducer(data));
      setNewNote(false);
    }
  }, [newNote]);

  useEffect(() => {
    createNote();
  }, [newNote === true]);

  const updateSection = useCallback(async () => {
    console.log(preparedSection);
    if (
      preparedSection.title ||
      preparedSection.body ||
      preparedSection.public ||
      preparedSection.public === false
    ) {
      console.log("PUT");
      const response = await fetch(
        "http://127.0.0.1:8000/api/sections/" + selectedSection.id,
        {
          method: "PUT",
          body: JSON.stringify(preparedSection),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authToken.access_token),
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update.");
      }
      console.log(data);
      dispatch(notesActions.notesUpdateReducer(data));
      setSelectedNote(data);
      setPreparedSection("");
    }
  }, [preparedSection]);

  useEffect(() => {
    updateSection();
    setPreparedSection("");
  }, [preparedSection]);

  const handlerSetSelectedSection = (event, section) => {
    event.preventDefault();
    setContentBody("");
    console.log(section);
    setSelectedSection(section);
  };

  const onSearchClickHandler = (event, section) => {
    event.preventDefault();

    setSelectedNote(
      data.find((note) => {
        return note.id === section.note_id;
      })
    );
    handlerSetSelectedSection(event, section);
  };
  const deleteNote = (note) => {
    setSelectedNote("");
    setSelectedSection("");
    setDeletedNote(note);
  };

  const catchRightClick = (event, note) => {
    setSelectedNote(note);
    if (note.section.length > 0) {
      setSelectedSection(note.section[0]);
    }
    if (event.button === 2) {
      event.preventDefault();
      setClickedNoteId(note.id);

      toggle();
    }
  };

  const catchSave = (event) => {
    event.preventDefault();
    setPreparedSection({
      body: contentBody,
    });
    setContentBody("");
  };

  const addNewNote = () => {
    if (data.length < 40) {
      setNewNote(true);
      createNote();
    }
  };

  const sectionFilter = (event) => {
    setIsVisible(true);
    setTextSearch(event.target.value);
  
    const parser = new DOMParser();
    const filteredSections = sections.filter((section) => {
      const htmlDoc = parser.parseFromString(section.body, 'text/html');
      const text = htmlDoc.body.textContent;
      return (
        event.target.value.length > 1 &&
        text.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    
    setFilteredSections(filteredSections);
  };

  return (
    <div
      onClick={() => {
        setClickedNoteId("");
        setIsVisible(false);
      }}
      className={`${classes.div}`}
    >
      {!isLoading && (
        <>
          <div className={classes.searchDiv}>
            <Input
              placeholder="Search in notes..."
              className={`${classes.searchNotes}`}
              onChange={(e) => sectionFilter(e)}
              value={textSearch}
            ></Input>
            {isVisible && filteredSections.length > 0 && (
              <ul className={classes.ul}>
                {filteredSections.map((section) => {
                  return (
                    <li
                      onClick={(e) => onSearchClickHandler(e, section)}
                      className={classes.li}
                    >
                      {section.title}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div
            onClick={() => {
              addNewNote();
            }}
            className={classes.addNew}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-plus-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>
            <span> New note</span>
          </div>

          <div className={`${classes.divHeaders}`}>
            {!isLoading &&
              data.map((note) => (
                <div
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  className={
                    selectedNote && selectedNote.id === note.id
                      ? classes.noteHeaderActive
                      : classes.noteHeader
                  }
                  key={note.id}
                  title={note.title}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  spellCheck="false"
                  onClick={(event) => {
                    noteUpdateHandler(event, note);
                  }}
                  onContextMenu={(event) => {
                    catchRightClick(event, note);
                  }}
                >
                  {note.title}
                  {clickedNoteId === note.id && (
                    <div
                      onClick={() => deleteNote(selectedNote.id)}
                      className={classes.dropdownItem}
                    >
                      Delete
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className={classes.notes}>
            {selectedNote ? (
              <div className={classes.divNotes}>
                <div
                  id="sectionBody"
                  key={selectedSection.id}
                  className={classes.note}
                  ref={notesContentRef}
                  contenteditable="true"
                  onInput={(event) => {
                    setContentBody(event.target.innerHTML);
                  }}
                  onBlur={catchSave}
                  dangerouslySetInnerHTML={{ __html: selectedSection.body }}
                ></div>

                <Sections
                  clickedNoteId={selectedNote.id}
                  selectedNote={selectedNote}
                  setNewSection={setNewSection}
                  newSection={newSection}
                  setSelectedNote={setSelectedNote}
                  addSectionHandler={addSectionHandler}
                  isLoading={isLoading}
                  setSelectedSection={setSelectedSection}
                  selectedSection={selectedSection}
                  handlerSetSelectedSection={handlerSetSelectedSection}
                  setPreparedSection={setPreparedSection}
                  setDeletedNote={setDeletedNote}
                ></Sections>
              </div>
            ) : (
              <div className={classes.divNotes}>
                <h2 className={classes.h2}>
                  <span
                    onClick={() => {
                      addNewNote();
                    }}
                    className={classes.addNewH2}
                  >
                    Add new note
                  </span>
                </h2>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyNotes;

import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Input, Button } from "@material-ui/core";

import "react-quill/dist/quill.snow.css";
import ResearchPopup from "./researchPopup";
import { makeStyles } from "@material-ui/core/styles";

const Cite = require("citation-js");

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  searchInput: {
    width: "12%",
    marginRight: theme.spacing(2),
  },
  searchButton: {
    display: "flex",
    width: "2%",
    marginTop: "1% ",
  },
  editor: {
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: "20%",
    marginTop: "1%",
  },
  dropdown: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    padding: "1%",
    width: "20%",
    marginTop: "1%",
  },
}));
const CitationPopup = () => {
  const classes = useStyles();

  const [editorContent, setEditorContent] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [atSymbolEntered, setAtSymbolEntered] = useState(false);
  const [citationTemplate, setCitationTemplate] = useState("harvard");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowPopup(false);
        setAtSymbolEntered(false);
      } else {
        if (event.key === "@") {
          setAtSymbolEntered(true);
        }

        if (event.key === "@" && !atSymbolEntered) {
          setShowPopup(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [atSymbolEntered]);

  useEffect(() => {
    if (showPopup) {
      setSearchKeyword("");
    }
  }, [showPopup]);

  const handleEditorChange = (content) => {
    const cleanedContent = content.replace(/<p>|<\/p>/g, "").trim();
    const atIndex = cleanedContent.lastIndexOf("@");

    if (atIndex !== -1 && atSymbolEntered) {
      const searchText = cleanedContent
        .substring(atIndex + 1)
        .replace(/<[^>]*>/g, "")
        .trim();
      setSearchKeyword(searchText);
    } else {
      setSearchKeyword("");
    }

    setEditorContent(content);
  };

  const handleResultClick = (result) => {
    const citation = new Cite(result.citationStyles.bibtex);
    const citationText = citation.format("bibliography", {
      format: "html",
      template: citationTemplate,
      lang: "en-US",
    });
    const contentWithoutAtSymbol = editorContent.replace(/@.*$/, "");
    const newContent = contentWithoutAtSymbol + citationText;

    setEditorContent(newContent);
    setShowPopup(false);
    setAtSymbolEntered(false);
    setSearchKeyword("");
  };
  console.log(citationTemplate);
  const handlePopupClose = () => {
    setShowPopup(false);
    setAtSymbolEntered(false);
    setSearchKeyword("");
  };

  return (
    <div>
      <select
        value={citationTemplate}
        onChange={(e) => setCitationTemplate(e.target.value)}
        className={classes.dropdown}
      >
        <option value="apa">APA</option>
        <option value="mla">MLA</option>
        <option value="ieee">IEEE</option>
      </select>
      <p className={classes.searchContainer}>
        Type "@" for citation popup and Esc to close it
      </p>
      <ReactQuill
        className={classes.editor}
        value={editorContent}
        onChange={handleEditorChange}
        placeholder="Write your citation here..."
        modules={{
          toolbar: {
            container: [
              ["bold", "italic"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }}
      />

      {showPopup && (
        <div className="citation-popup">
          <div className={classes.searchContainer}>
            <Input
              className={classes.searchInput}
              placeholder="Enter your search term"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button
              className={classes.searchButton}
              variant="contained"
              color="primary"
              onClick={() => handlePopupClose()}
            >
              Close
            </Button>
          </div>
          {showPopup && (
            <ResearchPopup
              searchKeyword={searchKeyword}
              onResultClick={handleResultClick}
              citationTemplate={citationTemplate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CitationPopup;

import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { handleSearch } from "../api";
const Cite = require("citation-js");

// below are the design elements for various material ui componentds used
const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "16px",
  },
  text: {
    fontSize: "12px",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
  },
  searchInput: {
    marginRight: theme.spacing(2),
    flex: 1,
  },
  resultCard: {
    width: "25%",
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  citationText: {
    whiteSpace: "pre-line",
  },
  citation: {
    fontSize: "12px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    WebkitLineClamp: 1,
  },
  abstract: {
    fontSize: "12px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
  },
  authors: {
    fontSize: "12px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    WebkitLineClamp: 1,
  },
}));

export default function ResearchTab() {
  const classes = useStyles();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResult, setShowNoResult] = useState(false);
  // function to triger a api postg response to generate results
  const searchFunction = async () => {
    // a separate api.js is used to configure the endpoints parameters
    const fetchData = await handleSearch(searchKeyword);
    if (fetchData === undefined) {
      setShowNoResult(true);
    } else {
      setShowNoResult(false);
      setSearchResults(fetchData);
    }
  };
  // a function to keep track of keyword changes
  const handleChange = (value) => {
    setSearchKeyword(value);
  };

  return (
    <div className={classes.root}>
      {/* search box and buttons */}
      <div className={classes.searchContainer}>
        <TextField
          className={classes.searchInput}
          variant="outlined"
          placeholder="Search..."
          value={searchKeyword}
          onChange={(e) => handleChange(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={searchFunction}>
          Search
        </Button>
      </div>
      {/* if api response is undefined show a no result found message  */}
      {showNoResult ? (
        <Typography variant="h5">No Result Found</Typography>
      ) : (
        searchResults.map((result) => {
          const citation = new Cite(result.citationStyles.bibtex);

          return (
            // implementation of material ui card component
            <Card key={result.paperId} className={classes.resultCard}>
              <CardContent>
                <Typography variant="h6" className={classes.title}>
                  <Link
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </Link>
                </Typography>
                <Typography
                  variant="body1"
                  className={(classes.authors, classes.text)}
                >
                  <strong>Authors:</strong>{" "}
                  {result.authors.map((author) => author.name).join(", ")}
                </Typography>
                <Typography variant="body1" className={classes.abstract}>
                  <strong>Abstract:</strong> {result.abstract}
                </Typography>
                <Typography variant="body1" className={classes.text}>
                  <strong>Citation Count:</strong> {result.citationCount}
                </Typography>
                {result.isOpenAccess &&
                  result.openAccessPdf &&
                  result.openAccessPdf.url && (
                    <Typography variant="body1" className={classes.abstract}>
                      <strong>Open Access:</strong>{" "}
                      <Link
                        href={result.openAccessPdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF
                      </Link>
                    </Typography>
                  )}
                <Typography variant="body1" className={classes.citation}>
                  <strong>Citation:</strong>{" "}
                  <span
                    className={classes.citationText}
                    // this element was used to remove html tags from display -- source: stackoverflow and google
                    dangerouslySetInnerHTML={{
                      __html: citation.format("bibliography", {
                        format: "text",
                        template: "iso690",
                        lang: "en-US",
                      }),
                    }}
                  />
                </Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

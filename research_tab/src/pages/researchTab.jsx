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

const useStyles = makeStyles((theme) => ({
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
    fontSize: "10px",
  },
  citationText: {
    whiteSpace: "pre-line",
  },
  abstract: {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
  },
  authors: {
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

  const searchFunction = async () => {
    const fetchData = await handleSearch(searchKeyword);
    if (fetchData === undefined) {
      setShowNoResult(true);
    } else {
      setShowNoResult(false);
      setSearchResults(fetchData);
    }
  };

  const handleChange = (value) => {
    setSearchKeyword(value);
  };

  return (
    <div className={classes.root}>
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

      {showNoResult ? (
        <Typography variant="h5">No Result Found</Typography>
      ) : (
        searchResults.map((result) => {
          const citation = new Cite(result.citationStyles.bibtex);

          return (
            <Card key={result.paperId} className={classes.resultCard}>
              <CardContent>
                <Typography variant="h6">
                  <Link
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </Link>
                </Typography>
                <Typography variant="body1" className={classes.authors}>
                  <strong>Authors:</strong>{" "}
                  {result.authors.map((author) => author.name).join(", ")}
                </Typography>
                <Typography variant="body1" className={classes.abstract}>
                  <strong>Abstract:</strong> {result.abstract}
                </Typography>
                <Typography variant="body1">
                  <strong>Citation Count:</strong> {result.citationCount}
                </Typography>
                {result.isOpenAccess &&
                  result.openAccessPdf &&
                  result.openAccessPdf.url && (
                    <Typography variant="body1">
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

                <Typography variant="body1">
                  <strong>Citation:</strong>{" "}
                  <span
                    className={classes.citationText}
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

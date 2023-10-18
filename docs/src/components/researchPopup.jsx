import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { handleSearch } from "../api";

const Cite = require("citation-js");

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "10px",
    border: "1px solid #ccc",
    "&:hover": {
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
    },
  },
  resultCard: {
    margin: "auto",
    width: "25%",
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    fontSize: "5px", 
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

const ResearchPopup = ({ searchKeyword, onResultClick, citationTemplate }) => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResult, setShowNoResult] = useState(false);

  useEffect(() => {
    const searchFunction = async () => {
      const fetchData = await handleSearch(searchKeyword);
      try {
        if (fetchData === undefined) {
          setShowNoResult(true);
        } else {
          setShowNoResult(false);
          setSearchResults(fetchData);
        }
      } catch (error) {
        console.error(error);
        setShowNoResult(true);
      }
    };
    if (searchKeyword !== "") {
      searchFunction();
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword]);

  return (
    <div>
      {showNoResult ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Typography variant="h5">No Result Found</Typography>
        </div>
      ) : (
        searchResults.map((result) => (
          <Card
            className={classes.resultCard}
            key={result.paperId}
            onClick={() => onResultClick(result)}
          >
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
                  dangerouslySetInnerHTML={{
                    __html: new Cite(result.citationStyles.bibtex).format(
                      "bibliography",
                      {
                        format: "text",
                        template: citationTemplate,
                        lang: "en-US",
                      }
                    ),
                  }}
                />
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ResearchPopup;

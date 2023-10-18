import CitationPopup from "./components/citationPopup";
import ResearchTab from "./pages/researchTab";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Tabs,
  Tab,
} from "@material-ui/core";
import { useState } from "react";

// styled components
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
}));

function App() {
  const classes = useStyles();

  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div className={classes.root}>
      {/* header */}
      <AppBar position="static">
        <Toolbar className={classes.title}>
          <Typography variant="h6" className={classes.title}>
            RESEARCH BAR
          </Typography>
        </Toolbar>
      </AppBar>
      {/* //separate tab section */}
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Search Results" />
        <Tab label="Citation Popup" />
      </Tabs>
      {tabValue === 0 && <ResearchTab />}
      {tabValue === 1 && <CitationPopup />}
    </div>
  );
}

export default App;

import { createMuiTheme } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: lightBlue[300],
    },
  },
});

export default theme;

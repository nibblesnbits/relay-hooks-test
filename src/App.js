import PropTypes from "prop-types";
import React from "react";
import { createFragmentContainer } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { CssBaseline, ThemeProvider, Link, Container } from "@material-ui/core";
import theme from "./theme";

const propTypes = {
  appUser: PropTypes.object,
  children: PropTypes.node.isRequired,
  relay: PropTypes.object.isRequired,
};

const AppHeading = () => {
  return (
    <div>
      <Link href="/">My app</Link>
    </div>
  );
};

class App extends React.Component {
  render() {
    const { authInfo, children } = this.props;
    const { viewer } = authInfo;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <section className="app">
            <header className="header">
              <AppHeading />
              {authInfo.authorized && (
                <h5>
                  Logged in as:{" "}
                  <strong>
                    {viewer.firstName} {viewer.lastName}
                  </strong>
                </h5>
              )}
            </header>
            {children}
          </section>
        </Container>
      </ThemeProvider>
    );
  }
}

App.propTypes = propTypes;

export default createFragmentContainer(App, {
  authInfo: graphql`
    fragment App_authInfo on AuthInfo {
      authorized
      authUrl
      viewer {
        appUserId
        firstName
        lastName
      }
    }
  `,
});

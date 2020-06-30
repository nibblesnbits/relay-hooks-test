import PropTypes from "prop-types";
import React from "react";
import { ReactRelayContext, createFragmentContainer } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import UnviewedActivities from "./UnviewedActivities";
import { Container, Typography } from "@material-ui/core";

const propTypes = {
  authInfo: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
};

const contextType = ReactRelayContext;

class Activities extends React.Component {
  render() {
    const { authInfo } = this.props;
    if (!authInfo) {
      return <div>Loading...</div>;
    }

    return (
      <Container>
        <Typography variant="h6">
          Welcome to my app! Select some activities to get started.
        </Typography>
        <UnviewedActivities authInfo={authInfo} />
      </Container>
    );
  }
}

Activities.propTypes = propTypes;
Activities.contextType = contextType;

export default createFragmentContainer(Activities, {
  authInfo: graphql`
    fragment Activities_authInfo on AuthInfo {
      ...UnviewedActivities_authInfo
    }
  `,
});

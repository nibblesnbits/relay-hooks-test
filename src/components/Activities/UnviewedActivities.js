import PropTypes from "prop-types";
import React, { useState } from "react";
import { graphql } from "babel-plugin-relay/macro";
import { Grid, Button } from "@material-ui/core";
import { useRefetch } from "relay-hooks";

const propTypes = {
  authInfo: PropTypes.object.isRequired,
};

const fragmentSpec = graphql`
  fragment UnviewedActivities_authInfo on AuthInfo
    @argumentDefinitions(
      cursor: { type: "ID" }
      count: { type: "Int!", defaultValue: 5 }
    ) {
    viewer {
      appUserId
      list: unviewedActivities(first: $count, after: $cursor)
        @connection(key: "UnviewedActivities_list") {
        edges {
          node {
            activityId
            name
            shortDescription
            activityUrl
            imageUrl
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const fetchQuery = graphql`
  query UnviewedActivitiesRefetchQuery($count: Int!, $cursor: ID) {
    authInfo {
      ...UnviewedActivities_authInfo @arguments(cursor: $cursor, count: $count)
    }
  }
`;

const UnviewedActivities = (props) => {
  const [authInfo, refetch] = useRefetch(fragmentSpec, props.authInfo);
  const [, setLoads] = useState(0);

  const {
    viewer: {
      list: { edges },
    },
  } = authInfo;

  const loadNextPage = () => {
    refetch(
      fetchQuery,
      { count: 10 },
      null,
      () => {
        setLoads((v) => v + 1);
        console.log("loaded more");
      },
      {
        force: true,
      }
    );
  };

  return (
    <>
      <Button onClick={() => loadNextPage()}>Load More</Button>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        {edges.map(({ node: activity }) => (
          <Grid item key={activity.activityId}>
            <div>{activity.name}</div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

UnviewedActivities.propTypes = propTypes;
export default UnviewedActivities;

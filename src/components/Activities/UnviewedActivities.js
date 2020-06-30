import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import ActivityCard from './ActivityCard';
import { Grid, Button } from '@material-ui/core';
import { usePagination } from 'relay-hooks';

const propTypes = {
  authInfo: PropTypes.object.isRequired,
};

const getCurrentUrl = () => {
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
};
const redirectUri = `${getCurrentUrl()}/login`;
const source = 'google';

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

const connectionConfig = {
  direction: 'forward',
  query: graphql`
    query UnviewedActivitiesRefetchQuery(
      $redirectUri: String!
      $source: String!
      $count: Int!
      $cursor: ID
    ) {
      authInfo(redirectUri: $redirectUri, source: $source) {
        ...UnviewedActivities_authInfo
          @arguments(cursor: $cursor, count: $count)
      }
    }
  `,
  getConnectionFromProps(props) {
    return props.viewer.list;
  },
  getFragmentVariables(previousVariables, totalCount) {
    return {
      ...previousVariables,
      count: totalCount,
    };
  },
  getVariables(_props, { count, cursor }) {
    return {
      count: count,
      cursor,
      redirectUri,
      source,
    };
  },
};

const UnviewedActivities = (props) => {
  const [authInfo, { hasMore, isLoading, loadMore }] = usePagination(
    fragmentSpec,
    props.authInfo
  );
  const [, setLoads] = useState(0);
  const [selected, setSelected] = useState([]);

  const {
    viewer: {
      list: { edges },
    },
  } = authInfo;

  useEffect(() => {
    const key = 'app:selectedActivities';
    const item = localStorage.getItem(key);
    if (item) {
      setSelected(JSON.parse(item));
    } else {
      localStorage.setItem(key, JSON.stringify([]));
    }
  }, []);

  const loadNextPage = () => {
    if (!hasMore() || isLoading()) {
      return;
    }
    loadMore(
      connectionConfig,
      5,
      null,
      () => {
        setLoads((v) => v + 1);
        console.log('loaded more');
      },
      {
        force: true,
      }
    );
  };

  const addActivity = (id, pass) => {
    const key = 'app:selectedActivities';
    const stored = localStorage.getItem(key) || [];
    const parsed = stored instanceof Array ? stored : JSON.parse(stored);
    const selected = [...parsed, { id, pass }];
    localStorage.setItem(key, JSON.stringify(selected));
    setSelected(selected);

    const remaining = edges.filter(
      ({ node: a }) => !selected.some((s) => s.id === a.activityId)
    );

    if (remaining.length === 1) {
      loadNextPage();
    }
  };

  const remaining = edges.filter(
    ({ node: a }) => !selected.some((s) => s.id === a.activityId)
  );

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
        {remaining.map(({ node: activity }) => (
          <Grid item key={activity.activityId}>
            <ActivityCard {...activity} addActivity={addActivity} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

UnviewedActivities.propTypes = propTypes;
export default UnviewedActivities;

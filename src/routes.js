import Route from "found/Route";
import makeRouteConfig from "found/makeRouteConfig";
import React from "react";
import { graphql } from "babel-plugin-relay/macro";
import App from "./App";
import Activities from "./components/Activities";

const ActivitiesQuery = graphql`
  query routes_Activities_Query($redirectUri: String!, $source: String!) {
    authInfo(redirectUri: $redirectUri, source: $source) {
      ...Activities_authInfo
    }
  }
`;

const AppQuery = graphql`
  query routes_App_Query($redirectUri: String!, $source: String!) {
    authInfo(redirectUri: $redirectUri, source: $source) {
      ...App_authInfo
    }
  }
`;

const getCurrentUrl = () => {
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
};
const redirectUri = `${getCurrentUrl()}/login`;
const source = "google";

export default makeRouteConfig(
  <Route
    path="/"
    Component={App}
    query={AppQuery}
    prepareVariables={(params) => ({
      ...params,
      redirectUri,
      source,
    })}
  >
    <Route
      Component={Activities}
      query={ActivitiesQuery}
      prepareVariables={(params) => ({
        ...params,
        redirectUri,
        source,
      })}
    />
  </Route>
);

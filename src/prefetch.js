import { graphql } from "babel-plugin-relay/macro";
import { loadQuery } from "relay-hooks";
import environment from "./relay-environment";

export const AppQuery = graphql`
  query prefetch_App_Query($redirectUri: String!, $source: String!) {
    authInfo(redirectUri: $redirectUri, source: $source) {
      ...App_authInfo
    }
  }
`;
const prefetch = loadQuery();
prefetch.next(environment, AppQuery, {}, { fetchPolicy: "store-or-network" });

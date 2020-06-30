import { Environment, Network, RecordSource, Store } from "relay-runtime";

function fetchQuery(operation, variables) {
  const token = localStorage.getItem("authToken");
  const source = localStorage.getItem("authSource") || "google";
  return fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "X-Auth-Source": source,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
    .then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Fetch Error:", err);
    });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;

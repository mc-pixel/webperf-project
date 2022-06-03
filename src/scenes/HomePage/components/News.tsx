import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { graphql } from "@apollo/client/react/hoc";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});

const query = gql`
  query NewsArticles {
    newsArticles {
      id
      title
      body
    }
  }
`;

export const News = () =>
  graphql(query)(() => {
    return null; // Some fancy news
  });

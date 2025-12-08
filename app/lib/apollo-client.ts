import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://localhost:10004/graphql",
    useGETForQueries: false, // Kesinlikle POST kullanılmasını sağlar
  }),
  cache: new InMemoryCache(),
});

export default client;

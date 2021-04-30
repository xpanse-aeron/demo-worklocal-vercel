import { GraphQLClient, gql } from "graphql-request";

export default async function userBookmarks (req, res) {
  const endpoint = "https://demo-database.hasura.app/v1/graphql";
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "onfgelUy2O1T0RDTI5JQWdLF34xbNMikX0Cg2nC7ZUVmeq9s600OmJB2f83nWCbO",
    },
  });
  const query = gql`
    query($id: String!) {
        users(where: {id: {_eq: $id}}) {
            bookmarks
          }
    }
  `;

  const variables = {
    id: req.body.id,
  };

  const data = await graphQLClient.request(query, variables);

  res.statusCode = 200;
  res.json(data.users);
};

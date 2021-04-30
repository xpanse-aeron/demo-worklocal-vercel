import { GraphQLClient, gql } from "graphql-request";

export default async function updateBookmarks(request, response) {
  const user_id = request.body.id;
  const ids = request.body.ids;

  try {
    const endpoint = "https://demo-database.hasura.app/v1/graphql";
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "onfgelUy2O1T0RDTI5JQWdLF34xbNMikX0Cg2nC7ZUVmeq9s600OmJB2f83nWCbO",
      },
    });
    const query = gql`
      mutation($id: String!, $data: jsonb) {
        update_users(where: {id: {_eq: $id}}, _set: {bookmarks: $data}) {
        affected_rows
        }
      }
    `;
    const variables = {
      id: user_id,
      data: ids,
    };

    const data = await graphQLClient.request(query, variables);
    response.status(200).json(data);
  } catch (error) {
    console.error(error);
    response.status(error.status || 500).end(error.message);
  }
}

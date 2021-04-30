import { GraphQLClient, gql } from "graphql-request";

export default async (req, res) => {
  const endpoint = "https://demo-database.hasura.app/v1/graphql";
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "onfgelUy2O1T0RDTI5JQWdLF34xbNMikX0Cg2nC7ZUVmeq9s600OmJB2f83nWCbO",
    },
  });
  const query = gql`
    {
			job_list_aggregate {
				aggregate {
					count
				}
			}
    }
  `;

  const data = await graphQLClient.request(query);

  res.statusCode = 200;
  res.json(data.job_list_aggregate.aggregate.count);
};

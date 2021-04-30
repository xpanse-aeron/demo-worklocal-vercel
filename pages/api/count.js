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
			full_time: job_list_aggregate(where: {js_employment_type: {_eq: "Full-Time"}}) {
				aggregate {
					count
				}
			}
      part_time: job_list_aggregate(where: {js_employment_type: {_eq: "Part-Time"}}) {
				aggregate {
					count
				}
			}
      intern: job_list_aggregate(where: {js_employment_type: {_eq: "Internship"}}) {
				aggregate {
					count
				}
			}
      contract: job_list_aggregate(where: {js_employment_type: {_eq: "Contract"}}) {
				aggregate {
					count
				}
			}
    }
  `;

  const data = await graphQLClient.request(query);

  const list = {
    full_time: data.full_time.aggregate.count,
    part_time: data.part_time.aggregate.count,
    intern: data.intern.aggregate.count,
    contract: data.contract.aggregate.count,
  }

  res.statusCode = 200;
  res.json(list);
};

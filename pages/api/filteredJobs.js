import { GraphQLClient, gql } from "graphql-request";

export default async function Filter (req, res) {
  const endpoint = "https://demo-database.hasura.app/v1/graphql";
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "onfgelUy2O1T0RDTI5JQWdLF34xbNMikX0Cg2nC7ZUVmeq9s600OmJB2f83nWCbO",
    },
  });
  const query = gql`
    query($name: String, $place: String, $company: String, $special: String, $type: String, $date: date, $order: order_by) {
      job_list(where: {js_company_name: {_ilike: $company}, js_employment_type: {_ilike: $type}, _or: {js_position_title: {_ilike: $name}, js_work_location: {_ilike: $place}, specialization: {name: {_ilike: $special}}}, date_added: {_lte: $date}}, order_by: {date_added: $order}) {
        id
        is_status
        js_ad_expiration
        js_advisertiser_id
        js_canonical_url
        js_company_industry
        js_company_name
        js_company_overview_all
        js_company_size
        js_employment_type
        js_id
        js_is_recruitment_firm
        js_job_description
        js_meta_description
        js_meta_title
        js_position_title
        js_posted_date
        js_salary_max
        js_url
        js_work_location
        time_added
        time_updated
        date_added
        date_updated
        specialization {
          name
        }
        origin
      }
    }
  `;

  const variables = {
    name: req.body.title,
    place: req.body.location,
    company: req.body.company,
    special: req.body.specialization,
    type: req.body.type,
    date: req.body.date,
    order: req.body.order
  };

  const data = await graphQLClient.request(query, variables);

  res.statusCode = 200;
  res.json(data.job_list);
};

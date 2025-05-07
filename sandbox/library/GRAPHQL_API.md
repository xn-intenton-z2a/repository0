# GRAPHQL_API

## Crawl Summary
GitHub GraphQL API: POST endpoint https://api.github.com/graphql with JSON payload {query, variables}. Authenticate via header Authorization: bearer <token>, Accept: application/vnd.github.v4+json. Introspect schema via __schema query. Use cursor-based pagination with first:Int (max 100) and after:String, read pageInfo and nodes. Monitor rate limits via rateLimit query and HTTP headers X-RateLimit-Remaining. Global node IDs are base64 encoded "TypeName:ID" and fetched via node(id:ID). Core operations: repository(owner,name), rateLimit, node(id). Handle errors: 401 unauthorized, 422 syntax errors with locations.

## Normalised Extract
Table of Contents
1 Authentication
2 Endpoint Configuration
3 Schema Introspection
4 Query Execution
5 Pagination
6 Rate Limiting
7 Global Node IDs

1 Authentication
Header "Authorization": "bearer <PERSONAL_ACCESS_TOKEN>"
Header "Accept": "application/vnd.github.v4+json"
Header "Content-Type": "application/json"

2 Endpoint Configuration
URL: POST https://api.github.com/graphql
TLS: TLS1.2+

3 Schema Introspection
Payload: {"query":"{ __schema { queryType { name } mutationType { name } types { name kind fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } } }"}
Response path: data.__schema

4 Query Execution
HTTP Method: POST
JSON body keys: query: String, variables: Object (optional)
Response: data key mirrors query shape, errors: array

5 Pagination
Arguments on connection fields: first: Int(default 30, max 100), after: String(cursor)
Fields returned: edges [{ node, cursor }], pageInfo { hasNextPage:Boolean, endCursor:String }
Loop pattern: while pageInfo.hasNextPage fetch next page using after=endCursor

6 Rate Limiting
GraphQL query: { rateLimit { limit cost remaining resetAt } }
Headers: X-RateLimit-Limit:Int, X-RateLimit-Remaining:Int, X-RateLimit-Reset:Int(timestamp)

7 Global Node IDs
ID format: base64("TypeName:ID")
Fetch by ID: query { node(id:ID!) { __typename id } }


## Supplementary Details
GraphQL Version: v4
Schema download: https://docs.github.com/public/schema.docs.graphql
Explorer URL: https://docs.github.com/en/graphql/overview/explorer
Authentication scopes: repo, user, admin:org (depending on data access)
Default query complexity limit: 5000 cost points per hour
Cost per field: see schema __type(name:"RateLimit"){...}
Pagination default page size: 30
Maximum page size: 100
Error object structure: { message: String!, locations: [{ line:Int!, column:Int! }], path: [String | Int] }


## Reference Details
Schema Types
-----------
type Query {
  repository(owner: String!, name: String!): Repository
  rateLimit: RateLimit!
  node(id: ID!): Node
}

type RateLimit {
  limit: Int!
  cost: Int!
  remaining: Int!
  resetAt: DateTime!
}

type Repository {
  id: ID!
  name: String!
  owner: RepositoryOwner!
  issues(first: Int, after: String, states: [IssueState!]): IssueConnection!
}

enum IssueState { OPEN CLOSED }

type IssueConnection {
  nodes: [Issue!]!
  pageInfo: PageInfo!
}

type Issue {
  id: ID!
  number: Int!
  title: String!
  url: URI!
  state: IssueState!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

SDK Method Signature (Octokit)
-----------------------------
import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

octokit.graphql = function <T>(query: string, variables?: Record<string, any>): Promise<T>;

Code Example (TypeScript)
-------------------------
const query = `
  query ($owner: String!, $name: String!, $first: Int!, $after: String) {
    repository(owner: $owner, name: $name) {
      issues(first: $first, after: $after) {
        nodes { id number title state url }
        pageInfo { hasNextPage endCursor }
      }
    }
    rateLimit { remaining resetAt }
  }
`;

async function fetchIssues(owner: string, name: string) {
  let hasNext = true;
  let cursor: string | null = null;
  const allIssues = [];

  while (hasNext) {
    const result = await octokit.graphql<{ repository: { issues: { nodes: Array<{ id: string; number: number; title: string; state: string; url: string }>; pageInfo: { hasNextPage: boolean; endCursor: string } } }; rateLimit: { remaining: number; resetAt: string } }>(query, {
      owner,
      name,
      first: 100,
      after: cursor,
    });

    allIssues.push(...result.repository.issues.nodes);
    hasNext = result.repository.issues.pageInfo.hasNextPage;
    cursor = result.repository.issues.pageInfo.endCursor;
  }

  return allIssues;
}

Configuration Options
---------------------
Header Accept values:
  application/vnd.github.v4+json (default)
Content negotiation via media type parameters supported

Best Practices
--------------
- Specify only required fields in selection set
- Use pagination for large data sets
- Monitor rateLimit and batch queries accordingly
- Cache schema locally for validation

Troubleshooting
---------------
1 Unauthorized
  Command: curl -H "Authorization: bearer INVALID" -X POST -d '{"query":"{ rateLimit { remaining }}"}' https://api.github.com/graphql
  Response: 401 {"message":"Bad credentials"}

2 Syntax Error
  Command: curl -H "Authorization: bearer $TOKEN" -X POST -d '{"query":"{ repository(owner:\"foo\", name:\"bar\"{ id } }"}' https://api.github.com/graphql
  Response: 422 {"message":"Something went wrong","errors":[{"message":"Syntax Error","locations":[{"line":1,"column":50}]}]}

3 Rate Limit Exceeded
  Query: { rateLimit { remaining } }
  Response remaining: 0
  Action: wait until resetAt or reduce query cost


## Information Dense Extract
Auth: Authorization: bearer <token>; Accept: application/vnd.github.v4+json; POST https://api.github.com/graphql; Introspect: __schema query; Pagination: first:Int(max100), after:String -> pageInfo; RateLimit: query rateLimit and HTTP headers X-RateLimit-*; Node IDs: base64("Type:ID") via node(id); Core schema: Query.repository(owner:String!,name:String!)->Repository; rateLimit->RateLimit; node->Node; Octokit.graphql<T>(query: string, variables?): Promise<T>; Best practice: minimal selection, paginate, monitor rateLimit; Errors: 401 Bad credentials, 422 syntax error with locations.

## Sanitised Extract
Table of Contents
1 Authentication
2 Endpoint Configuration
3 Schema Introspection
4 Query Execution
5 Pagination
6 Rate Limiting
7 Global Node IDs

1 Authentication
Header 'Authorization': 'bearer <PERSONAL_ACCESS_TOKEN>'
Header 'Accept': 'application/vnd.github.v4+json'
Header 'Content-Type': 'application/json'

2 Endpoint Configuration
URL: POST https://api.github.com/graphql
TLS: TLS1.2+

3 Schema Introspection
Payload: {'query':'{ __schema { queryType { name } mutationType { name } types { name kind fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } } }'}
Response path: data.__schema

4 Query Execution
HTTP Method: POST
JSON body keys: query: String, variables: Object (optional)
Response: data key mirrors query shape, errors: array

5 Pagination
Arguments on connection fields: first: Int(default 30, max 100), after: String(cursor)
Fields returned: edges [{ node, cursor }], pageInfo { hasNextPage:Boolean, endCursor:String }
Loop pattern: while pageInfo.hasNextPage fetch next page using after=endCursor

6 Rate Limiting
GraphQL query: { rateLimit { limit cost remaining resetAt } }
Headers: X-RateLimit-Limit:Int, X-RateLimit-Remaining:Int, X-RateLimit-Reset:Int(timestamp)

7 Global Node IDs
ID format: base64('TypeName:ID')
Fetch by ID: query { node(id:ID!) { __typename id } }

## Original Source
GitHub GraphQL API
https://docs.github.com/en/graphql

## Digest of GRAPHQL_API

# GitHub GraphQL API Technical Details (Retrieved: 2024-06-07)

# Authentication
Header: Authorization: bearer <PERSONAL_ACCESS_TOKEN>
Accept: application/vnd.github.v4+json
Content-Type: application/json

# Endpoint
POST https://api.github.com/graphql

# Schema Introspection
Request payload: { "query": "{ __schema { queryType { name } mutationType { name } types { name kind fields { name args { name type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } } } }" }
Response: JSON root __schema with type definitions

# Pagination
Arguments: first: Int (max 100, default 30), after: String (cursor)
Response connection: edges { node, cursor }, nodes: [Type], pageInfo { hasNextPage: Boolean!, endCursor: String }

# Rate Limiting
Query: { rateLimit { limit: Int!, cost: Int!, remaining: Int!, resetAt: DateTime! } }
HTTP headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

# Global Node IDs
Format: base64("TypeName:ID")
Query: node(id: ID!): Node

# Core Queries
repository(owner: String!, name: String!): Repository
rateLimit: RateLimit!
node(id: ID!): Node

# Common Errors
401 Unauthorized – missing/invalid token
422 QuerySyntaxError – inspect errors[0].message and errors[0].locations

# Attribution
Data Size: 2418823 bytes
Links Found: 21362


## Attribution
- Source: GitHub GraphQL API
- URL: https://docs.github.com/en/graphql
- License: CC BY 4.0
- Crawl Date: 2025-05-07T12:32:19.005Z
- Data Size: 2418823 bytes
- Links Found: 21362

## Retrieved
2025-05-07

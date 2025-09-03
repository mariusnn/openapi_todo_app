# Getting from an OpenAPI-spec to a production-ready service
My reproduction of Greating an API-Backend from OpenAPI-spec using tooling for input validation and boilerplate

Using `openapi-typescript-validator` to generate validators (which produces code using `ajv` for the actual runtime validation)

# Starting point:
 - Some [openapi-spec](./src/openapi.yaml)
 - Initialized repo (`npm init`)

# The path
## Install dependencies
```
npm i typescript --save-dev
npm i openapi-typescript-validator --save-dev
npm i ajv
npm i express
npm i @types/express --save-dev
npm i ts-node --save-dev
```

## Prepare for code-generation
Save as [`scripts/generateScemas.js`](./scripts/generateSchemas.js):
```
const path = require('path');
const { generate } = require('openapi-typescript-validator');

generate({
  schemaFile: path.join(__dirname, '../src/openapi.yaml'),
  schemaType: 'yaml',
  directory: path.join(__dirname, '../src/_generated')
})
```
Expose in script-section of package.json:
```
    "generateSchemas": "node scripts/generateSchemas.js",
```

## Generate the types and validators
`npm run generateSchemas` (or `node scripts/generateSchemas.js`)
This produces the `src/_generated`-content with its validators and types

## Manually create the Application- and Authorizer-types
First map the securitySchemes from OpenAPI to `AuthDecoders` with one type for each.
Then map all the paths from OpenAPI to `Application`. See example below

```
import { NewTodo, Todo, TodoArray, UpdateTodo } from "../_generated/models";

export type AuthDecoders<T1> = {
    // One decoder per security scheme in the OpenAPI spec
    bearerAuth: (token: string | undefined) => Promise<T1>;
}

// bearerAuthPayload is the type returned by the bearerAuth decoder
export type Application<T1> = {
    getTodos: (authInfo: T1, payload: null) => Promise<TodoArray>;
    postTodos: (authInfo: T1, payload: NewTodo) => Promise<Todo>;
    getTodos_$id: (authInfo: T1, payload: null, params: {id: string}) => Promise<Todo>;
    putTodos_$id: (authInfo: T1, payload: UpdateTodo, params: {id: string} & Partial<NewTodo>) => Promise<Todo>;
    deleteTodos_$id: (authInfo: T1, payload: null, params: {id: string}) => Promise<void>;
}
```

## Manually create the requestHandler
Using the util [`handleAuthorizedRequest`](./src/_generatedManually/requestHandler.ts) to decode authorization and payload and params into something that is callable on the Application


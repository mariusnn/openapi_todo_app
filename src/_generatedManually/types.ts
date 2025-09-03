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
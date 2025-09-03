import { NewTodo, Todo, TodoArray, UpdateTodo } from "../_generated/models";
import { Application } from "../_generatedManually/types";
import { AuthInfo } from "./authorizer";


export class TodoApplication implements Application<AuthInfo> {
    private todos: Record<string, TodoArray> = {};

    async getTodos(authInfo: AuthInfo, payload: null): Promise<TodoArray> {
        return this.todos[authInfo.userId] || [];
    }

    async postTodos(authInfo: AuthInfo, payload: NewTodo): Promise<Todo> {
        const newTodo: Todo = {
            ...payload,
            id: (Math.random() * 1000000).toFixed(0),
            completed: false,
        };
        if (!this.todos[authInfo.userId]) {
            this.todos[authInfo.userId] = [];
        }
        this.todos[authInfo.userId].push(newTodo);
        return newTodo;
    }

    async getTodos_$id(authInfo: AuthInfo, payload: null, params: { id: string }): Promise<Todo> {
        const userTodos = this.todos[authInfo.userId] || [];
        const todo = userTodos.find(t => t.id === params.id);
        if (!todo) {
            throw new Error("Todo not found");
        }
        return todo;
    }

    async putTodos_$id(authInfo: AuthInfo, payload: UpdateTodo, params: { id: string } & Partial<NewTodo>): Promise<Todo> {
        const userTodos = this.todos[authInfo.userId] || [];
        const todoIndex = userTodos.findIndex(t => t.id === params.id);
        if (todoIndex === -1) {
            throw new Error("Todo not found");
        }
        const updatedTodo = { ...userTodos[todoIndex], ...payload };
        userTodos[todoIndex] = updatedTodo;
        return updatedTodo;
    }

    async deleteTodos_$id(authInfo: AuthInfo, payload: null, params: { id: string }): Promise<void> {
        const userTodos = this.todos[authInfo.userId] || [];
        const todoIndex = userTodos.findIndex(t => t.id === params.id);
        if (todoIndex === -1) {
            throw new Error("Todo not found");
        }
        userTodos.splice(todoIndex, 1);
    }
}
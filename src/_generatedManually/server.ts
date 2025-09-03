import express from "express"
import { Application, AuthDecoders } from "./types"
import { EmptyPaylodDecoder, handleAuthorizedRequest } from "./requestHandler";
import { NewTodoDecoder, UpdateTodoDecoder } from "../_generated/decoders";

export function makeApp<T1>(authDecoders: AuthDecoders<T1>, application: Application<T1>): express.Express {
    const app = express();
    app.use(express.json());

    app.get('/openapi.yaml', (req, res) => { 
        res.setHeader('Content-Type', 'text/yaml');
        res.sendFile('openapi.yaml', {root: `${__dirname}/..`});
    });

    app.get('/todos', handleAuthorizedRequest(
        authDecoders.bearerAuth,
        EmptyPaylodDecoder,
        (auth, body) => application.getTodos(auth, body)
    ));

    app.post('/todos', handleAuthorizedRequest(
        authDecoders.bearerAuth,
        NewTodoDecoder,
        (auth, body) => application.postTodos(auth, body)
    ));

    app.get('/todos/:id', handleAuthorizedRequest(
        authDecoders.bearerAuth,
        EmptyPaylodDecoder,
        (auth, body, req) => application.getTodos_$id(auth, body, {id: req.params.id})
    ));

    app.put('/todos/:id', handleAuthorizedRequest(
        authDecoders.bearerAuth,
        UpdateTodoDecoder,
        (auth, body, req) => application.putTodos_$id(auth, body, {id: req.params.id})
    ));

    app.delete('/todos/:id', handleAuthorizedRequest(
        authDecoders.bearerAuth,
        EmptyPaylodDecoder,
        (auth, body, req) => application.deleteTodos_$id(auth, body, {id: req.params.id})
    ));

    return app;
}
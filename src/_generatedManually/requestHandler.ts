import type { Request, Response } from "express";
import { AppError } from "./errors";

type Decoder<T> = { // Compatible with the generated decoders
    decode: (json: unknown) => T;
};

export const EmptyPaylodDecoder: Decoder<null> = {decode: () => null};

export const handleAuthorizedRequest = <TAuth, TPayload>(
    authDecoder: (token: string | undefined) => Promise<TAuth>,
    payloadDecoder: Decoder<TPayload>,
    handler: (auth: TAuth, payload: TPayload, _req: Request) => Promise<any>
) => {
    return async (req: Request, res: Response) => {
        let authInfo: TAuth;
        try {
            authInfo = await authDecoder(req.headers['authorization']);
        } catch (error) {
            res.status(401).json({errorMessage: error instanceof Error ? error.message : 'Invalid token'});
            return;
        }

        let payload: TPayload;
        try {
            payload = payloadDecoder.decode(req.body ?? null);
        } catch (error) {
            res.status(400).json({errorMessage: error instanceof Error ? error.message : 'Invalid request body'});
            return;
        }

        try {
            const result = await handler(authInfo, payload, req)
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({errorMessage: error.message});
            } else {
                console.error('Error processing request:', error);
                res.status(500).json({errorMessage: 'Internal server error'});
            }
        }
    };
}

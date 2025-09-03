export type AuthInfo = {
    userId: string;
};

const decodeJwtToken = async (authHeader: string | undefined): Promise<AuthInfo> => {
    if (!authHeader) {
        throw new Error('Authorization header is missing');
    }
    if (!authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header format');
    }
    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // TODO: Implement actual JWT verification logic here
    if (token === "valid-token") {
        return {userId: "user-123"};
    } else {
        throw new Error('Invalid token');
    }
}

export const AppDecoders = {
    bearerAuth: decodeJwtToken,
};
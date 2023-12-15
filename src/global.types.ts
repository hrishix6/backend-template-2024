/**
 * //define properties here on express's Request object such as req.id or req.user
 * 
    declare module 'express-serve-static-core' {
        interface Request {
                user: User
                id: RequestId | string
        }
    }
 * 
 * 
 * 
 */

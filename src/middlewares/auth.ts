import { NextFunction, Request, Response } from "express";
import { validateToken } from "../helpers/jwt";

export function authentication(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers;

    if(!authorization){
        return response.status(401).json("Token not provided");
    }

    const [type, token] = authorization.split(" ");

    if(type !== "Bearer" || !token){
        return response.status(401).json("Invalid token format");
    }

    try{
        const decoded = validateToken(token);

        if(!request.body){
            request.body.token = decoded;
        }
    }catch(error){
        console.error(error);
        return response.status(401).json("Invalid Token");

    }
}
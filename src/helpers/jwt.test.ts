import {faker} from "@faker-js/faker";
import test, {describe} from "node:test"
import { generateToken } from "./jwt";
import jwt, {JwtPayload} from "jsonwebtoken";
import assert  from "node:assert";
import { validateToken } from "./jwt";




describe("testes  do generateToken", () =>{
    test("Deve gerar um token com expiração de 1 dia", () => {
        const id = faker.number.int();
        const token = generateToken({ id });

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        assert.deepStrictEqual(payload.id, id)
        assert.deepStrictEqual(payload.exp! - payload.iat!, 1 *24 * 60 * 60);

    });

    test("Deve gerar um token com expiração customizada", () =>{
        const id  = faker.number.int();
        const expiresIn = faker.number.int({min: 1, max: 120});
        const token = generateToken ({ id }, `${expiresIn}m`);

        const payload =jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        assert.deepStrictEqual(payload.id, id);
        assert.deepStrictEqual(payload.exp! - payload.iat!, expiresIn * 60)
    });

});

describe("Teste do validateToken:", () =>{
    test("Deve validar um token válido", () => {
        const id = faker.number.int();
        const token = jwt.sign({id}, process.env.JWT_SECRET!);

        const payload = validateToken(token);

        assert.deepStrictEqual(payload.id, id);
    });

    test("Deve retornar todos os dados", () => {
        const data = {
            id: faker.number.int(),
            name: faker.person.firstName(),
            email: faker.internet.email(),
        };

        const token = jwt.sign(data, process.env.JWT_SECRET!);

        const payload = validateToken(token);

        assert.deepStrictEqual(payload.id, data.id)
        assert.deepStrictEqual(payload.name, data.name);
        assert.deepStrictEqual(payload.email, data.email);
    });

    test("Deve retornar erro para tokens invalidos", ()=>{
        assert.throws(() => validateToken(faker.string.alphanumeric(30)));
    });

       test("Deve retornar erro para tokens vazios", ()=>{
        assert.throws(() => validateToken(""))
    });

       test("Deve retornar erro para tokens expiradosd", async ()=>{
        const id= faker.number.int();
        const token = jwt.sign({id}, process.env.JWT_SECRET!, {
            expiresIn:"1MS"
        });

        await new Promise((resolve) => setTimeout(resolve, 10));

        assert.throws(()=> validateToken(token))
    });
})
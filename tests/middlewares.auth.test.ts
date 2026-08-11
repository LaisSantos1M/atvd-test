import  request  from "supertest";
import test, { describe } from "node:test";
import app from "../src/app";
import  assert  from "node:assert";
import {faker} from "@faker-js/faker"

describe("Testes do middleware authentication:", ()=>{
    test("Deve retornar erro quando o token não for informado", async () => {
        const response = await request(app).delete("/users/0")

        assert.deepStrictEqual(response.status, 401);
        assert.deepStrictEqual(response.body, "Token not provided");
    });

    test("Deve retornar erro quando o formato do token for invalido", async()=>{
        const response = await request(app).delete("/users/0").set("Authorization", faker.string.alphanumeric(5))

        assert.deepStrictEqual(response.status, 401);
        assert.deepStrictEqual(response.body, "Invalid token format")
    });

    test("Deve retornar erro quando o formato é valido mas o token esta vazio", async ()=>{
        const response = await request(app).delete("/users/0").set("Authorization", "Bear");

        assert.deepStrictEqual(response.status, 401);
        assert.deepStrictEqual(response.body, "Invalid token format");
    });
    test("Deve retornar erro quando o token for invalido", async()=>{
           const response = await request(app).delete("/users/0").set("Authorization", `Bear ${faker.string.alphanumeric(30)}`);

        assert.deepStrictEqual(response.status, 401);
        assert.deepStrictEqual(response.body, "Invalid token");
    });
});
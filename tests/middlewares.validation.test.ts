import test from "node:test"
import {prisma} from "../config/prisma"
import  request from "supertest";
import app from "../src/app"
import assert from "node:assert";

test.before(() =>{
    console.error = () => {};
});

test.beforeEach(async() =>{
    await prisma.user.deleteMany();
});

test.after(async()=>{
    await prisma.$disconnect();
});

test("Deve retornar erro ao passar um id que não é um numero", async()=>{
    const response = await request(app).get("/users/a");

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "Invalid id");
});

test("Deve retornar erro ao passar um id 0", async()=>{
    const response = await request(app).get("/users/0");

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "Invalid id");
});

test("Deve retornar erro ao passar um id é um numero negativo", async()=>{
    const response = await request(app).get("/users/-1");

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "Invalid id");
});
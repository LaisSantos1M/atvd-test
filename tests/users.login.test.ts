import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { describe } from "node:test";
import app from "../src/app";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { validateToken } from "../src/helpers/jwt";


test.before(() => {
    console.error = () => { };
});

test.beforeEach(async () => {
    await prisma.user.deleteMany();
});

test.after(async () => {
    await prisma.$disconnect();
});


describe("Teste da controller do login:", () => {
    test("Deve realizar o login com email e senha válidos", async () =>{
    const email = faker.internet.email();
    const password = faker.string.alphanumeric(5);

    const user = await prisma.user.create({
        data:{
            name: faker.person.firstName(),
            email,
            password: bcrypt.hashSync(password, +process.env.BCRYPT_ROUNDS!),
        },
    });

    const response = await request(app).post("/users/login").send({
        email,
        password
    });
    assert.deepStrictEqual(response.status, 200);
    assert.ok(response.body);

    const payload = validateToken(response.body);

    assert.deepStrictEqual(payload.id, user.id);
    assert.deepStrictEqual(payload.password, undefined);
    
    });

    test("Deve retornar erro se o email não for informado", async () => {
        const response = await request(app).post("/users/login").send({
            password: faker.string.alphanumeric(5),
        });
        assert.deepStrictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, "Email and password are required")
    });

      test("Deve retornar erro se a senha não for informada", async () => {
    const response = await request(app).post("/users/login").send({
      email: faker.internet.email(),
    });

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "Email and password are required");
  });

    test("Deve retornar erro para usuario inexistente", async () =>{
        const response = await request(app).post("/users/login").send({
            email: faker.internet.email(),
            password: faker.string.alphanumeric(5),
        });

        assert.deepStrictEqual(response.status, 401);
        assert.deepStrictEqual(response.body, "Invalid email or password");
    });


    test("Deve retornar erro para senha incorreta ", async ()=>{
        const user = await prisma.user.create({
            data:{
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: bcrypt.hashSync(
                    faker.string.alphanumeric(5),
                    +process.env.BCRYPT_ROUNDS!,
                ),
            },
        });
        const response = await request(app).post("/users/login").send({
            email: user.email,
            password: faker.string.alphanumeric(5),
        });

        assert.deepStrictEqual(response.status, 401);
        assert.deepStrictEqual(response.body, "Invalid email or password")
    });
});

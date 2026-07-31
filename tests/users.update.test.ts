import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app";
import { prisma } from "../config/prisma";

test.beforeEach(async () => {
  await prisma.user.deleteMany();
});

test.after(async () => {
  await prisma.$disconnect();
});

test("Deve atualizar um usuário", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    });

    const newData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
    };

    const response = await request(app)
        .put(`/users/${user.id}`)
        .send(newData);

    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.name, newData.name);
    assert.deepStrictEqual(response.body.email, newData.email);
});

test("Deve atualizar apenas o nome de um usuário", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    });

    const newName = faker.person.firstName();

    const response = await request(app)
        .put(`/users/${user.id}`)
        .send({ name: newName });

    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.name, newName);
    assert.deepStrictEqual(response.body.email, user.email);
});

test("Deve retornar erro se tentar atualizar um usuário que não existe", async () => {
    const response = await request(app)
        .put("/users/9999")
        .send({ name: faker.person.firstName() });

    assert.deepStrictEqual(response.status, 500);
});

test("Deve retornar erro se tentar atualizar um email já existente", async () => {
    const email = faker.internet.email();

    await prisma.user.create({
        data: { name: faker.person.firstName(), email },
    });

    const user = await prisma.user.create({
        data: { name: faker.person.firstName(), email: faker.internet.email() },
    });

    const response = await request(app)
        .put(`/users/${user.id}`)
        .send({ email });

    assert.deepStrictEqual(response.status, 409);
});

test("Deve retornar erro se tentar atualizar um email inválido", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    });

    const response = await request(app)
        .put(`/users/${user.id}`)
        .send({email: "teste",});

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body, "Invalid email");
});
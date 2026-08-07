import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { describe } from "node:test";
import app from "../src/app";
import { prisma } from "../config/prisma";

test.before(() => {
  console.error = () => { };
});

test.beforeEach(async () => {
  await prisma.user.deleteMany();
});

test.after(async () => {
  await prisma.$disconnect();
});

describe("Testes da controller users update", () => {
  test("Deve atualizar um usuário", async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(),

      },
    });

    const newUser = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(),

    };

    const response = await request(app).put(`/users/${user.id}`).send(newUser);

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.name, newUser.name);
    assert.deepStrictEqual(response.body.email, newUser.email);
    assert.deepStrictEqual(updatedUser?.name, newUser.name);
    assert.deepStrictEqual(updatedUser?.email, newUser.email);
    assert.deepStrictEqual(response.body.password, undefined);
        assert.deepStrictEqual(updatedUser?.password, undefined);
    

  });

  test("Deve atualizar apenas o nome de um usuário", async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(),

      },
    });

    const newUser = {
      name: faker.person.firstName(),
      password: faker.string.alphanumeric(),

    };

    const response = await request(app).put(`/users/${user.id}`).send(newUser);

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.name, newUser.name);
    assert.deepStrictEqual(response.body.email, user.email);
    assert.deepStrictEqual(updatedUser?.name, newUser.name);
    assert.deepStrictEqual(updatedUser?.email, user.email);
        assert.deepStrictEqual(response.body.password, undefined);
        assert.deepStrictEqual(updatedUser?.password, undefined);
    
  });

  test("Deve retornar erro ao tentar atualizar um usuário inexistente", async () => {
    const newUser = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    };
    const response = await request(app).put("/users/9999").send(newUser);

    assert.deepStrictEqual(response.status, 404);
    assert.deepStrictEqual(
      response.body,
      "An operation failed because it depends on one or more records that were required but not found. No record was found for an update.",
    );
  });

  test("Deve retornar erro se tentar atualizar um email já existente", async () => {
    const email = faker.internet.email();
    await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email,
        password: faker.string.alphanumeric(),

      },
    });

    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(),

      },
    });

    const response = await request(app).put(`/users/${user.id}`).send({ email });

    assert.deepStrictEqual(response.status, 409);
    assert.deepStrictEqual(
      response.body,
      "Unique constraint failed on the fields: (`email`)",
    );
  });

  test("Deve retornar erro ao tentar atualizar um email inválido", async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(),

      },
    });

    const response = await request(app)
      .put(`/users/${user.id}`)
      .send({ email: "teste" });

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "Invalid email");
  });
});
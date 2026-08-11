import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { describe } from "node:test";
import app from "../src/app";
import { prisma } from "../config/prisma";
import { generateToken } from "../src/helpers/jwt";

test.before(() => {
  console.error = () => { };
});

test.beforeEach(async () => {
  await prisma.user.deleteMany();

});

test.after(async () => {
  await prisma.$disconnect();
});

describe("Testes da controller users create", () => {

  test("Deve cadastrar um usuário", async () => {
    const user = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(),
    };
    const token = generateToken({ id: 1 }, "10m");
    const response = await await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(user);

    assert.deepStrictEqual(response.status, 201);
    assert.deepStrictEqual(response.body.name, user.name);
    assert.deepStrictEqual(response.body.email, user.email);
    assert.ok(response.body.id);
    assert.deepStrictEqual(response.body.password, undefined);
  });

  test("Deve retornar erro se o email não for informado", async () => {
    const token = generateToken({ id: 1 }, "10m");
    const response = await request(app).set("Authorization", `Bearer ${token}`).post("/users").send({
      name: faker.person.firstName(),
    });



    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "User data incomplete");
  });

  test("Deve permitir cadastrar um usuário sem nome", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(),

    };

    const token = generateToken({ id: 1 }, "10m");
    const response = await request(app).post("/users").set("Authorization", `Bearer ${token}`).send(user);

    assert.deepStrictEqual(response.status, 201);
    assert.deepStrictEqual(response.body.email, user.email);
    assert.deepStrictEqual(response.body.name, null);
    assert.deepStrictEqual(response.body.password, undefined);
    assert.ok(response.body.id);
  });

  test("Deve retornar erro ao cadastrar um email duplicado", async () => {
    const email = faker.internet.email();
    await request(app).post("/users").send({
      name: faker.person.firstName(),
      email,
      password: faker.string.alphanumeric()
    });
    const token = generateToken({ id: 1 }, "10m");

    const response = await request(app).post("/users").set("Authorization", `Bearer ${token}`).send({
      name: faker.person.firstName(),
      email,
      password: faker.string.alphanumeric()
    });

    assert.deepStrictEqual(response.status, 409);
    assert.deepStrictEqual(
      response.body,
      "Unique constraint failed on the fields: (`email`)",
    );
  });

  test("Deve retornar erro caso a senha não seja informada", async () => {
    const token = generateToken({ id: 1 }, "10m");
    const response = await request(app).post("/users").set("Authorization", `Bearer ${token}`).send({
      name: faker.person.firstName(),
      email: faker.internet.email(),
    });

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "User data incomplete");
  });



  test("Deve retornar erro caso o email seja inválido", async () => {
    const token = generateToken({ id: 1 }, "10m");
    const response = await request(app).post("/users").set("Authorization", `Bearer ${token}`).send({
      name: faker.person.firstName(),
      email: "teste",
      password: faker.string.alphanumeric()
    });

    assert.deepStrictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, "Invalid email");
  });
});
import test, { describe } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { generateToken } from "../src/helpers/jwt";
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

describe("Testes da controller users delete", () => {
  test("Deve deletar um usuário", async () => {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.string.alphanumeric(),
      },
    });
    const token = generateToken({ id: 1 }, "10m");

    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    const deletedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body.id, user.id);
    assert.deepStrictEqual(response.body.name, user.name);
    assert.deepStrictEqual(response.body.email, user.email);
    assert.deepStrictEqual(response.body.password, undefined);
    assert.deepStrictEqual(deletedUser, null);
  });

  test("Deve retornar erro ao deletar um usuário inexistente", async () => {
    const token = generateToken({ id: 1 }, "10m");
    const response = await request(app)
    .delete("/users/999")
    .set("Authorization", `Bearer ${token}`);


    assert.deepStrictEqual(response.status, 404);
    assert.deepStrictEqual(
      response.body,
      "An operation failed because it depends on one or more records that were required but not found. No record was found for a delete.",
    );
  });
});
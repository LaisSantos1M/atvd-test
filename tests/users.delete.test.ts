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

test("Deve deletar um usuário", async () => {
  const user = await prisma.user.create({
    data: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    },
  });

  const response = await request(app).delete(`/users/${user.id}`);

  assert.deepStrictEqual(response.status, 200);

  const deletedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  assert.deepStrictEqual(deletedUser, null);
});

test("Deve retornar erro se tentar deletar um usuário inexistente", async () => {
  const response = await request(app).delete("/users/999");

  assert.deepStrictEqual(response.status, 404);
});
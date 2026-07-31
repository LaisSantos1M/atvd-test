import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../src/app';
import { prisma } from '../config/prisma';



test.beforeEach(async () => {
    await prisma.user.deleteMany();
});

test("Deve buscar um um usuario pelo id", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    });

    const response = await request(app).get(`/users/${user.id}`);
    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, user);

});

test("Deve retornar erro se o usuario não existir", async () => {
    const response = await request(app).get(`/users/999`);

    assert.deepStrictEqual(response.status, 404);
    assert.deepStrictEqual(response.body, "User not found");
});


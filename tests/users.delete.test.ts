import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../src/app';
import { prisma } from '../config/prisma'; 


test("Deve buscar se o usuario não existir", async () => {

    const response = await request(app).put(`/users/999`).send({
        name:faker.person.firstName(),
        email:faker.internet.email(),
    });
});

test("Deve retornar erro se tentar deletar um usuário inersistente", async() => {
    const response = await request(app).delete(`/users/999`);   
});
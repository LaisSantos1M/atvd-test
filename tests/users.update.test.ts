import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../src/app';
import { prisma } from '../config/prisma'; 


test("Deve retornar erro se tentar atualizar um usuario que não existe", async () => {
    const response = await request(app).put(`/users/999`).send({
        name: faker.person.firstName(),
        email: faker.internet.email(),
    }); 

});

test("Deve retornar erro se tentar atualizar um usuario com email duplicado", async () => {
    const user1 = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },

    });    

        const user2 = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },  
})})

test("Deve atualizar um usuario", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    }); 
});

test("Deve atualizar somente o nome de um usuario", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    }); 
});

test("Deve retornar errro se tentar atualizar um usuario inexistente", async () => {
    const response = await request(app).put(`/users/999`).send({
        name: faker.person.firstName(),
        email: faker.internet.email(),
    }); 
});
import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { describe } from "node:test";
import app from "../src/app";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { response } from "express";


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

    const reponse = await request(app).post("users/login").send({
        email,
        password
    });
    assert.deepStrictEqual(response.status, 200);
    });
});

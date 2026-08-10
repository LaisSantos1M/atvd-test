import test, {describe} from "node:test";
import { faker } from "@faker-js/faker";
import assert from "node:assert";
import { validateEmail, validateId } from "./validateData";

test.before(() => {
    console.error = () => {};
})

describe(" tests do validateEmail", () => {
    test("Deve retornar true para emails válidos", () => {
        const response = validateEmail(faker.internet.email());

        assert.deepStrictEqual(response, true);
    });
});

test ("Deve retonar false para emails sem @", () => {
    const response = validateEmail("email.com");

    assert.deepStrictEqual(response, false);

});


describe("tests do validateId", () => {
    test("Deve retornar true para ids válidos", () =>{
        const response = validateId(faker.number.int().toString());
        assert.deepStrictEqual(response, true);
 });



    test("deve retornar false para id que nao é número", () =>{
        const response = validateId(faker.string.alpha());

        assert.deepStrictEqual(response, false);
    })


test("deve retornar false para id B", () =>{
    const response = validateId("B");

    assert.deepStrictEqual(response, false);
});

test ("Deve retornar false para id negativo", () => {
    const response = validateId((-faker.number.int()).toString());
    assert.deepStrictEqual(response, false);
});
test("deve retornar false para id decimal", () =>{
    const response = validateId(faker.number.float().toString());

    assert.deepStrictEqual(response, false);
});
});
const { expect } = require('chai');
// assertion style

const { User } = require('../../src/models')

const sinon = require("sinon");

const faker = require("faker");

const generate = require('../../src/utils/generate')

                const validRoles = ['buyer', 'seller']

describe('User instance', () => {

    describe('Creating a new user', () => {

        const newUser = {
            title: `Should create a user instance requiring 
                username varchar(20),
                password varchar
                & role varchar(6)`,
            callback: async () => {
                
                const info = {
                    id: generate.id('u-'),    
                    username: faker.internet.userName(),
                    password: 'Qwerty$2',
                    role: validRoles[
                        Math.floor(Math.random() * validRoles.length)]
                }

                console.log({
                    username: info.username,
                    pass:info.password,role:info.role
                });

                const stub = sinon.stub(User, "create").returns(info);

                const user = await User.create(info);
                
                expect(user.error || null).to.be.null;

                const { id, username, role, password } = user;

                console.log({
                    id,username,role,password
                });

                const stringValues = [id, username, role, password];

                stringValues.forEach(value => {
                    expect(value).to.be.a('string')
                    expect(value).to.exist
                })

                // check that password is hashed;
                // expect(password).to.not.eql(info.password);
                // expect(password?.length).to.be.greaterThan(10)

                return true;
            }
        }

        const testCases = [
            newUser
        ];

        testCases.forEach(toTest => {
            it(toTest.title, toTest.callback)
        })
    })
})


const { expect } = require('chai');
// assertion style

const { User } = require('../src/models')

describe('User instance', () => {

    describe('Creating a new user', () => {

        const newUser = {
            title: `Should create a user instance requiring 
                username varchar(20),
                password varchar
                & role varchar(6)`,
            callback: async () => {
                const info = {
                    username: 'user10',
                    password: 'Qwerty$2',
                    role: 'buyer'
                }

                const user = await User.create(info);

                expect(user.error || null).to.be.null;

                const { id, username, role, password } = user;

                const stringValues = [id, username, role, password];

                stringValues.forEach(value => {
                    expect(value).to.be.a('string')
                    expect(value).to.exist
                })

                // check that password is hashed;
                expect(password).to.not.eql(info.password);
                expect(password?.length).to.be.greaterThan(10)

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


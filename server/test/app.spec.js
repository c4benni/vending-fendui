// const assert = require('assert')

// const app = require('../src/app');

const Chai = require('chai');

// const ChaiHttp = require('chai-http');

// assertion style
// Chai.assert();

const assert = Chai.assert;

// Chai.use(ChaiHttp)

const { User } = require('../src/models')

describe('User API', () => {
    // test User model;

    it('should create a valid user object', async () => {
            const info = {
            username: 'emawiszssx',
            password: "qwertY$2",
            role: 'buyer'
        }

        const user = await User.create(info)

            assert.isNull(user.error || null)

        assert.isDefined(user)
        
        return true
    })
})


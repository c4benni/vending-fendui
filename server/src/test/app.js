const Chai = require('chai');

const server = require('../app');

const ChaiHttp = require('chai-http');

// assertion style
Chai.should();

Chai.use(ChaiHttp)

describe('User Api', () => {
    // test the get route

    describe('GET /api/v1/user', () => {
        it('it should Get all the task', (done) => {
            Chai.request(server).get('/api/v1/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done()
            })
        })
    })


    // test the get by id

    // test create product

    // test update product

    // test delete product
})

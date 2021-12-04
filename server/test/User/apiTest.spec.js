// const assert = require('assert')

const app = require('../../src/app')

const chai = require('chai');

const ChaiHttp = require('chai-http');
const { should } = require('chai');

// assertion style
chai.use(ChaiHttp)
chai.should();

const faker =require('faker')

// const base = 'api/v1'

                const validRoles = ['buyer', 'seller']

                
                const info = {
                    username: faker.internet.userName(),
                    password: 'Qwerty$2',
                    role: validRoles[
                        Math.floor(Math.random() * validRoles.length)]
                }
   
describe("User", () => {
    describe("POST /register", () => {
        // Test to get all students record
        it("should create a new user", (done) => {
             chai.request(app)
                 .post('/api/v1/user/register')
                 .set('content-type', 'application/json')
                 .send(info)
                 .end((err, res) => {
                     console.log({ res });
                     res.should.have.status(201)
                     done();
                  });
         });
        // // Test to get single student record
        // it("should get a single student record", (done) => {
        //      const id = 1;
        //      chai.request(app)
        //          .get(`/${id}`)
        //          .end((err, res) => {
        //              res.should.have.status(200);
        //              res.body.should.be.a('object');
        //              done();
        //           });
        //  });
         
        // // Test to get single student record
        // it("should not get a single student record", (done) => {
        //      const id = 5;
        //      chai.request(app)
        //          .get(`/${id}`)
        //          .end((err, res) => {
        //              res.should.have.status(404);
        //              done();
        //           });
        //  });
    });
});
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app  = require('../app'); // Assuming your Express app is exported as 'app'
// const dbStartup = require('../dbStartup');

// const { expect } = chai;
// chai.use(chaiHttp);

// describe("/healthz API", () => {
//   it("should return status 200 and success message", (done) => {
//     chai
//       .request(app)
//       .get("/healthz")
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         done();
//       });
      
//   });
// });
// after(async () => {
//     await dbStartup.closeConnection();
//   });

//---

// const request = require('supertest');
// const app = require('../app');


// request(app)
//   .get('/healthz')
//   .end(function(err, res) {
//         if (err) throw err;
//         console.log(res.status);
//   });


const app = require('../app');
const request = require("supertest");

 

describe("GET /healthz ", () => {
  test("It should respond 200", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(200);
  });
});

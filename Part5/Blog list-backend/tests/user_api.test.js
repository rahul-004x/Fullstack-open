const { test, after, beforeEach, describe, } = require('node:test');
const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const api = supertest(app);
const user = require('../models/user')


beforeEach(async () => {
    await user.deleteMany({}); 
});

describe("if the character of username and passward is < 3 expect 400", () => {
    test('fails with status code 400 if length of username < 3', async () => {
        const newUser = {
            username: 'testuser', 
            name: 'Test user', 
            password: 'password' 
        };
    
        await api
            .post('/api/users')
            .send(newUser) 
            .expect(201); 
    });

//     test('if the password < 3 characters test ends up with 400 ', async () => {
//         const newUser = {
//             username: 'Zr2w', 
//             name: ' eR3', 
//             password: 'ra' 
//         };
    
//         await api
//             .post('/api/users')
//             .send(newUser) 
//             .expect(400); 
//     })
})

after(async () => {
    // await user.deleteMany({});
    await mongoose.connection.close();
})
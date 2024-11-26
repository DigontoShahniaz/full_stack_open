const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper'); // Ensure test_helper is properly implemented

describe('User creation validation', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test.only('Fails with status 400 if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'password123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Username must be at least 3 characters long'))
    const users = await helper.usersInDb();
    assert.strictEqual(users.length, 1); // Only initial user exists
  });

  test.only('Fails with status 400 if password is missing', async () => {
    const newUser = {
      username: 'nouser',
      name: 'No Password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Password must be at least 3 characters long'));
    const users = await helper.usersInDb();
    assert.strictEqual(users.length, 1);
  });

  test.only('Fails with status 400 if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'password123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

      assert(result.body.error.includes('Username must be at least 3 characters long'));
    const users = await helper.usersInDb();
    assert.strictEqual(users.length, 1);
  });

  test.only('Fails with status 400 if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: 'pw',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Password must be at least 3 characters long'));
    const users = await helper.usersInDb();
    assert.strictEqual(users.length, 1);
  });

  test.only('Fails with status 400 if username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate User',
      password: 'password123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Username must be unique'))
    const users = await helper.usersInDb();
    assert.strictEqual(users.length, 1);
  });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

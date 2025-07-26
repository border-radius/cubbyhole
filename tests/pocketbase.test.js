import PocketBase from 'pocketbase'

import {
  clearTestDir,
  createSuperUser,
  startPocketBase,
} from './pocketbase.js';

const pb = new PocketBase('http://127.0.0.1:8090')

describe('PocketBase', () => {
  let pocketbaseProcess;

  before(async () => {
    clearTestDir()
    await createSuperUser('admin@example.com', 'adminPasswordAdmin')
    pocketbaseProcess = await startPocketBase()
  })

  after(() => pocketbaseProcess.kill())

  it('should create a new user', async () => {
    const user = await pb.collection('users').create({
      email: 'test@example.com',
      password: 'testPasswordTest',
      passwordConfirm: 'testPasswordTest',
    })

    if (!user.id) {
      throw new Error('Failed to create new user')
    }
  })

  it('should auth as a created user', async () => {
    await pb.collection('users').authWithPassword('test@example.com', 'testPasswordTest')

    if (!pb.authStore.token) {
      throw new Error('Failed to auth')
    }
  })
})

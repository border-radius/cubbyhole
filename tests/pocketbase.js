import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pbPath = path.join(__dirname, '../pocketbase')

export const clearTestDir = () => {
  fs.rmSync(path.join(__dirname, '../pb_test'), { recursive: true, force: true })
}

export const createSuperUser = (email, password) => new Promise((resolve, reject) => {
  const process = spawn(pbPath, ['--dir=pb_test', 'superuser', 'upsert', email, password])

  process.stderr.on('data', e => console.error(e.toString()))

  process.on('close', code => {
    if (code !== 0) {
      return reject(new Error('Failed to upsert superuser'))
    }

    resolve()
  })
})

export const startPocketBase = () => new Promise((resolve, reject) => {
  const process = spawn(pbPath, ['serve', '--dir=pb_test', '--dev'])

  process.stderr.on('data', e => console.error(e.toString()))
  process.stdout.on('data', data => {
    console.log(data.toString())
    resolve(process)
  })

  process.on('close', code => reject(new Error(`Exited with code ${code}`)))
})

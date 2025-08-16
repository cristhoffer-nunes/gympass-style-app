import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { expect, test, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {

        const registerUseCase = new RegisterUseCase({
            async findByEmail(email) {
                return null
            },

            async create(data) {
                return {
                    id: 'user-id',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date(),
                }
            }
        })

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john.doe@mail.com',
            password: 'password'
        })

        const isPasswordCorrectluyHashed = await compare('password', user.password_hash)

        expect(isPasswordCorrectluyHashed).toBe(true)
    })
})

import bcrypt from 'bcrypt'

export class Helpers{
    public static async comparePassword(rawPassword: string, hashedPassword: string){
        return await bcrypt.compare(rawPassword, hashedPassword)
    }
}
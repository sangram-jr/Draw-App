import {email, z} from "zod";

export const CreateUserSchema=z.object({
    email:z.email(),
    password:z.string().min(3).max(20),
    name:z.string()
})


export const SigninSchema=z.object({
    email:z.string().min(3).max(20),
    password:z.string()
})

export const CreateRoomSchema=z.object({
    slug:z.string().min(3).max(20)
})
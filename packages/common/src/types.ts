import {email, z} from "zod";

export const CreateUserSchema=z.object({
    email:z.email({message:"Email format required"}),
    password:z.string().min(3,{ message: "Password should be minimum 3 characters" }).max(20,{ message: "Password should be maximum 20 characters" }),
    name:z.string().min(3,{ message: "Name should be minimum 3 characters" }).max(20,{ message: "Name should be maximum 20 characters" }),
})


export const SigninSchema=z.object({
    email:z.string().min(3).max(20),
    password:z.string()
})

export const CreateRoomSchema=z.object({
    slug:z.string().min(3).max(20)
})
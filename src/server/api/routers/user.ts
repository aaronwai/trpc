import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
  
export const userRouter = createTRPCRouter({
    getUserProfile : publicProcedure.input(z.object({username : z.string()})).query(async ({ctx: {db}, input: {username}}) => {
        return await db.user.findUnique({
            where : {username : username},
            select : {
                name: true,
                image: true,
                id : true,
                username : true 
            }
        })
    })
})


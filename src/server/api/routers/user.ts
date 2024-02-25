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
                username : true,
                _count : {
                    select : {
                        posts : true
                    }
                }
            }
        })
    }),

    getUserPosts: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ctx: { db, session } ,input: { username }  }) => {
      return await db.user.findUnique({
        where: {
          username,
        },
        select: {
          posts: {
            select : {
                id : true,
                description: true,
                slug: true,
                title : true,
                createdAt: true,
                 author: {
                    select: {
                        name: true,
                        image: true,
                        username: true,
                    },
                },
                bookmarks : session?.user?.id ?
                {
                    where : {
                        userId : session?.user?.id
                    }
                } : false,
            }
          },
        },
      });
    }), 
})


import { writeFormSchema } from "~/components/WriteFormModal";
import slugify from "slugify"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const postRouter = createTRPCRouter({

  createPost: protectedProcedure.input(writeFormSchema)
    .mutation(async ({ ctx:{db, session}, input : {title, description, text} }) => {
      await db.post.create({
        data: {
          title, description, text, slug: slugify(title) , author: {
            connect: {
              id: session.user.id
            }
          }
        }
      })
    }),
  getPosts: publicProcedure.query(async ({ctx: {db}})=>{
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            name:true,
            image: true

          }
        }
      }
  });
    return posts
  }),
   getPost : publicProcedure.input(z.object({
    slug: z.string()
   }))
   .query(async ({ctx: {db}, input:{slug}})=>{
    const post = await db.post.findUnique({
      where : {
        slug
      }
    })
    return post
   }), 
});

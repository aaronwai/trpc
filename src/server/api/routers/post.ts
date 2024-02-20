import { z } from "zod";
import { writeFormSchema } from "~/components/WriteFormModal";
import slugify from "slugify"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
});

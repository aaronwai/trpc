import { randomUUID } from "crypto";
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
  import { createClient } from "@supabase/supabase-js";
import {decode} from "base64-arraybuffer"
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { isDataURI } from "validator";

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY);

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

    uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageBase64DataURI: z.string().refine(
          (val) => isDataURI(val),
          "image should be in data uri format"
        ), 
        mimetype: z.string(),
        username : z.string()
      })
    ) 
    .mutation(async ({ ctx: { db, session }, input :{ imageBase64DataURI, mimetype }}) => {
      const imageBase64Str = imageBase64DataURI.replace(/^.+,/, "");
         const buf = Buffer.from(imageBase64Str, "base64");
const { data, error } = await supabase
  .storage
  .from('trpc_public')
  .upload(`avatar/${input.username}.png`, decode(imageBase64Str), {
   contentType: "image/png",
   upsert:true
  });
  if (error) {
    throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "upload failed to supabase"})
  }
  const {data: {publicUrl}} = await supabase.storage.from('public').getPublicUrl(data?.path);
  await db.user.update({
    where : {
      id: session.user.id
    },
    data: {
      image: publicUrl
    }
  })
}),
})


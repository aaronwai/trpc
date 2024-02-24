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
  getPosts: publicProcedure.query(async ({ctx: {db, session}})=>{
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id:true,
        slug:true,
        title:true,
        description:true,
        createdAt : true,
        author: {
              select: {
                name:true,
                image: true
              }
            },
           bookmarks: session?.user?.id ? {
            where: {
              userId: session?.user?.id
            }
           } : false
      }
  });
    return posts
  }),
   getPost : publicProcedure.input(z.object({
    slug: z.string()
   }))
   .query(async ({ctx: {db, session}, input:{slug}})=>{
    const post = await db.post.findUnique({
      where : {
        slug
      },
      select : {
        id: true,
        description : true,
        title : true,
        text : true,
        likes : session?.user?.id? {
          where : {
            userId : session?.user?.id
          }
        } : false
      }
    })
    return post
   }),
   
   likePost: protectedProcedure.input(z.object({postId : z.string()})).mutation(async ({ctx: {db, session}, input : {postId}}) => {
    await db.like.create({
      data: {
        userId : session.user.id, postId
      }
    })
   }),

   disLikePost: protectedProcedure.input(z.object({postId : z.string()})).mutation(async ({ctx: {db, session}, input : {postId}}) => {
    await db.like.delete({
      where : {
        userId_postId: {
          postId : postId,
         userId : session.user.id}
      }
    })
   }),

   bookmarkPost: protectedProcedure.input(z.object({postId : z.string()})).mutation(async ({ctx: {db, session}, input : {postId}}) => {
    await db.bookmark.create({
      data: {
        userId : session.user.id, postId
      }
    })
   }),
   removeBookmarkPost: protectedProcedure.input(z.object({postId : z.string()})).mutation(async ({ctx: {db, session}, input : {postId}}) => {
    await db.bookmark.delete({
      where : {
        userId_postId: {
          postId : postId,
         userId : session.user.id}
      }
    })
   }),
   submitComment : protectedProcedure.input(z.object({
    text: z.string().min(3),
    postId: z.string(),
  })).mutation(async ({ctx:{db, session}, input: {text, postId}})=> {
    await db.comment.create({
      data : {
        text,
        user: {
          connect : {
            id:session.user.id
          }
        },
        post : {
          connect: { id : postId
          }
        }
      }
    })
   }),

   getComments : publicProcedure.input(
    z.object({postId:z.string()})).query(async ({ctx: {db}, input: {postId}})=>{
      const comments = await db.comment.findMany({
        where : {
          postId
        },
        select : {
          id : true,
          text:true,
          user: {
            select : {name : true, image: true }
          },
          createdAt: true
        },
        orderBy: {
          createdAt : 'desc'
        }
      })
      return comments
    }),

});

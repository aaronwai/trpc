import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MainLayout from "~/layouts/MainLayout";
import { api } from "~/utils/api";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsChat } from "react-icons/bs";

const PostPage = () => {
  const router = useRouter();
  const getPost = api.post.getPost.useQuery(
    {
      slug: router.query.slug as string,
    },
    {
      enabled: !!router.query.slug,
    },
  );
  const postRoute = api.useUtils().post;
  const invalidateCurrentPostPage = useCallback(() => {
    postRoute.getPost.invalidate({ slug: router.query.slug as string });
  }, [postRoute.getPost, router.query.slug]);
  const likePost = api.post.likePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage();
    },
  });
  const disLikePost = api.post.disLikePost.useMutation({
    onSuccess: () => {
      invalidateCurrentPostPage();
    },
  });
  return (
    <MainLayout>
      {getPost.isLoading && (
        <div className="h-full w-full items-center justify-center">
          <div>Loading...</div>
          <div>
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        </div>
      )}
      {getPost.isSuccess && (
        <div className="fixed bottom-10 flex w-full items-center justify-center">
          <div className="group flex space-x-4 rounded-full border border-gray-400 bg-white px-6 py-3 transition duration-300 hover:border-gray-900">
            <div className="border-r pr-4 transition duration-300 group-hover:border-gray-900">
              {getPost.data?.likes && getPost.data?.likes.length > 0 ? (
                <FcLike
                  className="cursor-pointer text-xl"
                  onClick={() =>
                    getPost.data?.id &&
                    disLikePost.mutate({ postId: getPost.data?.id })
                  }
                />
              ) : (
                <FcLikePlaceholder
                  className="cursor-pointer text-xl"
                  onClick={() =>
                    getPost.data?.id &&
                    likePost.mutate({ postId: getPost.data?.id })
                  }
                />
              )}
            </div>
            <div>
              <BsChat className="text-base" />
            </div>
          </div>
        </div>
      )}
      <div className="flex h-full w-full flex-col items-center justify-center p-10">
        <div className="w-full max-w-screen-lg">
          <div className="relative h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg">
            <div className="absolute flex h-full w-full items-center justify-center">
              <div className="rounded-xl bg-black bg-opacity-50 p-4 text-3xl text-white">
                {getPost.data?.title}
              </div>
            </div>
          </div>
          <div className="border-grap-800 border-l-4 pl-6">
            {getPost.data?.description}
          </div>
          <div>{getPost.data?.text}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;

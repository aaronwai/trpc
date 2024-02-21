import { useRouter } from "next/router";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MainLayout from "~/layouts/MainLayout";
import { api } from "~/utils/api";

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

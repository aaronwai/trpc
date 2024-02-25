import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Avatar from "~/components/Avatar";
import MainLayout from "~/layouts/MainLayout";
import { api } from "~/utils/api";
import { BiEdit } from "react-icons/bi";
import { TfiShare } from "react-icons/tfi";
import toast from "react-hot-toast";
import Post from "~/components/Post";

const UserProfilePage = () => {
  const router = useRouter();
  const userProfile = api.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    { enabled: !!router.query.username },
  );

  const userPosts = api.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    { enabled: !!router.query.username },
  );
  return (
    <div>
      <MainLayout>
        <div className="flex h-full w-full items-center justify-center">
          <div className="my-10 flex h-full w-full flex-col lg:max-w-screen-md xl:max-w-screen-lg">
            <div className="flex w-full flex-col rounded-t-3xl bg-white shadow-md">
              <div className="relative h-44 w-full rounded-3xl bg-gradient-to-bl from-red-200 via-red-300 to-yellow-200">
                <div className="absolute -bottom-10 left-12">
                  <div className="gb-gray-100 group relative h-28 w-28 cursor-pointer rounded-full border-2 border-white">
                    <label
                      htmlFor="avatarFile"
                      className="during-500 absolute z-10 flex h-full w-full cursor-pointer items-center justify-center rounded-full transition group-hover:bg-black/40"
                    >
                      <BiEdit className="hidden text-3xl text-white group-hover:block" />
                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    {userProfile.data?.image && (
                      <Image
                        src={userProfile.data?.image}
                        alt={userProfile.data?.name ?? ""}
                        fill
                        className="rounded-full"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-12 mt-10 flex flex-col space-y-0.5 rounded-b-3xl py-5">
                <div className="text-4xl font-semibold text-gray-800">
                  {userProfile.data?.name}
                </div>
                <div className="text-gray-600">
                  @{userProfile.data?.username}
                </div>
                <div className="text-gray-600">
                  {userProfile.data?._count.posts ?? 0} Posts
                </div>
                <div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("url copied");
                    }}
                    className="mt-2 flex transform items-center space-x-2 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900 hover:text-gray-900 active:scale-95"
                  >
                    <div>Share</div>
                    <div>
                      <TfiShare />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="my-10 w-full">
              {userPosts.isSuccess &&
                userPosts.data?.posts.map((post) => (
                  <Post {...post} key={post.id} />
                ))}
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default UserProfilePage;

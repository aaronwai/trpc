import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Avatar from "~/components/Avatar";
import MainLayout from "~/layouts/MainLayout";
import { api } from "~/utils/api";
import { BiEdit } from "react-icons/bi";

const UserProfilePage = () => {
  const router = useRouter();
  const userProfile = api.user.getUserProfile.useQuery(
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
            <div>this is lower section</div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default UserProfilePage;

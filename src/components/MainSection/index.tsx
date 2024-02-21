import dayjs from "dayjs";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiBookmarkCheck, CiBookmarkPlus, CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

const MainSection = () => {
  const getPosts = api.post.getPosts.useQuery();
  const bookmarkPost = api.post.bookmarkPost.useMutation();
  const removeBookmarkPost = api.post.removeBookmarkPost.useMutation();
  return (
    <main className="col-span-8 h-full w-full border-r border-gray-300 px-24">
      <div className="flex w-full flex-col space-y-4 py-10">
        <div className="flex w-full items-center space-x-4 ">
          <label
            htmlFor="search"
            className="relative w-full rounded-3xl border border-gray-800"
          >
            <div className="absolute left-2 flex h-full  items-center">
              <CiSearch />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              className=" w-full rounded-3xl px-4 py-1 pl-7 text-sm outline-none placeholder:text-xs placeholder:text-gray-300"
            />
          </label>
          <div className="flex w-full items-center justify-end space-x-4">
            <div>My topics :</div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-200/50 px-4 py-3">
                  tag {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8">
          <div>Articles</div>
          <div>
            <button className="flex items-center space-x-2 rounded-3xl border border-gray-800 px-4 py-1.5 font-semibold">
              <div>Following</div>
              <div>
                <HiChevronDown className="text-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center space-y-8">
        {getPosts.isLoading && (
          <div className="h-full w-full items-center justify-center">
            <div>Loading...</div>
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          </div>
        )}
        {getPosts.isSuccess &&
          getPosts.data.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
            >
              <div className="flex w-full items-center space-x-2">
                <div className="relative h-10 w-10  rounded-full bg-gray-400">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      fill
                      alt={post.author.name ?? ""}
                      className="rounded-full"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {post.author.name} &#x2022;{" "}
                    <span className="mx-1">
                      {dayjs(post.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </p>
                  <p className="text-sm">personal info</p>
                </div>
              </div>
              <Link
                className="grid w-full grid-cols-12 gap-4"
                href={`/${post.slug}`}
              >
                <div className="col-span-8 flex flex-col space-y-4">
                  <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline">
                    {post.title}
                  </p>
                  <p className="text-sm text-gray-500">{post.description}</p>
                </div>
                <div className="col-span-4">
                  <div className=" h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl">
                    image
                  </div>
                </div>
              </Link>
              <div>
                <div className="flex w-full items-center justify-between space-x-4">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-3xl bg-gray-200/50 px-6 py-2.5"
                      >
                        tag {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    {post.bookmarks && post.bookmarks.length > 0 ? (
                      <CiBookmarkCheck
                        className="cursor-pointer text-3xl text-indigo-600"
                        onClick={() => {
                          removeBookmarkPost.mutate({ postId: post.id });
                        }}
                      />
                    ) : (
                      <CiBookmarkPlus
                        className="text-3xl"
                        onClick={() => {
                          bookmarkPost.mutate({ postId: post.id });
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default MainSection;

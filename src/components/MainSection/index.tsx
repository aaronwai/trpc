import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiChevronDown } from "react-icons/hi";
import { api } from "~/utils/api";
import { CiSearch } from "react-icons/ci";
import Post from "../Post";

const MainSection = () => {
  const getPosts = api.post.getPosts.useQuery();
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
          getPosts.data.map((post) => <Post {...post} key={post.id} />)}
      </div>
    </main>
  );
};

export default MainSection;

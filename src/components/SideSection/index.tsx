import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const SideSection = () => {
  const readingListing = api.post.getReadingList.useQuery();
  return (
    <aside className="col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div>
        <h3 className="my-6 text-lg font-semibold">
          People you might interested in
        </h3>
        {/* suggestions  */}
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-row items-center space-x-5 ">
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <div>
                <div className="text-sm font-bold text-gray-900">John Doe</div>
                <div className="text-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                  exercitationem repellat autem nisi.
                </div>
              </div>
              <div>
                <button className="flex items-center space-x-3 rounded border border-gray-400/50 px-4 py-2.5 transition hover:border-gray-900 hover:text-gray-900">
                  follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* bookmarks add trpc getReadingList */}
      <div>
        <h3 className="my-6 text-lg font-semibold">Your reading list </h3>
        <div className="flex flex-col space-y-4">
          {readingListing.data &&
            readingListing.data.map((bookmark) => (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group flex items-center space-x-6"
              >
                <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                <div className="flex w-3/5 flex-col space-y-2">
                  <div className="text-lg font-semibold decoration-indigo-600 group-hover:underline">
                    {bookmark.post.title}
                  </div>
                  <div className="truncate">{bookmark.post.description}</div>
                  <div className="flex w-full items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                    <div>{bookmark.post.author.name}</div>
                    <div>
                      {dayjs(bookmark.post.createdAt).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  );
};

export default SideSection;

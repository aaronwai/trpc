import { Transition, Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { z } from "zod";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import error from "next/error";
dayjs.extend(relativeTime);
type CommentSidebarProps = {
  showCommentSidebar: boolean;
  setShowCommentSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
};

type CommentFormType = { text: string };

export const commentFormSchema = z.object({
  text: z.string().min(3),
});

const CommentSidebar = ({
  showCommentSidebar,
  setShowCommentSidebar,
  postId,
}: CommentSidebarProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  });

  const postRoute = api.useUtils().post;
  const submitComment = api.post.submitComment.useMutation({
    onSuccess: () => {
      toast.success("Success !");
      postRoute.getComments.invalidate({ postId });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getComments = api.post.getComments.useQuery({ postId });

  return (
    <Transition.Root show={showCommentSidebar} as={Fragment}>
      <Dialog as="div" onClose={() => setShowCommentSidebar(false)}>
        <div className="fixed right-0 top-0">
          <Transition.Child
            enter="transition duration-1000"
            leave="transition duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative h-screen w-[200px] max-w-md bg-white sm:w-[400px]">
              <div className="flex h-full w-full flex-col space-y-4 overflow-scroll px-6">
                <div className="mb-6 mt-10 flex items-center justify-between text-xl">
                  <h2 className="font-medium">Response (4)</h2>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowCommentSidebar(false)}
                  >
                    <HiXMark strokeWidth={3} />
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit((data) => {
                    submitComment.mutate({ ...data, postId });
                  })}
                  className="flex flex-col items-end space-y-5"
                >
                  <textarea
                    id="comment"
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 p-4 shadow-lg outline-none focus:border-gray-600"
                    placeholder="what are your thoughts ?"
                    {...register("text")}
                  />
                  {isValid && (
                    <button
                      type="submit"
                      className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      Comment
                    </button>
                  )}
                </form>
                <div className="flex flex-col items-center justify-center space-y-6">
                  {getComments.isSuccess &&
                    getComments.data.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex w-full flex-col space-y-2 border-b border-b-gray-300 pb-4 last:border-none"
                      >
                        <div className="flex w-full items-center space-x-2">
                          <div className="relative h-8 w-8 rounded-full bg-gray-400"></div>
                          <div>
                            <p className="font-semibold">{comment.user.name}</p>
                            <p>{dayjs(comment.createdAt).fromNow()}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {comment.text}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CommentSidebar;

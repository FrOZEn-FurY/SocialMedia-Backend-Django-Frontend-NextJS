"use client";
import {
  HandThumbUpIcon as HandThumbUp,
  ChatBubbleOvalLeftIcon as ChatBubble,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import { Tooltip } from "react-tippy";
import gsap from "gsap";
import { toast } from "react-toastify";
import { context as ctx } from "@/context/context";
import { getCSRFToken } from "@/utility";

interface Comment {
  id: number;
  author: string;
  post: number;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  title: string;
  content: string;
  comments: Comment[];
  created_at: string;
  updated_at: string;
  likes: number;
  liked: boolean;
}

export default function ShowPostData({ data }: { data: Post }) {
  const context = useContext(ctx);
  const [checkedMessage, setCheckedMessage] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(data.liked);
  const [likes, setLikes] = useState(data.likes);
  const date = new Date(data.updated_at);
  const commentRef = useRef(null);
  const commentHeaderRef = useRef(null);
  const commentBodyRef = useRef(null);
  const message = localStorage.getItem("message");
  if (message && !checkedMessage) {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      onClose: () => {
        localStorage.removeItem("message");
      },
    });
    setCheckedMessage(true);
  }
  return (
    <>
      <div className="post-container">
        <h2 className="post-header">
          Author:{" "}
          <Link className="post-author" href={"/profile/" + data.author.id}>
            {data.author.username}
          </Link>
        </h2>
        <h2 className="post-header">{data.title}</h2>
        <div className="post-body">
          {data.content}
          <Tooltip
            title="Likes"
            trigger="mouseenter"
            position="top"
            arrow
            animation="fade"
            className="-top-4 -right-2 absolute"
          >
            <span className="bg-amber-600 p-2 text-black text-[16px] rounded-full">
              {likes}
            </span>
          </Tooltip>
        </div>
        <div className="post-footer">
          <span className="post-text">
            Last update: {date.toDateString()} at {date.getHours()}:
            {date.getMinutes()}
          </span>
          <span className="self-center mt-2">{" | "}</span>
          <button onClick={handleLike} className="self-center mt-2">
            Like
            {liked ? (
              <HandThumbUpIcon
                width={24}
                height={24}
                style={{
                  display: "inline",
                  alignSelf: "center",
                  marginLeft: "5px",
                }}
              ></HandThumbUpIcon>
            ) : (
              <HandThumbUp
                width={24}
                height={24}
                style={{
                  display: "inline",
                  alignSelf: "center",
                  marginLeft: "5px",
                }}
              ></HandThumbUp>
            )}
          </button>
          <span className="self-center mt-2">{" | "}</span>
          <button className="self-center mt-2" onClick={handleShowComments}>
            Comments
            {showComments ? (
              <ChatBubbleOvalLeftIcon
                width={24}
                height={24}
                style={{
                  display: "inline",
                  alignSelf: "center",
                  marginLeft: "5px",
                }}
              ></ChatBubbleOvalLeftIcon>
            ) : (
              <ChatBubble
                width={24}
                height={24}
                style={{
                  display: "inline",
                  alignSelf: "center",
                  marginLeft: "5px",
                }}
              ></ChatBubble>
            )}
          </button>
          <span className="self-center mt-2">{" | "}</span>
          <Link
            href={"/posts/" + data.id + "/comment"}
            className="self-center mt-2"
          >
            Leave a comment
            <ChatBubble
              width={24}
              height={24}
              style={{
                display: "inline",
                alignSelf: "center",
                marginLeft: "5px",
              }}
            ></ChatBubble>
          </Link>
        </div>
        {context.user?.id === data.author.id && (
          <div className="post-settings-container">
            <Link href={"/posts/" + data.id + "/edit"} className="post-settings-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="post-settings-delete">
              Delete
            </button>
          </div>
        )}
        <div
          ref={commentRef}
          className={"comments" + (showComments ? "" : " hidden")}
        >
          <h1 ref={commentHeaderRef} className="comment-big-header">
            Comments
          </h1>
          <div ref={commentBodyRef} className="opacity-0">
            {data.comments.map((comment: Comment) => {
              return (
                <div className="comment-container" key={comment.id}>
                  <h3 className="comment-header">
                    {comment.author + " "}{" "}
                    <span className="comment-text">
                      last updated {new Date(comment.updated_at).getDate()} at{" "}
                      {new Date(comment.updated_at)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(comment.updated_at)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </h3>
                  <p className="comment-body">{comment.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
  function handleShowComments() {
    handleAnimation();
  }
  async function handleLike() {
    const response = await fetch(
      "http://localhost:8000/posts/likes/" +
        data.id +
        "/?likeStatus=" +
        (liked ? "false" : "true") +
        "",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const res = await response.json();
    if (res.message === "Like created.") {
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
      toast.success("Liked!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
      toast.success("Unliked!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
  function handleAnimation() {
    if (showComments) {
      gsap.to(commentRef.current, {
        height: 0,
        duration: 0.5,
        delay: 0.5,
        onComplete: () => setShowComments(!showComments),
      });
      gsap.to(commentHeaderRef.current, { opacity: 0, duration: 0.5 });
      gsap.to(commentBodyRef.current, { opacity: 0, duration: 0.5 });
    } else {
      setShowComments(!showComments);
      gsap.fromTo(
        commentRef.current,
        { height: 0 },
        { height: "auto", duration: 0.5 }
      );
      gsap.fromTo(
        commentHeaderRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
        }
      );
      gsap.fromTo(
        commentBodyRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          delay: 0.6,
        }
      );
    }
  }
  async function handleDelete() {
    const apiToken = await getCSRFToken();
    const response = await fetch("http://localhost:8000/posts/?id=" + data.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": apiToken,
      } as any,
      credentials: "include",
    });
    const res = await response.json();
    if (res.id) {
      localStorage.setItem("message", "Post deleted successfully!");
      window.location.href = "/";
    } else {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
}

"use client";
import { context as ctx } from "@/context/context";
import { getCSRFToken } from "@/utility";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import ConfirmDelete from "./confirmDelete";

const Posts = dynamic(() => import("./posts"), {
  ssr: false,
});
const Followers = dynamic(() => import("./followers"), {
  ssr: false,
});
const Followings = dynamic(() => import("./followings"), {
  ssr: false,
});

interface Post {
  id: number;
  title: string;
  content: string;
}

interface OtherUsers {
  id: number;
  username: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  posts: Post[];
  followers: OtherUsers[];
  following: OtherUsers[];
}

export default function ShowProfile({ data }: { data: User }) {
  const [showActivityData, setShowActivityData] = useState<string>("");
  const [followers, setFollowers] = useState<OtherUsers[]>(data.followers);
  const [checkedMessage, setCheckedMessage] = useState<boolean>(false);
  const context = useContext(ctx);
  const isFollowed = followers.find((user) => user.id === context.user?.id);
  if (!checkedMessage) {
    const message = localStorage.getItem("message");
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      localStorage.removeItem("message");
    }
    setCheckedMessage(true);
  }
  return (
    <>
      <div className="profile-info-container">
        <div className="profile-info">
          <h2 className="profile-info-text text-[22px]">
            Username: {" " + data.username}
          </h2>
          <h2 className="profile-info-text text-[22px]">
            Email: {" " + data.email}
          </h2>
          <h4 className="profile-info-text">
            First Name: {" " + data.firstName}
          </h4>
          <h4 className="profile-info-text">
            Last Name: {" " + data.lastName}
          </h4>
          {context.user?.id === data.id ? (
            <h6 className="profile-info-text">
              Phone Number: {" " + data.phone}
            </h6>
          ) : (
            <h6 className="profile-info-text">
              Phone Number:{" "}
              {" " +
                data.phone.substring(0, 3) +
                "****" +
                data.phone.substring(7)}
            </h6>
          )}
        </div>
        <Accordion
          className="profile-accordian"
          transition
          transitionTimeout={300}
        >
          {context.user?.id === data.id ? (
            <AccordionItem
              header={({ state }: { state: any }) => {
                return (
                  <div
                    className={
                      state.isEnter
                        ? "profile-accordian-title-active"
                        : "profile-accordian-title"
                    }
                  >
                    <h2 className="inline">Settings</h2>
                    {state.isEnter ? (
                      <ChevronDownIcon
                        className="inline"
                        width={24}
                        height={24}
                      ></ChevronDownIcon>
                    ) : (
                      <ChevronRightIcon
                        className="inline"
                        width={24}
                        height={24}
                      ></ChevronRightIcon>
                    )}
                  </div>
                );
              }}
              className={"profile-accordian-general"}
            >
              <div className="profile-accordian-content">
                <Link
                  href={`/profile/${data.id}/edit`}
                  className="profile-accordian-link"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleDelete}
                  className="profile-accordian-link"
                >
                  Delete account
                </button>
              </div>
            </AccordionItem>
          ) : isFollowed ? (
            <button
              onClick={handleFollow}
              className="profile-accordian-unfollow text-[22px]"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="profile-accordian-follow text-[22px]"
            >
              Follow
            </button>
          )}
          <AccordionItem
            header={({ state }: { state: any }) => {
              return (
                <div
                  className={
                    state.isEnter
                      ? "profile-accordian-title-active"
                      : "profile-accordian-title"
                  }
                >
                  <h2 className="inline">Activities</h2>
                  {state.isEnter ? (
                    <ChevronDownIcon
                      className="inline"
                      width={24}
                      height={24}
                    ></ChevronDownIcon>
                  ) : (
                    <ChevronRightIcon
                      className="inline"
                      width={24}
                      height={24}
                    ></ChevronRightIcon>
                  )}
                </div>
              );
            }}
            className={"profile-accordian-general"}
          >
            <div className="profile-accordian-content">
              <button
                onClick={() => {
                  handleActivityClick("posts");
                }}
                className="profile-accordian-link"
              >
                Posts
              </button>
              <button
                onClick={() => {
                  handleActivityClick("followers");
                }}
                className="profile-accordian-link"
              >
                Followers
              </button>
              <button
                onClick={() => {
                  handleActivityClick("followings");
                }}
                className="profile-accordian-link"
              >
                Followings
              </button>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      {showActivityData === "posts" ? (
        <Posts posts={data.posts} closer={setShowActivityData}/>
      ) : showActivityData === "followers" ? (
        <Followers followers={followers} closer={setShowActivityData}/>
      ) : showActivityData === "followings" ? (
        context.user?.id === data.id ? (
          <Followings closer={setShowActivityData}/>
        ) : (
          <Followings followings={data.following} closer={setShowActivityData}/>
        )
      ) : null}
    </>
  );

  async function handleFollow() {
    const apiToken = await getCSRFToken();
    const response = await fetch(
      "http://localhost:8000/accounts/follow/" + data.username + "/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Csrftoken": apiToken,
        } as any,
        credentials: "include",
      }
    );
    const res = await response.json();
    if (res.message === "Followed successfully." && context.user) {
      setFollowers([
        ...followers,
        { id: context.user?.id, username: context.user?.username },
      ]);
      const user = context.user;
      user.followings = [
        ...user?.followings,
        { id: data.id, username: data.username },
      ];
      context.setUser(user);
      toast.success(res.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    } else if (res.message === "Unfollowed successfully." && context.user) {
      setFollowers(
        followers.filter((follower) => follower.id !== context.user?.id)
      );
      const user = context.user;
      user.followings = user?.followings.filter(
        (following) => following.id !== data.id
      );
      context.setUser(user);
      toast.success(res.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  }
  function handleActivityClick(activity: string) {
    setShowActivityData(activity);
  }
  function handleDelete() {
      toast.warning(
        <ConfirmDelete></ConfirmDelete>,
        {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        }
      );
  }
}

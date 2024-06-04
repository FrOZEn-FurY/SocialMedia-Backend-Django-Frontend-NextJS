"use client";
import { context as ctx } from "@/context/context";
import { XMarkIcon } from "@heroicons/react/20/solid";
import gsap from "gsap";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react";

interface OtherUsers {
  id: number;
  username: string;
}

export default function Followings({
  followings,
  closer
}: {
  followings?: OtherUsers[],
  closer: Dispatch<SetStateAction<string>>
}) {
  const context = useContext(ctx);
  const titleRef = useRef(null);
    const menuRef = useRef(null);
    const bodyRef = useRef(null);
    useEffect(() => {
        gsap.fromTo(menuRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 });
    }, [])
  return (
    <>
      {followings ? (
        <div ref={menuRef} className="activity-container relative">
          <XMarkIcon width={24} height={24} color="black" className="hover:cursor-pointer absolute top-5 right-5" onClick={() => closer('')}>
                &times;
            </XMarkIcon>
          <h1 ref={titleRef} className="activity-title">Following</h1>
          <ul ref={bodyRef} className="activity-body">
            {followings.map((following: OtherUsers) => (
              <li key={following.id} className="activity-content">
                <Link
                  href={`/profile/${following.id}`}
                  className="activity-link"
                >
                  {following.username}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        context.user && (
          <div ref={menuRef} className="activity-container relative">
            <XMarkIcon width={24} height={24} color="black" className="hover:cursor-pointer absolute top-5 right-5" onClick={() => closer('')}>
                &times;
            </XMarkIcon>
            <h1 ref={titleRef} className="activity-title">Following</h1>
            <ul ref={bodyRef} className="activity-body">
              {context.user.followings !== undefined &&
                context.user.followings.map((following: OtherUsers) => (
                  <li key={following.id} className="activity-content">
                    <Link
                      href={`/profile/${following.id}`}
                      className="activity-link"
                    >
                      {following.username}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )
      )}
    </>
  );
}

'use client'
import { XMarkIcon } from "@heroicons/react/20/solid";
import gsap from "gsap";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface OtherUsers {
    id: number;
    username: string;
}

export default function Followers({followers, closer}: {followers: OtherUsers[], closer: Dispatch<SetStateAction<string>>}) {
    const titleRef = useRef(null);
    const menuRef = useRef(null);
    const bodyRef = useRef(null);
    useEffect(() => {
        gsap.fromTo(menuRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 });
    }, [])
    return (
        <div className="activity-container relative" ref={menuRef}>
            <XMarkIcon width={24} height={24} color="black" className="hover:cursor-pointer absolute top-5 right-5" onClick={() => closer('')}>
                &times;
            </XMarkIcon>
            <h1 ref={titleRef} className="activity-title">Followers</h1>
            <ul ref={bodyRef} className="activity-body">
                {
                    followers.length !== 0 && followers.map((follower: OtherUsers) => (
                        <li key={follower.id} className="activity-content"><Link href={`/profile/${follower.id}`} className="activity-link">{follower.username}</Link></li>
                    ))
                }
            </ul>
        </div>
    );
}
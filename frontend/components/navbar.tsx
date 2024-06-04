"use client";
import { context as ctx } from "@/context/context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import Dropdown from "./dropdown";
import { getCSRFToken } from "@/utility";
import { Flip, toast } from "react-toastify";
import Loading from "./loading";

export default function Navbar() {
  const context = useContext(ctx);
  const path = usePathname();
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className={path === "/" ? "navbar-brand-active" : "navbar-brand"}>
          <Link href={"/"}>Home</Link>
        </li>
        <li
          className={
            path === "/posts"
              ? "active-link-nav me-auto"
              : "navbar-item me-auto"
          }
        >
          <Link href={"/posts"}>Posts</Link>
        </li>
        {context.userGot ? (
          <>
            {context.user ? (
              <Dropdown
                title={context.user.username}
                className={"self-center me-2"}
              >
                <ul>
                  <li className="border-b border-b-black hover:text-sky-400 p-1 m-1 transition-all duration-150 delay-75 ease-out rounded-xl">
                    <Link href={`/profile/${context.user.id}`}>Profile</Link>
                  </li>
                  <li className="border-b border-b-black hover:text-sky-400 p-1 m-1 transition-all duration-150 delay-75 ease-out rounded-xl">
                    <Link href={`/posts/create`}>Create Post</Link>
                  </li>
                  <li className="border-b border-b-black hover:text-sky-400 p-1 m-1 transition-all duration-150 delay-75 ease-out rounded-xl">
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </Dropdown>
            ) : (
              <>
                <li
                  className={
                    path === "/login" ? "active-link-nav" : "navbar-item"
                  }
                >
                  <Link href={"/login"}>Login</Link>
                </li>
                <li
                  className={
                    path === "/register" ? "active-link-nav" : "navbar-item"
                  }
                >
                  <Link href={"/register"}>Register</Link>
                </li>
              </>
            )}
          </>
        ) : <Loading/>}
      </ul>
    </nav>
  );

  async function handleLogout() {
    const apiToken = await getCSRFToken();
    const reponse = await fetch("http://localhost:8000/accounts/logout/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": apiToken,
      } as any,
      credentials: "include",
    });
    const data = await reponse.json();
    if (!reponse.ok) {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      return;
    } else {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      context.setUser(undefined);
    }
  }
}

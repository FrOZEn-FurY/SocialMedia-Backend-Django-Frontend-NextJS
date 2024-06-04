"use client";
import { useContext } from "react";
import { context as ctx } from "../context/context";
import { getCSRFToken } from "@/utility";

export default async function GetUserData() {
  const context = useContext(ctx);
  setTimeout(async () => {
    if (!context.userGot) {
      const apiToken = await getCSRFToken();
      const response = await fetch("http://localhost:8000/accounts/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": apiToken,
        } as any,
        credentials: "include",
      });
      const data = await response.json();
      const userValue = data.message ? undefined : data;
      context.setUser(userValue);
      context.setUserGot(true);
    }
  }, 5000);
  return null;
}

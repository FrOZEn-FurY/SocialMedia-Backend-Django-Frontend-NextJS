'use client';
import { context as ctx } from "@/context/context";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function UserAuthenticated() {
    const context = useContext(ctx);
    const router = useRouter();
    if (!context.user) {
        router.push("/login");
    }
    return null;
}
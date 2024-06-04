'use client'
import { context as ctx } from "@/context/context";
import { getCSRFToken } from "@/utility"
import { useContext } from "react";
import { toast } from "react-toastify"

export default function ConfirmDelete() {
    const context = useContext(ctx);
    return (
        <>
            <h4 className="text-center text-[20px] text-shadow-lg shadow-red-600">Are you sure you want to delete your account?</h4>
            <div className="flex justify-center">
                    <button onClick={handleDelete} className="confirm-btn">Yes</button>
                    <button onClick={() => toast.dismiss()} className="cancel-btn">No</button>
            </div>
        </>
    )
    async function handleDelete() {
        const apiToken = await getCSRFToken();
        const reponse = await fetch(`http://localhost:8000/accounts/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": apiToken,
            } as any,
            credentials: "include",
        });
        const data = await reponse.json();
        if (reponse.ok) {
            localStorage.setItem("message", `User ${context.user?.username} deleted successfully.`);
            window.location.href = "/";
        } else {
            toast.dismiss();
            toast.error("Something went wrong!", {
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
}
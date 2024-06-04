import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const ShowProfileData = dynamic(() => import("@/components/showProfile"), {
    ssr: false
})

export default async function ShowProfile({ params }: { params: { id: string } }) {
    const csrftoken = cookies().get("csrftoken")?.value;
    const sessionid = cookies().get("sessionid")?.value;
    const response = await fetch("http://localhost:8000/accounts/?id=" + params.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: `csrftoken=${csrftoken}; sessionid=${sessionid}`,
        } as any,
        credentials: "include",
        cache: 'no-store'
    });
    const data = await response.json();
    return <ShowProfileData data={data} />
}
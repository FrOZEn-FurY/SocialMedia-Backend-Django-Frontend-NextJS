import dynamic from "next/dynamic";

const UserAuth = dynamic(() => import("@/components/userAuthenticated"), {
    ssr: false
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UserAuth/>
            {children}
        </>
    );
}
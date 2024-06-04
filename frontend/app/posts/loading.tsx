import dynamic from "next/dynamic"

const LoadingDots = dynamic(() => import("@/components/loading"), {
    ssr: false
})

export default function Loading() {
    return <LoadingDots/>
}
import { getPostByID } from "@/utility";
import dynamic from "next/dynamic";

const ShowPostData = dynamic(() => import("@/components/showPostData"), {
  ssr: false
})

export default async function Post({ params }: { params: { id: string } }) {
  const data = await getPostByID(params.id);
  return (
    <ShowPostData data={data} />
  );
}

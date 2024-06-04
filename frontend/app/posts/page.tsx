import { getCSRFToken } from "@/utility";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
}

async function fetchPosts() {
  try {
    const apiToken = await getCSRFToken();
    const res = await fetch("http://localhost:8000/posts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": apiToken,
      } as any,
      credentials: "include",
      cache: 'no-store'
    });
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.log(error);
  }
}

export default async function Posts() {
  const posts: Post[] = await fetchPosts();

  return (
    <div className="flex flex-row flex-wrap flex-initial gap-1">
      {posts.map((post: Post) => (
        <div key={post.id} className="card">
          <h1 className="card-header">{post.title}</h1>
          <p className="card-body">{post.content}</p>
          <div className="card-footer">
            <Link href={`/posts/${post.id}`} className="card-btn-success">
              View post
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

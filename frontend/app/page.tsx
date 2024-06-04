import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/home"), {
  ssr: false,
});

export default function Home() {
  return <HomePage />;
}
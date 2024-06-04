"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [checkedMessage, setCheckedMessage] = useState(false);
  const mainHomeRef = useRef(null);
  const textHomeRef = useRef(null);
  const lastTextHomeRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      mainHomeRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 2 }
    )
    gsap.fromTo(
      textHomeRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 2 }
    )
    gsap.fromTo(
      lastTextHomeRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0,
        scrollTrigger: {
          trigger: lastTextHomeRef.current,
          start: "top 80%+=300px",
          end: "bottom top",
          scrub: true,
        }
      }
    );
  }, [])
  if (!checkedMessage) {
    const message = localStorage.getItem("message");
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      localStorage.removeItem("message");
    }
    setCheckedMessage(true);
  }
  return (
    <>
      <div className="home-container" ref={mainHomeRef}>
        <h1 className="home-big-display">Social media site</h1>
        <h2 className="home-small-display">Share your thoughts</h2>
        <h3 className="home-small-display">and connect with people.</h3>
      </div>
      <div className="home-container pt-40 pb-[400px]" ref={textHomeRef}>
        <p className="home-display">
          Welcome to our social media site. Here you can share your thoughts
          and connect with people who are interested in your
          thoughts.
        </p>
      </div>
      <div className="home-container pb-20" ref={lastTextHomeRef}>
        <p className="home-display">
          To get started, please sign up or sign in to your account.
        </p>
      </div>
    </>
  );
}

"use client";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";

export default function DropdownMenu({
  children,
  isVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
}) {
  const menuRef = useRef(null);
  const [show, setShow] = useState(isVisible);
  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;

    if (isVisible) {
      setShow(true);
      animationTimeout = setTimeout(() => {gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 }
      )}, 0);
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        onComplete: () => setShow(false),
      });
    }

    return () => {
        clearTimeout(animationTimeout)
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className={"dropdown-content"} ref={menuRef}>
      {children}
    </div>
  );
}

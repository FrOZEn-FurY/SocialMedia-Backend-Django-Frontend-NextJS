'use client';
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Loading() {
    const firstDot = useRef(null);
    const secondDot = useRef(null);
    const thirdDot = useRef(null);
    useEffect(() => {
        const dots = [firstDot.current, secondDot.current, thirdDot.current];
        gsap.to(dots, {
            opacity: 0,
            y: -10,
            duration: 0.5,
            ease: "power1.inOut",
            stagger: {
                each: 0.2,
                yoyo: true,
                repeat: -1
            }
        });
    }, [])
    return (
        <div className="flex justify-center">
            <div ref={firstDot} className="inline self-center w-2 h-2 border-2 mx-1 border-black bg-slate-100 rounded"></div>
            <div ref={secondDot} className="inline self-center w-2 h-2 border-2 mx-1 border-black bg-slate-100 rounded"></div>
            <div ref={thirdDot} className="inline self-center w-2 h-2 border-2 mx-1 border-black bg-slate-100 rounded"></div>
        </div>
    );
}
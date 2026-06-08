"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const [photoSrc, setPhotoSrc] = useState(siteData.profilePhoto);
  const paragraphs = useMemo(
    () =>
      siteData.bio
        .split("\n\n")
        .filter((paragraph) => paragraph.trim().length > 0),
    [],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.from("[data-about='photo']", {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 75%",
          once: true,
        },
      });

      gsap.from("[data-about='content']", {
        x: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 75%",
          once: true,
        },
      });

      if (reduceMotion) {
        return;
      }

      gsap.to("[data-about='photo']", {
        y: -8,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-24 lg:py-28"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
        <div
          data-about="photo"
          className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl sm:max-w-[360px] md:max-w-[430px] lg:max-w-[520px]"
        >
          <Image
            src={photoSrc}
            alt="Laimonas portrait"
            fill
            priority
            className="object-cover"
            onError={() => setPhotoSrc("/laimonas-placeholder.svg")}
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(108,99,255,0.5),0_0_40px_rgba(108,99,255,0.2)]" />
        </div>

        <div
          data-about="content"
          className="space-y-5 text-center md:space-y-6 md:text-left"
        >
          <h2 className="font-display text-3xl font-bold text-textPrimary sm:text-4xl md:text-5xl">
            About
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-textMuted sm:text-base md:space-y-5 md:text-lg lg:text-xl">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

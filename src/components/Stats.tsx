"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

function parseMetric(input: string) {
  const match = input.match(/^([\d.]+)(.*)$/);
  const numeric = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? 1 : 0;

  return { numeric, suffix, decimals };
}

export default function Stats() {
  const valueRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-stat-card]", {
        opacity: 0,
        y: 36,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#stats",
          start: "top 78%",
          once: true,
        },
      });

      valueRefs.current.forEach((element, index) => {
        if (!element) {
          return;
        }

        const metric = siteData.metrics[index];
        const { numeric, suffix, decimals } = parseMetric(metric.value);
        const state = { value: 0 };

        gsap.to(state, {
          value: numeric,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#stats",
            start: "top 78%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = `${state.value.toFixed(decimals)}${suffix}`;
          },
          onComplete: () => {
            element.textContent = metric.value;
          },
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="stats"
      className="mx-auto w-full max-w-[1500px] px-6 py-20 md:px-8 md:py-28"
    >
      <h2 className="mb-10 text-center font-display text-3xl font-bold text-textPrimary md:text-5xl">
        Impact
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
        {siteData.metrics.map((metric, index) => (
          <article
            key={metric.label}
            data-stat-card
            className="card-lift shimmer-on-hover animate-float-slow rounded-2xl border border-border bg-surface/70 p-5 md:p-6"
          >
            <div className="mb-4 h-0.5 w-12 bg-gradient-to-r from-accent to-accentBlue" />
            <p
              ref={(node) => {
                valueRefs.current[index] = node;
              }}
              className="font-display text-4xl font-bold tracking-tight text-transparent md:text-6xl"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#6C63FF 0%,#00CFFF 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              0
            </p>
            <p className="mt-3 text-sm text-textMuted md:text-base">
              {metric.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

type VideoCardProps = {
  id: string;
  title: string;
  embedUrl?: string;
  tiktokUrl?: string;
  videoSrc?: string;
  comment?: string;
  link?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  saves?: string;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onStop: () => void;
};

function getTikTokEmbedUrl(inputUrl: string) {
  const match = inputUrl.match(/\/video\/(\d+)/);
  if (!match?.[1]) {
    return null;
  }

  return `https://www.tiktok.com/embed/v2/${match[1]}`;
}

function getPlaceholderGradient(title: string) {
  const palettes = [
    "linear-gradient(145deg, rgba(108,99,255,0.65), rgba(0,207,255,0.35))",
    "linear-gradient(145deg, rgba(0,207,255,0.55), rgba(32,32,64,0.75))",
    "linear-gradient(145deg, rgba(108,99,255,0.45), rgba(255,99,132,0.35))",
  ];

  const index = title.length % palettes.length;
  return palettes[index];
}

function VideoCard({
  id,
  title,
  embedUrl,
  tiktokUrl,
  videoSrc,
  comment,
  link,
  likes,
  comments,
  shares,
  saves,
  isPlaying,
  onPlay,
  onStop,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isPlaceholder = Boolean(embedUrl && embedUrl.startsWith("PLACEHOLDER"));
  const fallbackEmbedUrl = tiktokUrl ? getTikTokEmbedUrl(tiktokUrl) : null;
  const resolvedEmbedUrl = isPlaceholder
    ? fallbackEmbedUrl
    : (embedUrl ?? null);

  const finalEmbedUrl = useMemo(() => {
    if (!resolvedEmbedUrl) {
      return null;
    }

    const separator = resolvedEmbedUrl.includes("?") ? "&" : "?";
    return `${resolvedEmbedUrl}${separator}autoplay=1&description=0&music_info=0`;
  }, [resolvedEmbedUrl]);

  const showPreview = !isPlaying;

  useEffect(() => {
    if (!videoSrc || shouldLoadVideo || typeof IntersectionObserver === "undefined") {
      return;
    }

    const element = videoRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoadVideo, videoSrc]);

  return (
    <article className="group min-w-[270px] max-w-[320px] flex-1 rounded-3xl border border-border/90 bg-gradient-to-b from-[#14142a] via-surface to-[#0a0a14] p-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.42)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 md:min-w-0 md:max-w-none">
      <div className="relative aspect-[9/15] overflow-hidden rounded-2xl border border-white/5 bg-black/60">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={shouldLoadVideo ? videoSrc : undefined}
            controls
            playsInline
            preload={shouldLoadVideo ? "metadata" : "none"}
            className="h-full w-full object-cover"
          />
        ) : showPreview ? (
          <div
            className="relative flex h-full items-center justify-center overflow-hidden"
            style={{ backgroundImage: getPlaceholderGradient(title) }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_38%),radial-gradient(circle_at_80%_90%,rgba(0,0,0,0.28),transparent_40%)]" />
            <div className="relative z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  if (resolvedEmbedUrl) {
                    onPlay(id);
                  } else if (tiktokUrl) {
                    window.open(tiktokUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/35 bg-black/35 backdrop-blur-sm transition-colors hover:border-accent"
                aria-label={
                  resolvedEmbedUrl ? `Play ${title}` : `Open ${title}`
                }
              >
                <span className="ml-0.5 text-2xl text-white">▶</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <iframe
              src={finalEmbedUrl ?? undefined}
              title={title}
              loading="lazy"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
            <button
              type="button"
              onClick={onStop}
              className="absolute bottom-3 right-3 z-20 rounded-full border border-white/30 bg-black/55 px-3 py-1 text-xs font-semibold text-white transition-colors hover:border-accent hover:text-accentBlue"
            >
              Stop
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex h-[8.5rem] flex-col justify-between px-1 pb-1">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-textPrimary">{title}</h4>
          {comment ? <p className="text-xs text-textMuted">{comment}</p> : null}
          <div className="flex flex-wrap gap-2 py-1 text-[11px] text-textMuted justify-between">
            <div className="flex flex-wrap gap-2 py-1 text-[11px] text-textMuted">
              {likes ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  ❤️ {likes}
                </span>
              ) : null}
              {comments ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  💬 {comments}
                </span>
              ) : null}
              {shares ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  ↗ {shares}
                </span>
              ) : null}
              {saves ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  🔖 {saves}
                </span>
              ) : null}
            </div>
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className=" inline-flex items-center text-xs font-semibold text-accent hover:text-accentBlue"
              >
                Watch link ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Videos() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-videos-head]", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#videos",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-video-card]", {
        opacity: 0,
        y: 38,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#videos",
          start: "top 78%",
          once: true,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="videos"
      className="mx-auto w-full max-w-[1500px] px-6 py-20 md:px-8 md:py-28"
    >
      <div>
        <p
          className="mb-3 text-xs uppercase tracking-[0.3em] text-accentBlue"
          data-videos-head
        >
          Videos
        </p>
        <h3
          className="mb-4 font-display text-2xl font-bold text-textPrimary md:text-4xl "
          data-videos-head
        >
          Top Performing Content
        </h3>

        <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {siteData.topVideos.map((video) => (
            <div key={video.title} data-video-card className="snap-start">
              <VideoCard
                id={`top-${video.title}`}
                title={video.title}
                embedUrl={video.embedUrl}
                videoSrc={video.videoSrc}
                link={video.link}
                likes={video.likes}
                comments={video.comments}
                shares={video.shares}
                saves={video.saves}
                isPlaying={activeVideoId === `top-${video.title}`}
                onPlay={setActiveVideoId}
                onStop={() => setActiveVideoId(null)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accentBlue">
          Collaborations
        </p>
        <h3 className="mb-4 font-display text-2xl font-bold text-textPrimary md:text-4xl">
          Brand Collaborations
        </h3>

        <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {siteData.brandVideos.map((video) => (
            <div key={video.title} data-video-card className="snap-start">
              <VideoCard
                id={`brand-${video.title}`}
                title={video.title}
                embedUrl={video.embedUrl}
                videoSrc={video.videoSrc}
                link={video.link}
                likes={video.likes}
                comments={video.comments}
                shares={video.shares}
                saves={video.saves}
                isPlaying={activeVideoId === `brand-${video.title}`}
                onPlay={setActiveVideoId}
                onStop={() => setActiveVideoId(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

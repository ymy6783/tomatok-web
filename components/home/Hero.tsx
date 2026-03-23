import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/site-images";
import { NavBar } from "./NavBar";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={siteImages.section1Hero}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>

      <NavBar variant="overlay" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-32">
          <h1 className="max-w-4xl text-balance">
            <span className="block text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Your De-fi first step is
            </span>
            <span className="mt-2 block text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              TOMATOK
            </span>
          </h1>

          <p className="mt-6 text-lg font-semibold tracking-wide text-red-500 sm:text-xl md:text-2xl">
            Social Blockchain
          </p>

          <Link
            href="#"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#E23E2E] px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-900/40 transition hover:bg-[#c93428]"
          >
            DOWNLOAD
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

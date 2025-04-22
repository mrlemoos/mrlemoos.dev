import { GITHUB_URL, LINKEDIN_URL, X_URL } from "@/lib/constants";
import Link from "next/link";
import type { JSX } from "react";

export function Hero(): JSX.Element {
  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] mb-24">
      <h1 className="text-2xl font-medium mb-2">Leonardo Lemos</h1>
      <p className="text-gray-600 text-center">
        Frontend engineer, software architecture enthusiast, and open-source
        contributor.
      </p>
      <div className="flex flex-col justify-center items-center gap-2 pt-5">
        <span className="text-gray-500">Connect with me:</span>
        <div className="flex gap-2">
          <Link href={GITHUB_URL}>GitHub</Link>
          <Link href={X_URL}>X</Link>
          <Link href={LINKEDIN_URL}>LinkedIn</Link>
        </div>
      </div>
    </section>
  );
}

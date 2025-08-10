import { BlogPosts } from "@/components/blog-posts";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import type { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Hero />
      <BlogPosts />
      <Experience />
    </div>
  );
}

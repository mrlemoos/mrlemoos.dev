import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL, X_URL } from "@/lib/constants";
import Link from "next/link";
import type { JSX } from "react";

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400">
          <div className="flex gap-4 [&>*]:hover:text-gray-300 [&>*]:transition-colors">
            <Link href={GITHUB_URL} target="_blank">
              GitHub
            </Link>
            <Link href={X_URL} target="_blank">
              X
            </Link>
            <Link href={LINKEDIN_URL} target="_blank">
              LinkedIn
            </Link>
            <Link href={EMAIL_URL} target="_blank">
              Email
            </Link>
          </div>
          <div>
            Copyright {currentYear} &copy; Leonardo Lemos. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

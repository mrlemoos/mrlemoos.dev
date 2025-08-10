import { experiences } from "@/lib/data/experience";
import Link from "next/link";
import type { JSX } from "react";

interface ExperienceItemProps {
  title: string;
  company: string;
  companyURL: string;
  period: string;
  description: string[];
  skills: string[];
}

function ExperienceItem({
  title,
  company,
  companyURL,
  period,
  description,
  skills,
}: ExperienceItemProps): JSX.Element {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-gray-500">{period}</span>
      </div>
      <Link
        href={companyURL}
        target="_blank"
        className="text-gray-600 pb-2.5 rounded-md transition-colors hover:text-gray-500"
      >
        {company}
      </Link>
      <ul className="text-gray-400 mb-2 list-disc list-inside">
        {description.map((line) => (
          <li key={line} className="mb-1">
            {line}
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1.5">
        <span className="text-gray-500">Skills:</span>
        <span className="flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span key={skill} className="text-gray-500 text-sm">
              {skill}
              {index < skills.length - 1 && ", "}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export function Experience(): JSX.Element {
  return (
    <section className="my-24">
      <h2 className="text-lg font-bold mb-6">Experience</h2>
      <div>
        {experiences.map(
          ({ company, companyURL, title, period, description, skills }) => (
            <ExperienceItem
              key={`${company}-${title}`}
              title={title}
              companyURL={companyURL}
              company={company}
              period={period}
              description={description}
              skills={skills}
            />
          )
        )}
      </div>
    </section>
  );
}

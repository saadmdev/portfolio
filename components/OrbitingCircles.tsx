"use client";

import { twMerge } from "tailwind-merge";
import React from "react";

interface OrbitingCirclesProps {
  className?: string;
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width={radius * 2 + 10}
          height={radius * 2 + 10}
        >
          <circle
            className="stroke-1 stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index;
        return (
          <div
            key={index}
            style={{
              "--duration": `${calculatedDuration}s`,
              "--radius": radius,
              "--angle": angle,
              "--icon-size": `${iconSize}px`,
            } as React.CSSProperties}
            className={twMerge(
              `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex size-[var(--icon-size)] transform-gpu animate-orbit items-center justify-center rounded-full`,
              reverse ? "[animation-direction:reverse]" : "",
              className
            )}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

const Icon = ({ src, alt }: { src: string; alt: string }) => (
  <img 
    src={src} 
    alt={alt}
    className="w-full h-full object-contain rounded-sm hover:scale-110 duration-200" 
  />
);

export function Frameworks() {
  const skills = [
    "auth0",
    "blazor",
    "cplusplus",
    "csharp",
    "css3",
    "dotnet",
    "dotnetcore",
    "git",
    "html5",
    "javascript",
    "microsoft",
    "react",
    "sqlite",
    "tailwindcss",
    "vitejs",
    "wordpress",
  ];
  
  const reversedSkills = [...skills].reverse();
  
  return (
    <div className="relative w-[400px] h-[400px]">
      <OrbitingCircles iconSize={40} radius={160} duration={35}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`/logos/${skill}.svg`} alt={skill} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse duration={25}>
        {reversedSkills.map((skill, index) => (
          <Icon key={index} src={`/logos/${skill}.svg`} alt={skill} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

export default OrbitingCircles;

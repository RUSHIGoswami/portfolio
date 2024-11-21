import { ReactNode } from "react";
import { SparklesCore } from "./sparkles";

interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export const SectionWrapper = ({
  children,
  id,
  className = "",
}: SectionWrapperProps) => {
  return (
    <section
      id={id}
      className={`relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden py-24 md:py-8 ${className}`}
    >
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id={`tsparticles-${id}`}
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Gradient overlay for better content visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/50 pointer-events-none z-10" />

      {/* Content */}
      <div
        className="relative z-20 w-full max-w-[90rem] mx-auto 
        px-4 sm:px-6 md:px-8 lg:px-12
        pl-4 sm:pl-6 md:pl-24 lg:pl-28
        pr-4 sm:pr-6 md:pr-12 lg:pr-16"
      >
        {children}
      </div>
    </section>
  );
};

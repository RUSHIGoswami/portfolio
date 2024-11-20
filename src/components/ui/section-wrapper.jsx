import { SparklesCore } from "../../ui/sparkles";

export const SectionWrapper = ({ children, id, className = "" }) => {
  return (
    <section
      id={id}
      className={`relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden py-24 md:py-32 ${className}`}
    >
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id={`tsparticles-${id}`}
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Gradient overlay for better content visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/50 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 w-full">
        {children}
      </div>
    </section>
  );
};

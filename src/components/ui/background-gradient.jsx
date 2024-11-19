import { cn } from "../../utils/cn";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-75 group-hover:opacity-100 blur-lg transition duration-500",
          animate && "animate-gradient",
          className
        )}
      />
      <div className="relative bg-zinc-900 rounded-lg p-2">
        {children}
      </div>
    </div>
  );
};

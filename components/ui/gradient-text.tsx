import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientText({
  children,
  className,
  gradient = "from-purple-600 via-blue-500 to-teal-400",
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradient,
        className,
      )}
    >
      {children}
    </span>
  );
}

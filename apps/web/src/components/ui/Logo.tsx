import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  hideText?: boolean;
}

export default function Logo({ className, size = "md", href = "/", hideText = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const bracketClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-2xl",
  };

  return (
    <Link 
      href={href} 
      className={cn("inline-flex items-center gap-1 group", className)}
    >
      <div className="flex items-center">
        <Image
          src="/MINT_LOGO.jpg"
          alt="MInT Logo"
          width={size === "sm" ? 70 : size === "lg" ? 120 : 90}
          height={size === "sm" ? 25 : size === "lg" ? 40 : 32}
          className={cn(
            "object-contain w-auto",
            size === "sm" ? "h-6" : size === "lg" ? "h-10" : "h-8"
          )}
          priority
        />
      </div>
    </Link>
  );
}

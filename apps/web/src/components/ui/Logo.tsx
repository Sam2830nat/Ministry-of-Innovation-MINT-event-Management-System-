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
          width={size === "sm" ? 80 : size === "lg" ? 140 : 110}
          height={size === "sm" ? 30 : size === "lg" ? 50 : 40}
          className="object-contain"
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
    </Link>
  );
}

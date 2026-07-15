import Link from "next/link";
import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 40, className = "" }: LogoMarkProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="Aftab Malik Paint House Logo"
        fill
        className="object-contain"
        sizes={`${size}px`}
      />
    </div>
  );
}

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={42} className="shrink-0 drop-shadow-sm" />
      {showWordmark && (
        <div className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight text-[var(--color-primary)]">
            Aftab Malik
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Paint House
          </span>
        </div>
      )}
    </Link>
  );
}

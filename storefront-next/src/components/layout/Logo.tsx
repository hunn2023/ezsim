import Icon from "@/components/ui/Icon";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-[28px] font-extrabold tracking-tight no-underline text-navy">
      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-[22px]">
        <Icon icon="bolt" />
      </div>
      ez<span className="gradient-text">sim</span>
    </Link>
  );
}

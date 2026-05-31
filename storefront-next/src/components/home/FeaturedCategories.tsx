import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

const categories: { name: string; icon: IconName; href: string; color: string }[] = [
  { name: "eSIM Du lịch", icon: "globe-asia", href: "/esim", color: "bg-primary-light text-primary" },
  { name: "Thẻ Viễn thông", icon: "sim-card", href: "/the-nap", color: "bg-success-light text-success" },
  { name: "Thẻ Game", icon: "gamepad", href: "/the-game", color: "bg-warning-light text-warning" },
  { name: "Data 4G/5G", icon: "wifi", href: "/data", color: "bg-secondary-light text-secondary-dark" },
  { name: "Khuyến mãi", icon: "tag", href: "/khuyen-mai", color: "bg-danger-light text-danger" },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-container mx-auto px-4 md:px-6">
        <h2 className="text-center mb-8">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="card flex flex-col items-center gap-3 p-6 text-center hover:scale-[1.02]"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${cat.color}`}>
                <Icon icon={cat.icon} />
              </div>
              <span className="font-semibold text-sm text-navy">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

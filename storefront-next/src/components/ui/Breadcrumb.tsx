import Icon from "@/components/ui/Icon";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-white py-4 border-b border-gray-200">
      <div className="max-w-container mx-auto px-6 flex items-center gap-2 text-[13px] text-gray-500">
        <Link href="/" className="text-gray-500 hover:text-primary">
          <Icon icon="home" />
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <Icon icon="chevron-right" className="text-[10px]" />
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-primary">{item.label}</Link>
            ) : (
              <span className="text-navy font-semibold">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

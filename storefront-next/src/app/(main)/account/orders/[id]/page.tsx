import OrderDetailClient from "./OrderDetailClient";

export const dynamicParams = false;

// Static export requires at least a placeholder entry
export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}


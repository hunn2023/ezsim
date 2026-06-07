import { mockBlogPosts } from "@/lib/mock-blog-posts";
import type { Language } from "@/lib/i18n";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

export const BLOG_PAGE_SIZE = 6;

export interface BlogListResult {
  posts: BlogPostSummary[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

const EN_BLOG_OVERRIDES: Record<
  string,
  {
    title: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
    author?: string;
    content: string;
  }
> = {
  "top-10-meo-dung-esim-du-lich-nam-2026": {
    title: "Top 10 travel eSIM tips for 2026",
    excerpt: "A practical guide to choosing the right eSIM package, avoiding roaming fees, and staying connected on every trip.",
    metaTitle: "Top 10 travel eSIM tips for 2026 | EZSIM",
    metaDescription: "Discover 10 practical tips to choose, activate, and use travel eSIM efficiently in 2026.",
    author: "EZSIM Editorial Team",
    content: `
      <p>Travel eSIM has become the default option for many travelers because it removes the need to buy a physical SIM at the airport.</p>
      <h2>1. Check device compatibility</h2>
      <p>Before purchasing, make sure your phone supports eSIM and is carrier-unlocked.</p>
      <h2>2. Buy before departure</h2>
      <p>Purchase your package before your trip so you can connect as soon as you land.</p>
      <blockquote>Tip: Keep your primary SIM active for OTP and calls, and use eSIM for data.</blockquote>
      <h2>3. Choose by trip duration</h2>
      <ul>
        <li>Short trips (3-5 days): smaller and cheaper plans</li>
        <li>Business trips (7-10 days): balanced plans with stable speed</li>
        <li>Long stays (15+ days): large or unlimited plans</li>
      </ul>
      <p>Choosing the right validity period is usually more important than choosing the largest data package.</p>
    `,
  },
  "cach-kich-hoat-esim-trong-chua-den-1-phut": {
    title: "How to activate eSIM in under 1 minute",
    excerpt: "Quick setup guide for iPhone and Android, plus troubleshooting tips when QR scanning fails.",
    metaTitle: "How to activate eSIM in under 1 minute | EZSIM",
    metaDescription: "A quick setup guide for eSIM on iPhone and Android with common troubleshooting tips.",
    author: "Admin",
    content: `
      <p>Most eSIM activations take less than one minute if you follow the setup flow correctly.</p>
      <h2>Recommended setup sequence</h2>
      <ol>
        <li>Connect to stable Wi-Fi.</li>
        <li>Open eSIM settings and scan your QR code.</li>
        <li>Name your line clearly, for example: Travel Data.</li>
        <li>Set eSIM as data line and keep primary SIM for calls.</li>
      </ol>
      <p>If QR scanning fails, use the SM-DP+ address and activation code from your order email.</p>
    `,
  },
  "nhung-quoc-gia-phu-hop-nhat-cho-nguoi-moi-dung-esim": {
    title: "Best countries for first-time eSIM users",
    excerpt: "If this is your first eSIM trip, these destinations offer smoother setup and more stable experience.",
    metaTitle: "Best countries for first-time eSIM users",
    metaDescription: "Explore beginner-friendly destinations with stable network quality and easy eSIM setup.",
    author: "Content Team",
    content: `
      <p>Japan, South Korea, Thailand, and Singapore are ideal for first-time eSIM users thanks to reliable networks and simple activation.</p>
      <h2>Why are these destinations beginner-friendly?</h2>
      <ul>
        <li>Wide 4G/5G coverage in major cities</li>
        <li>Clear carrier information and predictable quality</li>
        <li>Stable speed and easy onboarding flow</li>
      </ul>
      <p>Always check hotspot policy, fair-usage limits, and package validity start time.</p>
    `,
  },
  "kinh-nghiem-du-lich-nhat-ban-chon-goi-esim-the-nao-cho-hop-ly": {
    title: "Japan travel guide: how to choose the right eSIM package",
    excerpt: "Learn how to pick data size, validity, and cost-saving options for your Japan trip.",
    metaTitle: "Japan travel guide: how to choose the right eSIM package",
    metaDescription: "Choose the right Japan eSIM based on itinerary, group size, and daily data usage.",
    author: "EZSIM Travel Desk",
    content: `
      <p>Japan is one of the top markets for travel eSIM because travelers heavily rely on maps, translation, and public transport apps.</p>
      <h2>How should you choose your package?</h2>
      <ul>
        <li>3-5 days: 3GB to 5GB packages</li>
        <li>7-10 days: 5GB/day or 10GB total packages</li>
        <li>Group travel: prioritize hotspot-enabled packages</li>
      </ul>
      <p>If you use video calls and maps frequently, choose a slightly larger package to avoid mid-trip top-ups.</p>
    `,
  },
  "esim-hay-sim-vat-ly-dau-la-lua-chon-tot-hon-cho-du-lich-nuoc-ngoai": {
    title: "eSIM vs physical SIM: which is better for international travel?",
    excerpt: "A quick comparison of cost, convenience, and activation speed to help you choose confidently.",
    metaTitle: "eSIM vs physical SIM: which is better for international travel?",
    metaDescription: "Compare eSIM and physical SIM options and choose the best one for your upcoming trip.",
    author: "Editor",
    content: `
      <p>eSIM is ideal if you want instant setup, no SIM swap, and online purchase before departure.</p>
      <h2>When should you choose eSIM?</h2>
      <ul>
        <li>Short business or leisure trips</li>
        <li>Need to keep your primary SIM for OTP</li>
        <li>Prefer setup before boarding</li>
      </ul>
      <p>Physical SIM still makes sense for older devices, but for most modern users, eSIM is significantly more convenient.</p>
    `,
  },
  "meo-tiet-kiem-5-15-phan-tram-khi-mua-the-game-va-esim-tai-ezsim": {
    title: "How to save 5-15% when buying game cards and eSIM on EZSIM",
    excerpt: "Smart purchasing habits can noticeably reduce your costs for eSIM and game cards.",
    metaTitle: "How to save 5-15% when buying game cards and eSIM on EZSIM",
    metaDescription: "Explore practical tips to save money when buying eSIM and game cards regularly.",
    author: "Content Development Team",
    content: `
      <p>If you buy eSIM or game cards regularly, choosing the right timing and package can reduce your total spend significantly.</p>
      <h2>Useful savings tips</h2>
      <ul>
        <li>Track seasonal promotions</li>
        <li>Match package size with itinerary instead of overbuying</li>
        <li>Purchase early to avoid last-minute pricing</li>
      </ul>
      <p>For group travel, planning shared purchases before departure is often more cost-effective than buying individually.</p>
    `,
  },
};

function localizeBlogPost(post: BlogPost, language: Language): BlogPost {
  if (language !== "en") return post;

  const override = EN_BLOG_OVERRIDES[post.slug];
  if (!override) return post;

  return {
    ...post,
    title: override.title,
    excerpt: override.excerpt,
    metaTitle: override.metaTitle,
    metaDescription: override.metaDescription,
    author: override.author ?? post.author,
    content: override.content,
  };
}

function sortByPublishDateDesc(a: { publishedAt: string }, b: { publishedAt: string }) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function getBlogPosts(language: Language = "vi"): Promise<BlogPostSummary[]> {
  return getSortedBlogPosts(language).map(({ content: _content, ...summary }) => summary);
}

export async function getLatestBlogPosts(limit = 3, language: Language = "vi"): Promise<BlogPostSummary[]> {
  return getSortedBlogPosts(language)
    .slice(0, limit)
    .map(({ content: _content, ...summary }) => summary);
}

export async function getBlogPostsPage(page = 1, pageSize = BLOG_PAGE_SIZE, language: Language = "vi"): Promise<BlogListResult> {
  const sortedPosts = getSortedBlogPosts(language);
  const totalPosts = sortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    posts: sortedPosts
      .slice(startIndex, startIndex + pageSize)
      .map(({ content: _content, ...summary }) => summary),
    currentPage,
    totalPages,
    totalPosts,
  };
}

export async function getBlogPostBySlug(slug: string, language: Language = "vi"): Promise<BlogPost | null> {
  const post = mockBlogPosts.find((item) => item.slug === slug) ?? null;
  return post ? localizeBlogPost(post, language) : null;
}

export async function getRelatedBlogPosts(slug: string, limit = 3, language: Language = "vi"): Promise<BlogPostSummary[]> {
  return getSortedBlogPosts(language)
    .filter((post) => post.slug !== slug)
    .slice(0, limit)
    .map(({ content: _content, ...summary }) => summary);
}

export async function getBlogSlugs(): Promise<string[]> {
  return getSortedBlogPosts("vi").map((post) => post.slug);
}

function getSortedBlogPosts(language: Language = "vi"): BlogPost[] {
  return [...mockBlogPosts]
    .map((post) => localizeBlogPost(post, language))
    .sort(sortByPublishDateDesc);
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  postsCount: number;
  department: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "archived";
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  views: number;
  excerpt: string;
}

export interface PostDetail extends Post {
  content: string;
  comments: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  growthRate: number;
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@poc.dev",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
    postsCount: 24,
    department: "Engineering",
  },
  {
    id: "2",
    name: "Grace Hopper",
    email: "grace@poc.dev",
    role: "editor",
    status: "active",
    createdAt: "2024-02-20",
    postsCount: 18,
    department: "Engineering",
  },
  {
    id: "3",
    name: "Margaret Hamilton",
    email: "margaret@poc.dev",
    role: "viewer",
    status: "active",
    createdAt: "2024-03-10",
    postsCount: 5,
    department: "Operations",
  },
  {
    id: "4",
    name: "Hedy Lamarr",
    email: "hedy@poc.dev",
    role: "editor",
    status: "pending",
    createdAt: "2024-04-05",
    postsCount: 0,
    department: "Marketing",
  },
  {
    id: "5",
    name: "Katherine Johnson",
    email: "katherine@poc.dev",
    role: "viewer",
    status: "active",
    createdAt: "2024-04-18",
    postsCount: 12,
    department: "Data",
  },
  {
    id: "6",
    name: "Dorothy Vaughan",
    email: "dorothy@poc.dev",
    role: "editor",
    status: "inactive",
    createdAt: "2024-05-01",
    postsCount: 7,
    department: "Data",
  },
  {
    id: "7",
    name: "Radia Perlman",
    email: "radia@poc.dev",
    role: "admin",
    status: "active",
    createdAt: "2024-05-20",
    postsCount: 31,
    department: "Engineering",
  },
  {
    id: "8",
    name: "Barbara Liskov",
    email: "barbara@poc.dev",
    role: "editor",
    status: "active",
    createdAt: "2024-06-10",
    postsCount: 15,
    department: "Engineering",
  },
  {
    id: "9",
    name: "Vint Cerf",
    email: "vint@poc.dev",
    role: "viewer",
    status: "pending",
    createdAt: "2024-06-25",
    postsCount: 0,
    department: "Infrastructure",
  },
  {
    id: "10",
    name: "Tim Berners-Lee",
    email: "tim@poc.dev",
    role: "editor",
    status: "active",
    createdAt: "2024-07-01",
    postsCount: 9,
    department: "Infrastructure",
  },
  {
    id: "11",
    name: "Linus Torvalds",
    email: "linus@poc.dev",
    role: "admin",
    status: "active",
    createdAt: "2024-07-15",
    postsCount: 42,
    department: "Engineering",
  },
  {
    id: "12",
    name: "Guido van Rossum",
    email: "guido@poc.dev",
    role: "editor",
    status: "active",
    createdAt: "2024-08-01",
    postsCount: 27,
    department: "Engineering",
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "Understanding TanStack Router Internals",
    slug: "tanstack-router-internals",
    status: "published",
    authorId: "1",
    authorName: "Ada Lovelace",
    createdAt: "2024-08-10",
    updatedAt: "2024-08-12",
    tags: ["routing", "react", "typescript"],
    views: 4521,
    excerpt:
      "A deep dive into how TanStack Router manages type safety at the route level using TypeScript generics and code generation.",
  },
  {
    id: "2",
    title: "Search Params as State: The Right Way",
    slug: "search-params-as-state",
    status: "published",
    authorId: "2",
    authorName: "Grace Hopper",
    createdAt: "2024-08-15",
    updatedAt: "2024-08-16",
    tags: ["routing", "state", "url"],
    views: 3211,
    excerpt:
      "Why URL search params beat component state for shareable, bookmarkable UI and how to use Zod to keep them type-safe.",
  },
  {
    id: "3",
    title: "Route Loaders vs React Query: When to Use What",
    slug: "route-loaders-vs-react-query",
    status: "draft",
    authorId: "1",
    authorName: "Ada Lovelace",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-03",
    tags: ["data-fetching", "react-query", "loaders"],
    views: 0,
    excerpt:
      "Both solve data fetching, but at different layers. Understanding the boundary makes your app more predictable.",
  },
  {
    id: "4",
    title: "beforeLoad: The Guard Pattern",
    slug: "beforeload-guard-pattern",
    status: "published",
    authorId: "7",
    authorName: "Radia Perlman",
    createdAt: "2024-09-10",
    updatedAt: "2024-09-11",
    tags: ["auth", "guards", "routing"],
    views: 2876,
    excerpt:
      "How to implement robust authentication and authorization at the route level using beforeLoad and throw redirect().",
  },
  {
    id: "5",
    title: "Code Splitting with lazyRouteComponent",
    slug: "code-splitting-lazy-routes",
    status: "published",
    authorId: "8",
    authorName: "Barbara Liskov",
    createdAt: "2024-09-20",
    updatedAt: "2024-09-21",
    tags: ["performance", "lazy-loading", "bundling"],
    views: 1987,
    excerpt:
      "Achieving optimal bundle sizes by splitting at route boundaries — the most natural and effective code splitting strategy.",
  },
  {
    id: "6",
    title: "Error Boundaries Per Route",
    slug: "error-boundaries-per-route",
    status: "published",
    authorId: "2",
    authorName: "Grace Hopper",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-02",
    tags: ["errors", "ux", "resilience"],
    views: 1543,
    excerpt:
      "Stop letting one broken route crash the entire app. TanStack Router gives you granular error boundaries out of the box.",
  },
  {
    id: "7",
    title: "RouterContext: Dependency Injection for Routes",
    slug: "router-context-di",
    status: "draft",
    authorId: "11",
    authorName: "Linus Torvalds",
    createdAt: "2024-10-10",
    updatedAt: "2024-10-11",
    tags: ["patterns", "di", "context"],
    views: 0,
    excerpt:
      "Using RouterContext to inject services, stores and utilities into loaders without global singletons.",
  },
  {
    id: "8",
    title: "Scroll Restoration Deep Dive",
    slug: "scroll-restoration",
    status: "archived",
    authorId: "12",
    authorName: "Guido van Rossum",
    createdAt: "2024-10-15",
    updatedAt: "2024-10-16",
    tags: ["ux", "scroll", "navigation"],
    views: 876,
    excerpt:
      "The surprisingly complex problem of scroll restoration and how TanStack Router handles it automatically.",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simulateError(rate = 0): void {
  if (Math.random() < rate)
    throw new Error("Simulated network error — retry or check console");
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(600);
  return {
    totalUsers: MOCK_USERS.length,
    activeUsers: MOCK_USERS.filter((u) => u.status === "active").length,
    totalPosts: MOCK_POSTS.length,
    publishedPosts: MOCK_POSTS.filter((p) => p.status === "published").length,
    totalViews: MOCK_POSTS.reduce((acc, p) => acc + p.views, 0),
    growthRate: 12.4,
  };
}

export interface UsersQuery {
  page: number;
  perPage: number;
  search: string;
  role: string;
  status: string;
  sortBy: "name" | "createdAt" | "postsCount";
  sortDir: "asc" | "desc";
}

export async function fetchUsers(
  query: Partial<UsersQuery> = {},
): Promise<PaginatedResult<User>> {
  await delay(500);
  simulateError(0.05);

  const {
    page = 1,
    perPage = 5,
    search = "",
    role = "",
    status = "",
    sortBy = "name",
    sortDir = "asc",
  } = query;

  let filtered = [...MOCK_USERS];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower),
    );
  }
  if (role) filtered = filtered.filter((u) => u.role === role);
  if (status) filtered = filtered.filter((u) => u.status === status);

  filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const cmp =
      typeof aVal === "number"
        ? aVal - (bVal as number)
        : String(aVal).localeCompare(String(bVal));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function fetchUserById(id: string): Promise<User> {
  await delay(400);
  const user = MOCK_USERS.find((u) => u.id === id);
  if (!user) throw new Error(`User ${id} not found`);
  return user;
}

export interface PostsQuery {
  page: number;
  perPage: number;
  search: string;
  status: string;
  tag: string;
  sortBy: "createdAt" | "views" | "title";
  sortDir: "asc" | "desc";
}

export async function fetchPosts(
  query: Partial<PostsQuery> = {},
): Promise<PaginatedResult<Post>> {
  await delay(550);
  simulateError(0.05);

  const {
    page = 1,
    perPage = 5,
    search = "",
    status = "",
    tag = "",
    sortBy = "createdAt",
    sortDir = "desc",
  } = query;

  let filtered = [...MOCK_POSTS];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.excerpt.toLowerCase().includes(lower),
    );
  }
  if (status) filtered = filtered.filter((p) => p.status === status);
  if (tag) filtered = filtered.filter((p) => p.tags.includes(tag));

  filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const cmp =
      typeof aVal === "number"
        ? aVal - (bVal as number)
        : String(aVal).localeCompare(String(bVal));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function fetchPostById(id: string): Promise<PostDetail> {
  await delay(450);
  const post = MOCK_POSTS.find((p) => p.id === id);
  if (!post) throw new Error(`Post ${id} not found`);
  return {
    ...post,
    content: `# ${post.title}\n\n${post.excerpt}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n## Key Concepts\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.\n\n## Conclusion\n\nDonec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.`,
    comments: Math.floor(Math.random() * 40),
  };
}

export async function fetchAllTags(): Promise<string[]> {
  await delay(200);
  const tags = new Set(MOCK_POSTS.flatMap((p) => p.tags));
  return Array.from(tags).sort();
}

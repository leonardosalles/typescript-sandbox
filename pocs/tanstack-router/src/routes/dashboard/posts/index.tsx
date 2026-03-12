import {
  createFileRoute,
  redirect,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import { fetchPosts, fetchAllTags } from "@/lib/api";
import { Badge, SkeletonTable, ErrorDisplay } from "@/components/ui";
import type { Post } from "@/lib/api";
import { isAuthenticated } from "@/store/auth";

const postsSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(5).max(50).default(5),
  search: z.string().default(""),
  status: z.enum(["", "published", "draft", "archived"]).default(""),
  tag: z.string().default(""),
  sortBy: z.enum(["createdAt", "views", "title"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

type PostsSearch = z.infer<typeof postsSearchSchema>;

export const Route = createFileRoute("/dashboard/posts/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },

  validateSearch: postsSearchSchema,

  loaderDeps: ({ search }) => search,

  loader: async ({ deps: search, context }) => {
    console.log(
      "[loader] Posts loader running for user:",
      context.auth.user?.email,
    );
    const [result, allTags] = await Promise.all([
      fetchPosts(search),
      fetchAllTags(),
    ]);
    return { result, allTags };
  },

  pendingComponent: () => (
    <div className="page">
      <div className="page-header">
        <div className="skeleton" style={{ width: 100, height: 28 }} />
      </div>
      <SkeletonTable rows={5} cols={5} />
    </div>
  ),

  errorComponent: ({ error, reset }) => (
    <div className="page">
      <div className="page-header">
        <h1>Posts</h1>
      </div>
      <ErrorDisplay
        error={error as Error}
        title="Failed to load posts"
        retry={reset}
      />
    </div>
  ),

  component: PostsPage,
});

function PostsPage() {
  const { result, allTags } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  function updateSearch(updates: Partial<PostsSearch>) {
    navigate({ search: (prev) => ({ ...prev, ...updates, page: 1 }) });
  }

  function toggleSort(field: PostsSearch["sortBy"]) {
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy: field,
        sortDir:
          prev.sortBy === field && prev.sortDir === "asc" ? "desc" : "asc",
      }),
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Posts</h1>
          <p className="page-subtitle">{result.total} total posts</p>
        </div>
      </div>

      <div className="debug-panel">
        <strong>Search params:</strong>
        <code>{JSON.stringify(search)}</code>
      </div>

      <div className="filters">
        <input
          className="filter-input"
          type="search"
          placeholder="Search posts..."
          value={search.search}
          onChange={(e) => updateSearch({ search: e.target.value })}
        />
        <select
          className="filter-select"
          value={search.status}
          onChange={(e) =>
            updateSearch({ status: e.target.value as PostsSearch["status"] })
          }
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          className="filter-select"
          value={search.tag}
          onChange={(e) => updateSearch({ tag: e.target.value })}
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort("title")}>
                Title{" "}
                {search.sortBy === "title"
                  ? search.sortDir === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>
              <th>Author</th>
              <th>Status</th>
              <th>Tags</th>
              <th className="sortable" onClick={() => toggleSort("views")}>
                Views{" "}
                {search.sortBy === "views"
                  ? search.sortDir === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>
              <th className="sortable" onClick={() => toggleSort("createdAt")}>
                Date{" "}
                {search.sortBy === "createdAt"
                  ? search.sortDir === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </tbody>
        </table>
      </div>

      {result.data.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h3>No posts found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}

      <div className="pagination">
        <span className="pagination-info">
          {(search.page - 1) * search.perPage + 1}–
          {Math.min(search.page * search.perPage, result.total)} of{" "}
          {result.total}
        </span>
        <div className="pagination-buttons">
          <Link
            to="/dashboard/posts"
            search={{
              page: search.page - 1,
              perPage: search.perPage,
              search: search.search,
              status: search.status,
              tag: search.tag,
              sortBy: search.sortBy,
              sortDir: search.sortDir,
            }}
            disabled={search.page <= 1}
            className="btn btn-sm"
          >
            ← Prev
          </Link>
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                to="/dashboard/posts"
                search={{
                  page: p,
                  perPage: search.perPage,
                  search: search.search,
                  status: search.status,
                  tag: search.tag,
                  sortBy: search.sortBy,
                  sortDir: search.sortDir,
                }}
                className={`btn btn-sm ${p === search.page ? "btn-active" : ""}`}
              >
                {p}
              </Link>
            ),
          )}
          <Link
            to="/dashboard/posts"
            search={{
              page: search.page + 1,
              perPage: search.perPage,
              search: search.search,
              status: search.status,
              tag: search.tag,
              sortBy: search.sortBy,
              sortDir: search.sortDir,
            }}
            disabled={search.page >= result.totalPages}
            className="btn btn-sm"
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}

function PostRow({ post }: { post: Post }) {
  const statusBadge: Record<Post["status"], "success" | "neutral" | "warning"> =
    {
      published: "success",
      draft: "neutral",
      archived: "warning",
    };
  return (
    <tr>
      <td>
        <strong>{post.title}</strong>
        <div className="text-muted excerpt">{post.excerpt}</div>
      </td>
      <td>{post.authorName}</td>
      <td>
        <Badge variant={statusBadge[post.status]}>{post.status}</Badge>
      </td>
      <td>
        <div className="tag-list">
          {post.tags.slice(0, 2).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="tag">+{post.tags.length - 2}</span>
          )}
        </div>
      </td>
      <td>{post.views.toLocaleString()}</td>
      <td>{post.createdAt}</td>
      <td>
        <Link
          to="/dashboard/posts/$postId"
          params={{ postId: post.id }}
          className="btn btn-sm"
          preload="intent"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

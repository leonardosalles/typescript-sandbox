import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { fetchPostById } from "@/lib/api";
import { isAuthenticated } from "@/store/auth";
import { Badge, ErrorDisplay } from "@/components/ui";
import type { Post } from "@/lib/api";

export const Route = createFileRoute("/dashboard/posts/$postId")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/login" });
  },

  loader: async ({ params }) => {
    const post = await fetchPostById(params.postId);
    return { post };
  },

  pendingComponent: () => (
    <div className="page">
      <div
        className="skeleton"
        style={{ height: 28, width: 120, marginBottom: 24 }}
      />
      <div
        className="skeleton"
        style={{ height: 48, width: "60%", marginBottom: 16 }}
      />
      <div className="skeleton" style={{ height: 200 }} />
    </div>
  ),

  errorComponent: ({ error, reset }) => (
    <div className="page">
      <Link to="/dashboard/posts" className="back-link">
        ← Back to Posts
      </Link>
      <ErrorDisplay
        error={error as Error}
        title="Post not found"
        retry={reset}
      />
    </div>
  ),

  component: PostDetailPage,
});

function PostDetailPage() {
  const { post } = Route.useLoaderData();

  const statusBadge: Record<Post["status"], "success" | "neutral" | "warning"> =
    {
      published: "success",
      draft: "neutral",
      archived: "warning",
    };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/dashboard/posts" className="back-link">
          ← Back to Posts
        </Link>
      </div>

      <div className="post-detail">
        <div className="post-detail-header">
          <Badge variant={statusBadge[post.status]}>{post.status}</Badge>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>By {post.authorName}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
            <span>·</span>
            <span>{post.views.toLocaleString()} views</span>
            <span>·</span>
            <span>{post.comments} comments</span>
          </div>
          <div className="tag-list">
            {post.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="post-body">
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("# ")) return <h1 key={i}>{para.slice(2)}</h1>;
            if (para.startsWith("## ")) return <h2 key={i}>{para.slice(3)}</h2>;
            return <p key={i}>{para}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

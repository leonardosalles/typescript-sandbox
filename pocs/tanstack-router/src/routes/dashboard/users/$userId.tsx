import {
  createFileRoute,
  redirect,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { fetchUserById, fetchPosts } from "@/lib/api";
import { isAuthenticated } from "@/store/auth";
import { Badge, ErrorDisplay } from "@/components/ui";
import type { User, Post } from "@/lib/api";

export const Route = createFileRoute("/dashboard/users/$userId")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/login" });
  },

  loader: async ({ params }) => {
    const [user, postsResult] = await Promise.all([
      fetchUserById(params.userId),
      fetchPosts({ perPage: 50 }),
    ]);
    const userPosts = postsResult.data.filter(
      (p) => p.authorId === params.userId,
    );
    return { user, userPosts };
  },

  pendingComponent: UserDetailPending,

  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard/users" className="back-link">
            ← Back to Users
          </Link>
        </div>
        <ErrorDisplay
          error={error as Error}
          title="User not found"
          retry={() => {
            reset();
            router.invalidate();
          }}
        />
      </div>
    );
  },

  component: UserDetailPage,
});

function UserDetailPage() {
  const { user, userPosts } = Route.useLoaderData();
  const { userId } = Route.useParams();

  const roleBadge: Record<User["role"], "info" | "success" | "neutral"> = {
    admin: "info",
    editor: "success",
    viewer: "neutral",
  };
  const statusBadge: Record<User["status"], "success" | "danger" | "warning"> =
    {
      active: "success",
      inactive: "danger",
      pending: "warning",
    };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/dashboard/users" className="back-link">
          ← Back to Users
        </Link>
      </div>

      <div className="debug-panel">
        <strong>Route param:</strong> <code>$userId = "{userId}"</code>
        <span> — Data fetched in parallel: user + posts in one loader</span>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="user-profile">
            <div className="profile-avatar">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <div className="profile-badges">
                <Badge variant={roleBadge[user.role]}>{user.role}</Badge>
                <Badge variant={statusBadge[user.status]}>{user.status}</Badge>
              </div>
            </div>
          </div>

          <div className="detail-fields">
            {[
              { label: "User ID", value: user.id },
              { label: "Department", value: user.department },
              { label: "Member Since", value: user.createdAt },
              { label: "Total Posts", value: user.postsCount },
            ].map((f) => (
              <div key={f.label} className="detail-field">
                <span className="field-label">{f.label}</span>
                <span className="field-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-card">
          <h3>
            Posts by {user.name.split(" ")[0]} ({userPosts.length})
          </h3>
          {userPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No posts yet</h3>
            </div>
          ) : (
            <div className="post-list">
              {userPosts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PostItem({ post }: { post: Post }) {
  const statusColor: Record<Post["status"], "success" | "neutral" | "warning"> =
    {
      published: "success",
      draft: "neutral",
      archived: "warning",
    };
  return (
    <div className="post-item">
      <div className="post-item-header">
        <strong>{post.title}</strong>
        <Badge variant={statusColor[post.status]}>{post.status}</Badge>
      </div>
      <div className="post-item-meta">
        {post.views.toLocaleString()} views · {post.createdAt} ·{" "}
        <Link
          to="/dashboard/posts/$postId"
          params={{ postId: post.id }}
          className="link"
        >
          View post →
        </Link>
      </div>
    </div>
  );
}

function UserDetailPending() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="skeleton" style={{ width: 120, height: 20 }} />
      </div>
      <div className="detail-grid">
        <div className="detail-card">
          <div className="skeleton" style={{ height: 120 }} />
        </div>
        <div className="detail-card">
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      </div>
    </div>
  );
}

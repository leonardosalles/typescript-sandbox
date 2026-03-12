import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { z } from "zod";
import { fetchUsers } from "@/lib/api";
import { isAuthenticated } from "@/store/auth";
import { Badge, SkeletonTable, ErrorDisplay } from "@/components/ui";
import type { User } from "@/lib/api";
import { useCallback } from "react";

const usersSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(5).max(50).default(5),
  search: z.string().default(""),
  role: z.enum(["", "admin", "editor", "viewer"]).default(""),
  status: z.enum(["", "active", "inactive", "pending"]).default(""),
  sortBy: z.enum(["name", "createdAt", "postsCount"]).default("name"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});

type UsersSearch = z.infer<typeof usersSearchSchema>;

export const Route = createFileRoute("/dashboard/users/")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/login" });
  },

  validateSearch: usersSearchSchema,

  loaderDeps: ({ search }) => search,

  loader: async ({ deps: search }) => {
    const result = await fetchUsers(search);
    return { result };
  },

  pendingComponent: () => (
    <div className="page">
      <div className="page-header">
        <div className="skeleton" style={{ width: 150, height: 28 }} />
      </div>
      <SkeletonTable rows={5} cols={5} />
    </div>
  ),

  errorComponent: ({ error, reset }) => (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
      </div>
      <ErrorDisplay
        error={error as Error}
        title="Failed to load users"
        retry={reset}
      />
    </div>
  ),

  component: UsersPage,
});

function UsersPage() {
  const { result } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const updateSearch = useCallback(
    (updates: Partial<UsersSearch>) => {
      navigate({
        search: (prev) => ({ ...prev, ...updates, page: 1 }),
      });
    },
    [navigate],
  );

  function toggleSort(field: UsersSearch["sortBy"]) {
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
          <h1>Users</h1>
          <p className="page-subtitle">{result.total} total members</p>
        </div>
      </div>

      <div className="debug-panel">
        <strong>Current search params (URL state):</strong>
        <code>{JSON.stringify(search, null, 2)}</code>
      </div>

      <div className="filters">
        <input
          className="filter-input"
          type="search"
          placeholder="Search users..."
          value={search.search}
          onChange={(e) => updateSearch({ search: e.target.value })}
        />
        <select
          className="filter-select"
          value={search.role}
          onChange={(e) =>
            updateSearch({ role: e.target.value as UsersSearch["role"] })
          }
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <select
          className="filter-select"
          value={search.status}
          onChange={(e) =>
            updateSearch({ status: e.target.value as UsersSearch["status"] })
          }
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        <select
          className="filter-select"
          value={search.perPage}
          onChange={(e) => updateSearch({ perPage: Number(e.target.value) })}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <SortableHeader
                label="Name"
                field="name"
                search={search}
                onSort={toggleSort}
              />
              <th>Role</th>
              <th>Status</th>
              <SortableHeader
                label="Posts"
                field="postsCount"
                search={search}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Joined"
                field="createdAt"
                search={search}
                onSort={toggleSort}
              />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {result.data.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <h3>No users found</h3>
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
            to="/dashboard/users"
            search={{
              page: search.page - 1,
              perPage: search.perPage,
              search: search.search,
              role: search.role,
              status: search.status,
              sortBy: search.sortBy,
              sortDir: search.sortDir,
            }}
            disabled={search.page <= 1}
            className="btn btn-sm"
            preload="intent"
          >
            ← Prev
          </Link>
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                to="/dashboard/users"
                search={{
                  page: p,
                  perPage: search.perPage,
                  search: search.search,
                  role: search.role,
                  status: search.status,
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
            to="/dashboard/users"
            search={{
              page: search.page + 1,
              perPage: search.perPage,
              search: search.search,
              role: search.role,
              status: search.status,
              sortBy: search.sortBy,
              sortDir: search.sortDir,
            }}
            disabled={search.page >= result.totalPages}
            className="btn btn-sm"
            preload="intent"
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  search,
  onSort,
}: {
  label: string;
  field: UsersSearch["sortBy"];
  search: UsersSearch;
  onSort: (field: UsersSearch["sortBy"]) => void;
}) {
  const isActive = search.sortBy === field;
  return (
    <th className="sortable" onClick={() => onSort(field)}>
      {label}
      <span className="sort-indicator">
        {isActive ? (search.sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
      </span>
    </th>
  );
}

function UserRow({ user }: { user: User }) {
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
    <tr>
      <td>
        <div className="user-avatar-sm">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      </td>
      <td>
        <div>
          <strong>{user.name}</strong>
          <div className="text-muted">{user.email}</div>
        </div>
      </td>
      <td>
        <Badge variant={roleBadge[user.role]}>{user.role}</Badge>
      </td>
      <td>
        <Badge variant={statusBadge[user.status]}>{user.status}</Badge>
      </td>
      <td>{user.postsCount}</td>
      <td>{user.createdAt}</td>
      <td>
        <Link
          to="/dashboard/users/$userId"
          params={{ userId: user.id }}
          className="btn btn-sm"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

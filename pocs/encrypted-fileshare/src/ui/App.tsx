import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  Folder,
  Grid2X2,
  HardDrive,
  List,
  LockKeyhole,
  Menu,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { FileShareService } from "../application/FileShareService";
import type { StoredFile } from "../domain/StoredFile";

type ViewMode = "grid" | "list";
type Location = "vault" | "trash";
type Toast = { message: string; tone: "success" | "error" };

const seedFiles = [
  {
    name: "Project brief.pdf",
    type: "application/pdf",
    text: "Encrypted Vault POC project brief",
  },
  {
    name: "Brand assets.zip",
    type: "application/zip",
    text: "simulated archive contents",
  },
  {
    name: "Team photo.jpg",
    type: "image/jpeg",
    text: "simulated image contents",
  },
];

export function App({ service }: { service: FileShareService }) {
  const [files, setFiles] = useState<readonly StoredFile[]>([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [location, setLocation] = useState<Location>("vault");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast>();
  const picker = useRef<HTMLInputElement>(null);
  const seeded = useRef(false);

  const refresh = useCallback(
    async (search = query) =>
      setFiles(
        location === "trash"
          ? (await service.listTrash()).filter((file) =>
              file.name
                .toLocaleLowerCase()
                .includes(search.trim().toLocaleLowerCase()),
            )
          : await service.search(search),
      ),
    [location, query, service],
  );

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    Promise.all(
      seedFiles.map((item) =>
        service.save({
          name: item.name,
          mimeType: item.type,
          bytes: new TextEncoder().encode(item.text).buffer,
        }),
      ),
    )
      .then(() => refresh(""))
      .catch(() =>
        setToast({ message: "Could not prepare demo files", tone: "error" }),
      );
  }, [refresh, service]);

  useEffect(() => {
    const id = window.setTimeout(() => refresh(query), 120);
    return () => clearTimeout(id);
  }, [query, refresh]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(undefined), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  async function upload(selected: FileList | File[]) {
    const picked = Array.from(selected);
    if (!picked.length) return;
    setBusy(true);
    try {
      await Promise.all(
        picked.map(async (file) =>
          service.save({
            name: file.name,
            mimeType: file.type,
            bytes: await file.arrayBuffer(),
          }),
        ),
      );
      setLocation("vault");
      setFiles(await service.search(""));
      setQuery("");
      setToast({
        message: `${picked.length} file${picked.length > 1 ? "s" : ""} encrypted and saved`,
        tone: "success",
      });
    } catch {
      setToast({
        message: "Upload failed — nothing was left half-saved",
        tone: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function download(file: StoredFile) {
    try {
      const downloaded = await service.download(file.id);
      const url = URL.createObjectURL(
        new Blob([downloaded.bytes], { type: file.mimeType }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(url);
      setToast({ message: `${file.name} decrypted locally`, tone: "success" });
    } catch {
      setToast({
        message: "Integrity check failed while decrypting",
        tone: "error",
      });
    }
  }

  async function remove(file: StoredFile) {
    try {
      await service.delete(file.id);
      await refresh();
      setToast({ message: `${file.name} moved to Trash`, tone: "success" });
    } catch {
      setToast({ message: "Could not delete this file", tone: "error" });
    }
  }

  async function restore(file: StoredFile) {
    try {
      await service.restore(file.id);
      await refresh();
      setToast({
        message: `${file.name} restored to My Vault`,
        tone: "success",
      });
    } catch {
      setToast({ message: "Could not restore this file", tone: "error" });
    }
  }

  async function permanentlyRemove(file: StoredFile) {
    try {
      await service.permanentlyDelete(file.id);
      await refresh();
      setToast({
        message: `${file.name} permanently deleted`,
        tone: "success",
      });
    } catch {
      setToast({
        message: "Could not permanently delete this file",
        tone: "error",
      });
    }
  }

  function openLocation(next: Location) {
    setLocation(next);
    setQuery("");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <button className="icon-button mobile-menu" aria-label="Menu">
            <Menu />
          </button>
          <div className="brand-mark">
            <LockKeyhole />
          </div>
          <span>Vault</span>
        </div>
        <label className="search">
          <Search size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Vault"
          />
          <button
            onClick={() => setQuery("")}
            className={query ? "clear visible" : "clear"}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        </label>
        <div className="header-actions">
          <span className="security-pill">
            <ShieldCheck size={16} /> End-to-end encrypted
          </span>
          <button className="avatar">LS</button>
        </div>
      </header>

      <aside className="sidebar">
        <button className="new-button" onClick={() => picker.current?.click()}>
          <Plus size={22} /> New <ChevronDown size={16} />
        </button>
        <nav>
          <button
            className={location === "vault" ? "active" : ""}
            onClick={() => openLocation("vault")}
          >
            <HardDrive size={19} /> My Vault
          </button>
          <button
            className={location === "trash" ? "active" : ""}
            onClick={() => openLocation("trash")}
          >
            <Trash2 size={19} /> Trash
          </button>
        </nav>
        <div className="storage-card">
          <div>
            <ShieldCheck size={18} />
            <strong>Secured in memory</strong>
          </div>
          <p>Files disappear when this tab reloads.</p>
          <div className="meter">
            <span
              style={{
                width: `${Math.min(100, files.reduce((n, f) => n + f.size, 0) / 10000)}%`,
              }}
            />
          </div>
          <small>
            {formatBytes(files.reduce((n, f) => n + f.size, 0))} encrypted
          </small>
        </div>
      </aside>

      <main>
        {location === "vault" ? (
          <>
            <section className="welcome">
              <div>
                <span className="eyebrow">PERSONAL WORKSPACE</span>
                <h1>Good morning, Leonardo</h1>
                <p>Your private place for files that matter.</p>
              </div>
              <div className="shield-art">
                <LockKeyhole />
                <span />
                <span />
                <span />
              </div>
            </section>

            <section
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                upload(e.dataTransfer.files);
              }}
            >
              <div className="upload-icon">
                <Upload />
              </div>
              <div>
                <strong>
                  {busy
                    ? "Encrypting your files…"
                    : "Drop files here to encrypt & upload"}
                </strong>
                <p>
                  or{" "}
                  <button onClick={() => picker.current?.click()}>
                    browse files
                  </button>{" "}
                  from your computer
                </p>
              </div>
              <span className="encryption-note">
                <LockKeyhole size={14} /> AES-256-GCM
              </span>
              <input
                ref={picker}
                hidden
                type="file"
                multiple
                onChange={(e) => e.target.files && upload(e.target.files)}
              />
            </section>
          </>
        ) : (
          <section className="trash-heading">
            <div className="trash-icon">
              <Trash2 />
            </div>
            <div>
              <span className="eyebrow">RECOVERY AREA</span>
              <h1>Trash</h1>
              <p>Restore files to My Vault or delete them permanently.</p>
            </div>
          </section>
        )}

        <section className="files-section">
          <div className="section-head">
            <div>
              <h2>
                {query
                  ? "Search results"
                  : location === "trash"
                    ? "Deleted files"
                    : "My files"}
              </h2>
              <span>
                {files.length} item{files.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="view-toggle">
              <button
                className={view === "grid" ? "selected" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid2X2 size={18} />
              </button>
              <button
                className={view === "list" ? "selected" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List size={19} />
              </button>
            </div>
          </div>
          {files.length === 0 ? (
            <div className="empty">
              {location === "trash" ? <Trash2 /> : <Folder />}
              <h3>
                {location === "trash" ? "Trash is empty" : "No files found"}
              </h3>
              <p>
                {location === "trash"
                  ? "Deleted files will appear here."
                  : "Try another search or upload something new."}
              </p>
            </div>
          ) : (
            <div className={`file-collection ${view}`}>
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  trashed={location === "trash"}
                  onDownload={download}
                  onDelete={location === "trash" ? permanentlyRemove : remove}
                  onRestore={restore}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {toast && (
        <div className={`toast ${toast.tone}`}>
          {toast.tone === "success" ? <Check /> : <X />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

function FileCard({
  file,
  trashed,
  onDownload,
  onDelete,
  onRestore,
}: {
  file: StoredFile;
  trashed: boolean;
  onDownload(file: StoredFile): void;
  onDelete(file: StoredFile): void;
  onRestore(file: StoredFile): void;
}) {
  const [menu, setMenu] = useState(false);
  const Icon = file.mimeType.startsWith("image/")
    ? FileImage
    : file.mimeType.includes("zip")
      ? FileArchive
      : file.mimeType.includes("pdf") || file.mimeType.startsWith("text/")
        ? FileText
        : File;
  const kind = file.mimeType.startsWith("image/")
    ? "image"
    : file.mimeType.includes("zip")
      ? "archive"
      : "document";
  return (
    <article className="file-card">
      <div className={`file-preview ${kind}`}>
        <Icon />
        <span className="mini-lock">
          <LockKeyhole />
        </span>
      </div>
      <div className="file-info">
        <div className="file-title">
          <span title={file.name}>{file.name}</span>
          <button
            onClick={() => setMenu(!menu)}
            aria-label={`Actions for ${file.name}`}
          >
            <MoreVertical size={18} />
          </button>
        </div>
        <p>
          {formatBytes(file.size)} ·{" "}
          {trashed && file.deletedAt
            ? `deleted ${relativeDate(file.deletedAt)}`
            : relativeDate(file.createdAt)}
        </p>
      </div>
      {menu && (
        <div className="context-menu">
          {!trashed && (
            <button
              onClick={() => {
                onDownload(file);
                setMenu(false);
              }}
            >
              <Download />
              Download
            </button>
          )}
          {trashed && (
            <button
              onClick={() => {
                onRestore(file);
                setMenu(false);
              }}
            >
              <RotateCcw />
              Restore to My Vault
            </button>
          )}
          <button
            className="danger"
            onClick={() => {
              onDelete(file);
              setMenu(false);
            }}
          >
            <Trash2 />
            {trashed ? "Delete forever" : "Move to Trash"}
          </button>
        </div>
      )}
    </article>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function relativeDate(date: Date): string {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

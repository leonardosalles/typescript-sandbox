# React-to-Shell — Next.js App Router POC

> ⚠️ **Educational security proof of concept**  
> This repository demonstrates a design-level risk pattern related to server-side execution boundaries. It also references the real-world **React2Shell** vulnerability.

---

## What This Project Is

This project is a minimal **Next.js App Router** proof of concept that illustrates how server-side logic defined through the UI can unintentionally evolve into executable code on the backend.

It shows how:

- A **React UI** defines transformation logic
- That logic is persisted via **Next.js Server Actions**
- The persisted logic is later executed in a server runtime
- Execution occurs outside the HTTP request life cycle

This pattern is a **design anti-pattern** that can lead to undesired execution of code — and conceptually parallels real security issues in server-side frameworks.

---

## What React2Shell Is

React2Shell is a **critical security vulnerability** tracked as **CVE-2025-55182** that was disclosed in late 2025. It affects **React Server Components** and frameworks that incorporate them, including versions of Next.js using the App Router. Under certain conditions, specially crafted HTTP requests can lead to **remote code execution (RCE)** on the server. :contentReference[oaicite:1]{index=1}

Because of its severity (CVSS 10.0) and potential impact on production servers, immediate patching of React and framework versions affected by React2Shell was strongly recommended by vendors. :contentReference[oaicite:2]{index=2}

React2Shell highlights a broader class of risks: **treating untrusted or poorly constrained data as executable logic on the server can lead to serious vulnerabilities**.

---

## What This POC Shows

In this project you will find:

- A React UI page that lets you edit a “transformer”
- A Next.js Server Action that persists this transformer to disk
- A job executor that loads and executes the saved transformer using `new Function(...)`
- Execution results written to `/executions`, making side effects visible

This mirrors real internal tooling patterns such as:

- webhook transformers
- low-code automation
- feature flag evaluation
- ETL pipelines

---

## What I Learned Building This

This project reinforced key lessons about security boundaries in server applications:

- **Server Actions are not a security boundary by themselves**
- Persisted configuration should not be treated as executable logic
- Executing logic outside the request lifecycle greatly increases impact
- Caching and revalidation can mask real state changes and lead to confusion
- “Trusting roles (e.g., admin) alone” does not eliminate risk

Most importantly:

> If user-controlled logic ends up executed on the server, **the system is already an execution platform — whether intended or not**.

React2Shell shows how vulnerable frameworks can be exploited even without explicit application-level bugs, underscoring the importance of careful architectural design when evaluating server-side rendering and server component payloads.

---

## Disclaimer

This code is **intentionally insecure** for educational purposes.  
It is not safe for production use.

Do **not** use the patterns shown here in real applications.

---

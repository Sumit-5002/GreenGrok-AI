## 2025-05-23 - DOMPurify Integration with Chart.js
**Vulnerability:** XSS in AI-generated messages rendered via `innerHTML`.
**Learning:** When using `DOMPurify` with dynamic components like `Chart.js` that rely on DOM hooks (e.g., `id` and `canvas`), the sanitizer must be explicitly configured to allow these tags and attributes. Default settings would strip them, breaking the application.
**Prevention:** Always check if third-party libraries require specific DOM structures and configure `DOMPurify` using `ADD_TAGS` and `ADD_ATTR` to maintain functionality while ensuring security.

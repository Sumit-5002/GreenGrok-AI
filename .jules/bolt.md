## 2025-01-24 - [Persistent Caching for Weather and Location]
**Learning:** Redundant network and API requests for weather and location data on every page load/refresh create unnecessary latency and consume API quotas. The application already had a `CACHE_CONFIG` structure but it was in-memory only and not utilized.
**Action:** Implement a `localStorage`-backed persistent cache for weather and location data with TTL-based expiration. This reduces perceived load time from ~500ms to near-instant for cached data.

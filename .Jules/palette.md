## 2026-02-16 - Accessibility and Interactive Feedback for Icon-Only Elements
**Learning:** In static Vanilla JS applications without a component library, icon-only buttons frequently lack screen reader labels, and modal close actions often use non-semantic elements (like spans) that are not keyboard-accessible.
**Action:** Always verify that every `.icon-btn` has an `aria-label`, use `aria-pressed` for toggle states, and ensure non-button triggers (like the modal "X") have `role="button"`, `tabindex="0"`, and explicit keyboard listeners for Enter/Space.

"use client";

import { useEffect } from "react";

const blockedShortcuts = new Set(["c", "u", "s", "p"]);

export function SiteProtection() {
  useEffect(() => {
    document.body.classList.add("unigo-copy-protected");

    const prevent = (event: Event) => event.preventDefault();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      const devToolsShortcut =
        event.key === "F12" ||
        (modifier && event.shiftKey && ["i", "j", "c"].includes(key));

      if (devToolsShortcut || (modifier && blockedShortcuts.has(key))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleCopy = (event: ClipboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement)
      ) {
        return;
      }
      event.preventDefault();
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.body.classList.remove("unigo-copy-protected");
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return null;
}

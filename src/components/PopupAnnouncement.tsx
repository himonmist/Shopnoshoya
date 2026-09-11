"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shopnoshoya_popup_last_seen";

export default function PopupAnnouncement({
  enabled,
  imageUrl,
  linkUrl,
  title,
}: {
  enabled: boolean;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !imageUrl) return;
    try {
      const lastSeen = localStorage.getItem(STORAGE_KEY);
      if (lastSeen === imageUrl) return;
    } catch {
      // localStorage unavailable (private mode etc.) — show every time, harmless.
    }
    setVisible(true);
  }, [enabled, imageUrl]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, imageUrl);
    } catch {}
  }

  if (!visible) return null;

  const img = (
    <img
      src={imageUrl}
      alt={title || "বিজ্ঞপ্তি"}
      style={{ display: "block", maxWidth: "100%", maxHeight: "82vh", objectFit: "contain" }}
    />
  );

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(14,13,14,0.86)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: 640, width: "100%" }}
      >
        <button
          onClick={dismiss}
          aria-label="বন্ধ করুন"
          style={{
            position: "absolute",
            top: -18,
            right: -18,
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--orange)",
            color: "var(--bg)",
            border: "2px solid var(--bg)",
            fontWeight: 800,
            fontSize: 18,
            cursor: "pointer",
            lineHeight: "1",
          }}
        >
          ×
        </button>
        <div style={{ border: "3px solid var(--yellow)", boxShadow: "8px 8px 0 var(--orange)", overflow: "hidden", background: "var(--bg-alt)" }}>
          {linkUrl ? (
            <a href={linkUrl} onClick={dismiss}>
              {img}
            </a>
          ) : (
            img
          )}
        </div>
      </div>
    </div>
  );
}

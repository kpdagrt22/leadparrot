import React from "react";

/**
 * Icon — thin wrapper over Lucide (the Crest icon standard).
 * Renders a Lucide glyph by name at a consistent 1.5px stroke.
 * Requires the Lucide UMD script present on the page (window.lucide).
 */
export function Icon({ name, size = 16, stroke = 1.75, color = "currentColor", style, ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (el && typeof window !== "undefined" && window.lucide) {
      el.innerHTML = "";
      el.setAttribute("data-lucide", name);
      try {
        window.lucide.createIcons({
          attrs: { width: size, height: size, "stroke-width": stroke },
          nameAttr: "data-lucide",
        });
      } catch (e) {
        /* lucide not ready — no-op */
      }
    }
  }, [name, size, stroke]);

  return (
    <i
      ref={ref}
      data-lucide={name}
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        color,
        flex: "0 0 auto",
        ...style,
      }}
      {...rest}
    />
  );
}

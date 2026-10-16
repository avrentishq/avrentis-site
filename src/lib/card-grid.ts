import type { CSSProperties } from "react";
import { cardGridColumns, type CardGridOptions } from "@avrentishq/core/ui/card-grid";

/**
 * Props for a card row on core's `.card-grid` (fills the width at any count):
 * the class, core's declared column count, and the row's own style (gap,
 * margin) merged with core's `--card-grid-min` — spreading core's props after a
 * `style` attribute silently drops one of the two.
 */
export function cardGridProps(count: number | "auto", options: CardGridOptions = {}, style: CSSProperties = {}) {
  const { style: gridStyle, ...columns } = cardGridColumns(count, options);
  return { className: "card-grid", ...columns, style: { ...gridStyle, ...style } };
}

import { STATUS_MARK_CANVAS, STATUS_MARKS, type StatusMark as StatusMarkName } from "@/lib/brand";

/**
 * The shape beside a status word (core's STATUS_MARKS): approved ● pending ○
 * flagged ◆ rejected –, so a status never relies on colour alone. Drawn in the
 * text colour of whatever it sits in; decorative, because the word says it.
 */
export function StatusMark({ status, size = 8 }: { status: StatusMarkName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${STATUS_MARK_CANVAS} ${STATUS_MARK_CANVAS}`}
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <path d={STATUS_MARKS[status].d} fill="currentColor" />
    </svg>
  );
}

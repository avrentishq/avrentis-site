# Planning convention

Long-horizon work gets a plan file on disk, not a plan held in session context. Any task
that spans more than one sitting, more than a few files, or any branch you expect to hand
off, starts by writing `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md` — the directory
that already holds this repo's plans — and that file is updated **as the work proceeds**,
not reconstructed at the end: decisions and the reasoning behind them, file paths touched,
what is done, what is left, and any unresolved error. Design work that precedes a plan goes
to `docs/superpowers/specs/<YYYY-MM-DD>-<slug>-design.md`, matching the existing files
there. The point is that conversations get compacted and sessions end, so anything living
only in context is lost; a plan on disk survives both and is the thing a fresh session
reads to pick the work up mid-flight. Note that `docs/superpowers/` is **gitignored**
(only `docs/architecture/` is tracked), so plans are local working state — if a plan
contains a decision that future sessions must respect, promote that decision into the
reference docs here or into `AGENTS.md`, because the plan file itself will not survive a
fresh clone.

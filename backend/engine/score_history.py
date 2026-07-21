"""
Compliance Scoreboard trend tracking: a lightweight JSON-backed daily
snapshot of each framework's score, so the scoreboard can show a real
month-over-month delta instead of a hardcoded one.
"""
import json
import os
import threading
from datetime import datetime, timedelta, timezone

_lock = threading.Lock()


class ScoreHistoryStore:
    def __init__(self, store_path: str):
        self.store_path = store_path
        if not os.path.exists(self.store_path):
            self._write_all([])

    def _read_all(self) -> list:
        if not os.path.exists(self.store_path):
            self._write_all([])
        with open(self.store_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write_all(self, snapshots: list):
        with open(self.store_path, "w", encoding="utf-8") as f:
            json.dump(snapshots, f, indent=2, default=str)

    def record_snapshot(self, scores: dict) -> None:
        """Appends today's {framework_key: percent} scores, once per calendar day."""
        today = datetime.now(timezone.utc).date().isoformat()
        with _lock:
            snapshots = self._read_all()
            if snapshots and snapshots[-1]["date"] == today:
                return
            snapshots.append({"date": today, "scores": scores})
            self._write_all(snapshots)

    def trend_since(self, days_ago: int, framework_key: str, current_pct: float) -> float:
        """
        Delta between `current_pct` and the oldest snapshot within the last
        `days_ago` days for `framework_key`. Returns 0.0 if there's no prior
        snapshot yet (first run) — a framework with no history simply shows
        no month-over-month movement rather than a fabricated number.
        """
        cutoff = datetime.now(timezone.utc).date() - timedelta(days=days_ago)
        with _lock:
            snapshots = self._read_all()

        in_window = [
            s for s in snapshots
            if datetime.fromisoformat(s["date"]).date() >= cutoff and framework_key in s["scores"]
        ]
        if not in_window:
            return 0.0

        oldest = min(in_window, key=lambda s: s["date"])
        return round(current_pct - oldest["scores"][framework_key], 1)


_store_instance = None


def get_score_history_store(store_path: str = None) -> ScoreHistoryStore:
    global _store_instance
    if _store_instance is None:
        if store_path is None:
            raise ValueError("store_path required for first initialization")
        _store_instance = ScoreHistoryStore(store_path)
    return _store_instance

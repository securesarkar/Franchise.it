from __future__ import annotations

import sys
from pathlib import Path

# Vercel searches for a top-level FastAPI app in entrypoint files like main.py.
BACKEND_DIR = Path(__file__).resolve().parent / "pythoind" / "franchise-matcher"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import app  # noqa: E402,F401

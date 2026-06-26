#!/usr/bin/env python3
"""Lightweight validation for this Codex plugin repo."""
from pathlib import Path
import json
root = Path(__file__).resolve().parent
required = [
    ".agents/plugins/marketplace.json",
    "plugins/canvas-apps-codex/.codex-plugin/plugin.json",
    "plugins/canvas-apps-codex/.mcp.json",
    "plugins/canvas-apps-codex/skills/canvas-app/SKILL.md",
    "plugins/canvas-apps-codex/skills/configure-canvas-mcp/SKILL.md",
    "plugins/canvas-apps-codex/references/TechnicalGuide.md",
    "plugins/canvas-apps-codex/references/DesignGuide.md",
]
ok = True
for rel in required:
    p = root / rel
    if not p.exists():
        print(f"FAIL missing {rel}")
        ok = False
    else:
        print(f"PASS found {rel}")
for rel in [".agents/plugins/marketplace.json", "plugins/canvas-apps-codex/.codex-plugin/plugin.json", "plugins/canvas-apps-codex/.mcp.json"]:
    try:
        json.loads((root / rel).read_text(encoding="utf-8"))
        print(f"PASS valid JSON {rel}")
    except Exception as exc:
        print(f"FAIL invalid JSON {rel}: {exc}")
        ok = False
for skill in (root / "plugins/canvas-apps-codex/skills").glob("*/SKILL.md"):
    text = skill.read_text(encoding="utf-8")
    if text.startswith("---") and "\n---" in text[3:]:
        print(f"PASS frontmatter {skill.relative_to(root)}")
    else:
        print(f"FAIL frontmatter {skill.relative_to(root)}")
        ok = False
raise SystemExit(0 if ok else 1)

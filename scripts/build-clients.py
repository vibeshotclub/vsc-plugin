#!/usr/bin/env python3
"""Build importable skill ZIPs and client configs from the shared VSC source."""
import argparse
import shutil
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
SKILLS = (
    "vsc-creative-director", "vsc-lexicon", "vsc-sref",
    "vsc-motion", "vsc-prompt-gallery",
)


def build(output):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    for client, filename in (("hermes", "config.yaml"), ("workbuddy", "mcp.json")):
        shutil.copyfile(ROOT / "adapters" / client / filename, output / f"{client}-{filename}")
    for name in SKILLS:
        source = ROOT / "plugins" / "vsc" / "skills" / name
        if not (source / "SKILL.md").is_file():
            raise ValueError(f"Missing skill: {name}")
        with ZipFile(output / f"{name}.zip", "w", ZIP_DEFLATED) as archive:
            for path in sorted(source.rglob("*")):
                if path.is_file() and not any(part.startswith(".") for part in path.relative_to(source).parts):
                    archive.write(path, Path(name) / path.relative_to(source))
    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist" / "clients")
    args = parser.parse_args()
    print(build(args.output))

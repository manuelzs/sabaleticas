"""Catch identifiers that are called but never declared in dashboard/src/*.js.

The page is one concatenated script with no bundler and no type checker, so a
function deleted by a careless block-replace fails only at runtime — and, because
navigation calls it, it broke the router in a way that looked like three separate
bugs. This is the cheap guard against exactly that.

Run standalone, or let `sabaleticas map` call it on every build.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "dashboard" / "src"

# Globals we use that we do not declare ourselves.
KNOWN = {
    "Math", "JSON", "Object", "Array", "String", "Number", "Boolean", "Date", "Set", "Map",
    "Promise", "Image", "MouseEvent", "Float32Array", "Uint32Array", "Uint8Array",
    "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent", "decodeURIComponent",
    "setTimeout", "clearTimeout", "setInterval", "clearInterval", "requestAnimationFrame",
    "addEventListener", "removeEventListener", "dispatchEvent",
    "console", "document", "window", "localStorage", "history", "location", "navigator",
    "alert", "fetch", "structuredClone", "getComputedStyle", "Blob", "URL", "prompt",
    "confirm", "FileReader", "TextDecoder", "TextEncoder", "WebGLRenderingContext",
    "if", "for", "while", "switch", "catch", "return", "typeof", "function", "new", "do",
    "else", "try", "throw", "delete", "void", "in", "of", "await", "yield", "case",
}
def _strip_literals(src):
    """Blank out string and template-literal *text*, keeping ${...} interpolations.

    A regex cannot do this: template literals nest, and the ones here hold GLSL,
    HTML and CSS. So walk it once with a tiny scanner.
    """
    out, i, n = [], 0, len(src)
    stack = []                      # '`' while inside a template literal's text
    while i < n:
        c = src[i]
        if stack and stack[-1] == "`":
            if c == "\\":
                i += 2; out.append("  "); continue
            if c == "`":
                stack.pop(); out.append(" "); i += 1; continue
            if c == "$" and i + 1 < n and src[i + 1] == "{":
                stack.append("{"); out.append("  "); i += 2; continue
            out.append(" " if c != "\n" else "\n"); i += 1; continue
        if c in "'\"":
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == "\\" else 1
            out.append(" " * (j - i + 1)); i = j + 1; continue
        if c == "`":
            stack.append("`"); out.append(" "); i += 1; continue
        if c == "{" and stack:
            stack.append("{")
        elif c == "}" and stack and stack[-1] == "{":
            stack.pop()
            if stack and stack[-1] == "`":
                out.append(" "); i += 1; continue
        out.append(c); i += 1
    return "".join(out)


DECL = re.compile(r"\b(?:function\s+([A-Za-z_]\w*)|(?:const|let|var)\s+([A-Za-z_]\w*)\s*=)")
# a call that is NOT a method call (not preceded by a dot) and not a declaration
CALL = re.compile(r"(?<![.\w$])([A-Za-z_]\w*)\s*\(")
PARAM = re.compile(r"(?:function\s*\w*\s*\(([^)]*)\)|\(([^)]*)\)\s*=>|\b(\w+)\s*=>)")


def main(quiet=False):
    declared, called, params = set(), {}, set()
    for f in sorted(SRC.glob("*.js")):
        src = f.read_text(encoding="utf-8")
        src = re.sub(r"/\*.*?\*/", " ", src, flags=re.S)          # comments
        src = re.sub(r"//[^\n]*", " ", src)
        src = _strip_literals(src)
        for a, b in DECL.findall(src):
            declared.add(a or b)
        for a, b, c in PARAM.findall(src):
            for grp in (a, b, c):
                for p in grp.split(","):
                    p = p.strip().split("=")[0].strip()
                    if re.fullmatch(r"[A-Za-z_]\w*", p or ""):
                        params.add(p)
        for name in CALL.findall(src):
            called.setdefault(name, f.name)

    missing = {n: f for n, f in called.items()
               if n not in declared and n not in KNOWN and n not in params}
    if missing:
        print("  ⚠ called but never declared:")
        for n, f in sorted(missing.items()):
            print(f"      {n}()   first seen in {f}")
        return 1
    if not quiet:
        print(f"  js check: {len(declared)} declarations, {len(called)} call sites, none missing")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env bash
# Assemble what Vercel serves. NOT the repository — only the viewer and the two images
# it actually asks for.
#
# The viewer is one self-contained 3.4 MB file: every layer, reading and ticket is
# inlined at build time. The two exceptions are the orthophoto and the surroundings
# raster, which it loads as <img> from ../operations/land/geo/. So the tree here keeps
# that exact relative shape — viewer under dashboard/, images under operations/ — and a
# rewrite in vercel.json points / at it. Rewriting the paths instead would work too, and
# would be one more thing that can silently drift from what map.py emits.
set -euo pipefail

rm -rf public
mkdir -p public/dashboard public/operations/land/geo

python3 -m sabaleticas map --no-open

cp dashboard/viewer.html            public/dashboard/viewer.html
cp operations/land/geo/orthophoto.jpg   public/operations/land/geo/
cp operations/land/geo/surroundings.jpg public/operations/land/geo/

echo "public/ listo:"
du -sh public
find public -type f -exec ls -lh {} \; | awk '{print "   "$5"\t"$9}'

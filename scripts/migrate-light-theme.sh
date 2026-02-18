#!/bin/bash
# ============================================================================
# GapZero — Dark to Light Theme Migration Script
# Run from project root: bash scripts/migrate-light-theme.sh
# ============================================================================

echo "🎨 Migrating GapZero to light theme..."
echo ""

# Find all tsx/ts files in components/ and app/ (excluding node_modules)
FILES=$(find components/ app/ -name "*.tsx" -o -name "*.ts" | grep -v node_modules)

for f in $FILES; do
  sed -i \
    -e 's|bg-white/\[0\.03\]|bg-black/[0.02]|g' \
    -e 's|bg-white/\[0\.04\]|bg-black/[0.03]|g' \
    -e 's|bg-white/\[0\.05\]|bg-black/[0.03]|g' \
    -e 's|bg-white/\[0\.06\]|bg-black/[0.04]|g' \
    -e 's|bg-white/\[0\.08\]|bg-black/[0.05]|g' \
    -e 's|bg-white/\[0\.09\]|bg-black/[0.05]|g' \
    -e 's|bg-white/\[0\.10\]|bg-black/[0.06]|g' \
    -e 's|bg-white/\[0\.12\]|bg-black/[0.07]|g' \
    -e 's|border-white/\[0\.06\]|border-black/[0.06]|g' \
    -e 's|border-white/\[0\.08\]|border-black/[0.06]|g' \
    -e 's|border-white/\[0\.10\]|border-black/[0.08]|g' \
    -e 's|border-white/\[0\.12\]|border-black/[0.08]|g' \
    -e 's|border-white/\[0\.14\]|border-black/[0.10]|g' \
    -e 's|border-white/\[0\.16\]|border-black/[0.10]|g' \
    -e 's|border-white/\[0\.20\]|border-black/[0.12]|g' \
    -e 's|hover:bg-white/\[0\.04\]|hover:bg-black/[0.03]|g' \
    -e 's|hover:bg-white/\[0\.06\]|hover:bg-black/[0.04]|g' \
    -e 's|hover:bg-white/\[0\.08\]|hover:bg-black/[0.05]|g' \
    -e 's|hover:bg-white/\[0\.10\]|hover:bg-black/[0.06]|g' \
    -e 's|hover:border-white/\[0\.12\]|hover:border-black/[0.08]|g' \
    -e 's|hover:border-white/\[0\.16\]|hover:border-black/[0.10]|g' \
    -e 's|hover:border-white/\[0\.20\]|hover:border-black/[0.12]|g' \
    -e 's|shadow-black/50|shadow-black/[0.06]|g' \
    -e 's|shadow-black/40|shadow-black/[0.05]|g' \
    -e 's|shadow-black/30|shadow-black/[0.04]|g' \
    -e 's|shadow-black/20|shadow-black/[0.04]|g' \
    -e 's|shadow-black/10|shadow-black/[0.03]|g' \
    -e 's|shadow-black/05|shadow-black/[0.03]|g' \
    -e 's|bg-background/60|bg-white/80|g' \
    -e 's|bg-background/80|bg-white/85|g' \
    -e 's|bg-background/90|bg-white/90|g' \
    -e 's|bg-surface/95|bg-white/95|g' \
    -e 's|rgba(245, 158, 11|rgba(232, 137, 10|g' \
    -e 's|rgba(251, 146, 60|rgba(234, 126, 46|g' \
    -e 's|rgba(26, 23, 20|rgba(255, 255, 255|g' \
    -e 's|rgba(255,245,230|rgba(0, 0, 0|g' \
    -e 's|#F59E0B|#E8890A|g' \
    -e 's|#FB923C|#EA7E2E|g' \
    -e 's|#0A0A0B|#FFFBF5|g' \
    -e 's|#141416|#FFFFFF|g' \
    -e 's|#111113|#1C1410|g' \
    -e 's|#161618|#2A2118|g' \
    "$f"
done

echo "✓ Background/border/shadow patterns replaced"

# Phase 2: text-white → text-text-primary (in heading/label contexts, NOT button text)
for f in $FILES; do
  sed -i \
    -e 's|font-bold tracking-tight text-white|font-bold tracking-tight text-text-primary|g' \
    -e 's|font-bold text-white|font-bold text-text-primary|g' \
    -e 's|font-semibold text-white|font-semibold text-text-primary|g' \
    -e 's|font-medium text-white|font-medium text-text-primary|g' \
    -e 's|text-lg font-semibold text-white|text-lg font-semibold text-text-primary|g' \
    -e 's|text-white mb-|text-text-primary mb-|g' \
    -e 's|text-white truncate|text-text-primary truncate|g' \
    -e 's|"text-white">|"text-text-primary">|g' \
    "$f"
done

echo "✓ text-white → text-text-primary in headings"

# Phase 3: Hero specific — the block text-white in Hero.tsx
if [ -f "components/landing/Hero.tsx" ]; then
  sed -i 's|block text-white|block text-text-primary|g' components/landing/Hero.tsx
  echo "✓ Hero.tsx patched"
fi

# Count remaining text-white (these are intentional: buttons, badges on colored bg)
REMAINING=$(grep -rn "text-white" components/ app/ --include="*.tsx" 2>/dev/null | wc -l)
echo ""
echo "✓ Migration complete!"
echo "  Remaining text-white: $REMAINING (these are intentional — button text on colored backgrounds)"
echo ""
echo "Next: run 'npm run build' to verify"

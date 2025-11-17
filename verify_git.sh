#!/bin/bash

echo "============================================"
echo "   VÉRIFICATION GIT - Application pfSense"
echo "============================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. État du repository${NC}"
git status
echo ""

echo -e "${BLUE}2. Derniers commits (10)${NC}"
git log --oneline --graph -10
echo ""

echo -e "${BLUE}3. Fichiers critiques présents dans Git${NC}"
echo -e "${YELLOW}Backend:${NC}"
git ls-files | grep -E "backend/(server\.py|requirements\.txt)" || echo "❌ Fichiers backend manquants!"
echo ""

echo -e "${YELLOW}Frontend - Fichiers principaux:${NC}"
git ls-files | grep -E "frontend/src/(App\.js|index\.js|index\.css)" || echo "❌ Fichiers frontend principaux manquants!"
echo ""

echo -e "${YELLOW}Frontend - Nouveaux fichiers:${NC}"
git ls-files | grep -E "frontend/src/(constants\.js|utils/sortUtils\.js)" || echo "❌ Nouveaux fichiers frontend manquants!"
echo ""

echo -e "${YELLOW}Documentation:${NC}"
git ls-files | grep -E "(REFACTORING|CHANGELOG|README)" || echo "❌ Documentation manquante!"
echo ""

echo -e "${BLUE}4. Vérification du contenu des fichiers clés${NC}"
echo -e "${YELLOW}a) Vérification export xlsx dans server.py:${NC}"
if git show HEAD:backend/server.py | grep -q "openpyxl"; then
    echo -e "${GREEN}✅ Export xlsx présent${NC}"
else
    echo "❌ Export xlsx manquant!"
fi

echo -e "${YELLOW}b) Vérification tri dans App.js:${NC}"
if git show HEAD:frontend/src/App.js | grep -q "sortArray"; then
    echo -e "${GREEN}✅ Fonction de tri présente${NC}"
else
    echo "❌ Fonction de tri manquante!"
fi

echo -e "${YELLOW}c) Vérification max-w-full dans App.js:${NC}"
if git show HEAD:frontend/src/App.js | grep -q "max-w-full"; then
    echo -e "${GREEN}✅ Correction scroll présente${NC}"
else
    echo "❌ Correction scroll manquante!"
fi

echo -e "${YELLOW}d) Vérification constants.js:${NC}"
if git ls-files | grep -q "frontend/src/constants.js"; then
    echo -e "${GREEN}✅ constants.js présent${NC}"
else
    echo "❌ constants.js manquant!"
fi

echo -e "${YELLOW}e) Vérification sortUtils.js:${NC}"
if git ls-files | grep -q "frontend/src/utils/sortUtils.js"; then
    echo -e "${GREEN}✅ sortUtils.js présent${NC}"
else
    echo "❌ sortUtils.js manquant!"
fi

echo ""
echo -e "${BLUE}5. Statistiques des modifications${NC}"
echo "Total de fichiers trackés:"
git ls-files | wc -l
echo ""
echo "Fichiers modifiés dans les 3 dernières heures:"
git log --since="3 hours ago" --name-only --pretty=format:"" | sort -u | grep -v "^$" | wc -l

echo ""
echo -e "${BLUE}6. Fichiers modifiés récemment (détail)${NC}"
git log --since="3 hours ago" --name-only --pretty=format:"%h %s" | head -40

echo ""
echo "============================================"
echo -e "${GREEN}   Vérification terminée!${NC}"
echo "============================================"

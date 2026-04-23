
# Claude vs TradingView

**Claude vs TradingView** connecte Claude à TradingView Desktop via le Chrome DevTools Protocol. Il vous donne un brief de trading structuré chaque matin, et laisse Claude piloter vos graphiques directement.

---

## Nouveautés

| Fonctionnalité | Ce qu'elle fait |
|---|---|
| `morning_brief` | Une seule commande qui analyse votre watchlist, lit tous vos indicateurs, et retourne des données structurées pour que Claude génère votre biais de session |
| `session_save` / `session_get` | Sauvegarde votre brief quotidien dans `~/.claudeverstradingview/sessions/` pour comparer aujourd'hui vs hier |
| `rules.json` | Écrivez vos règles de trading une seule fois (critères de biais, règles de risque, watchlist). Le brief matinal les applique automatiquement chaque jour |
| Correction du bug de lancement | Compatibilité avec TradingView Desktop v2.14+ |
| CLI `claudeverstradingview brief` | Lancez votre brief matinal depuis le terminal en un mot |

---

## Installation en une étape

Collez ceci dans Claude Code, il s'occupe de tout :

```
Configure Claude vs TradingView pour moi.
Clone le repo dans ~/claudeverstradingview, lance npm install, puis ajoute-le à ma config MCP dans ~/.claude/.mcp.json (fusionne avec les serveurs existants, ne les écrase pas).
Le bloc de config est : { "mcpServers": { "claudeverstradingview": { "command": "node", "args": ["/Users/VOTRE_USERNAME/claudeverstradingview/src/server.js"] } } } — remplace VOTRE_USERNAME par mon nom d'utilisateur réel.
Ensuite copie rules.example.json vers rules.json et ouvre-le.
Enfin redémarre et vérifie avec tv_health_check.
```

Ou suivez les étapes manuelles ci-dessous.

---

## Prérequis

- Application desktop TradingView (abonnement payant requis pour les données en temps réel)
- Node.js 18+
- Claude Code (pour les outils MCP) ou n'importe quel terminal (pour la CLI)
- macOS, Windows ou Linux

---

## Démarrage rapide

### 1. Cloner et installer

```bash
git clone https://github.com/kaspertrading/claudeverstradingview.git ~/claudeverstradingview
cd ~/claudeverstradingview
npm install
```

### 2. Configurer vos règles

```bash
cp rules.example.json rules.json
```

Ouvrez `rules.json` et renseignez votre watchlist, vos critères de biais et vos règles de risque.

### 3. Lancer TradingView avec CDP

**Mac :**
```bash
./scripts/launch_tv_debug_mac.sh
```

**Windows :**
```bat
scripts\launch_tv_debug.bat
```

**Linux :**
```bash
./scripts/launch_tv_debug_linux.sh
```

### 4. Ajouter à Claude Code

Ajoutez dans `~/.claude/.mcp.json` :

```json
{
  "mcpServers": {
    "claudeverstradingview": {
      "command": "node",
      "args": ["/Users/VOTRE_USERNAME/claudeverstradingview/src/server.js"]
    }
  }
}
```

### 5. Vérifier

Redémarrez Claude Code, puis : `"Use tv_health_check to verify TradingView is connected"`

### 6. Premier brief matinal

```bash
npm link
claudeverstradingview brief
```

---

## Workflow du Brief Matinal

Avant chaque session :

1. TradingView est ouvert (lancé avec le port de debug)
2. `claudeverstradingview brief` dans le terminal
3. Claude analyse votre watchlist et affiche :

```
XAUUSD  | BIAIS: Baissier  | NIVEAU CLE: 3 280  | SURVEILLER: Résistance Order Block 4H
XAGUSD  | BIAIS: Neutre    | NIVEAU CLE: 32,50  | SURVEILLER: Structure en ranging
BTCUSD  | BIAIS: Haussier  | NIVEAU CLE: 83 000 | SURVEILLER: Tenir au-dessus du OB daily

Global : Prudence sur les métaux. BTC le plus solide des trois.
```

4. Sauvegardez : `"save this brief"` (session_save)
5. Le lendemain, comparez : `"get yesterday's session"` (session_get)

---

## Référence des outils (81 outils MCP)

### Brief Matinal

| Outil | Ce qu'il fait |
|---|---|
| `morning_brief` | Scanne la watchlist, lit les indicateurs, retourne les données de biais. Lit `rules.json` automatiquement. |
| `session_save` | Sauvegarde le brief dans `~/.claudeverstradingview/sessions/YYYY-MM-DD.json` |
| `session_get` | Récupère le brief du jour (ou d'hier si aujourd'hui non sauvegardé) |

### Lecture de graphiques

| Outil | Quand l'utiliser | Taille de sortie |
|---|---|---|
| `chart_get_state` | Premier appel : symbole, timeframe, noms et IDs des indicateurs | ~500B |
| `data_get_study_values` | Valeurs actuelles RSI, MACD, BB, EMA | ~500B |
| `quote_get` | Dernier prix, OHLC, volume | ~200B |
| `data_get_ohlcv` | Bougies. `summary: true` pour stats compactes | 500B / 8KB |

### Contrôle du graphique

| Outil | Ce qu'il fait |
|---|---|
| `chart_set_symbol` | Changer le ticker |
| `chart_set_timeframe` | Changer la résolution (1, 5, 15, 60, D, W, M) |
| `chart_set_type` | Changer le style (Candles, HeikinAshi, Line...) |
| `chart_manage_indicator` | Ajouter/supprimer des indicateurs |
| `chart_scroll_to_date` | Aller à une date (ISO : "2025-01-15") |

### Pine Script

| Outil | Étape |
|---|---|
| `pine_set_source` | 1. Injecter le code |
| `pine_smart_compile` | 2. Compiler |
| `pine_get_errors` | 3. Lire les erreurs |
| `pine_get_console` | 4. Lire les logs |
| `pine_save` | 5. Sauvegarder dans le cloud |

### Replay

| Outil | Étape |
|---|---|
| `replay_start` | Entrer en replay à une date |
| `replay_step` | Avancer d'une bougie |
| `replay_autoplay` | Avance automatique |
| `replay_trade` | Acheter/vendre/clore |
| `replay_status` | Position, P&L, date |
| `replay_stop` | Revenir au temps réel |

### Autres

| Outil | Ce qu'il fait |
|---|---|
| `pane_set_layout` | Grille : s, 2h, 2v, 2x2, 4, 6, 8 |
| `draw_shape` | Lignes, rectangles, texte |
| `alert_create` / `alert_list` / `alert_delete` | Gérer les alertes |
| `capture_screenshot` | Capture (full, chart, strategy_tester) |
| `tv_launch` / `tv_health_check` | Lancer TradingView / vérifier la connexion |

---

## CLI

```bash
claudeverstradingview brief                        # brief matinal
claudeverstradingview session get                  # brief du jour sauvegardé
claudeverstradingview status                       # vérifier la connexion
claudeverstradingview quote                        # prix actuel
claudeverstradingview symbol BTCUSD                # changer de symbole
claudeverstradingview screenshot -r chart          # capturer le graphique
claudeverstradingview pane layout 2x2              # grille 4 graphiques
```

Aide complète : `claudeverstradingview --help`

---

## Dépannage

| Problème | Solution |
|---|---|
| `cdp_connected: false` | TradingView n'est pas lancé avec `--remote-debugging-port=9222`. Utilisez le script de lancement. |
| `ECONNREFUSED` | TradingView non lancé ou port 9222 bloqué |
| Serveur MCP absent de Claude Code | Vérifiez la syntaxe de `~/.claude/.mcp.json`, redémarrez Claude Code |
| Commande introuvable | Lancez `npm link` depuis le répertoire du projet |
| "No rules.json found" | `cp rules.example.json rules.json` puis remplissez-le |
| Données obsolètes | TradingView charge encore, attendez quelques secondes |

---

## Architecture

```
Claude Code  <->  Serveur MCP (stdio)  <->  CDP (port 9222)  <->  TradingView Desktop (Electron)
```

- 81 outils MCP au total
- Connexion via Chrome DevTools Protocol sur localhost:9222
- Aucun appel réseau externe, tout tourne en local

---

## Avertissement

Ce projet est fourni à des fins personnelles, éducatives et de recherche uniquement. Utilisation à vos propres risques.

# Spel av geapanenbanan

Webbsidan **games.geapanenbanan.com** – här kan man ladda ner och testa mina spel på mobilen.

Repot innehåller bara webbsidan och spelens nedladdningsfiler (under **Releases**). Källkoden till spelen ligger i separata, privata repon.

## Hittat en bugg?

[Skapa en buggrapport](https://github.com/geapanenbanan/games/issues/new). Skriv vilket spel och vilken version, vad du gjorde, vad som hände och vilken telefon du har.

## Så fungerar sidan

Allt ligger i `site/` och publiceras automatiskt med Cloudflare Pages när något pushas till `main`.

| Fil | Vad den gör |
|---|---|
| `site/games.json` | Listan över spel. Det enda som behöver ändras för att lägga till ett spel eller en version. |
| `site/index.html` | Startsidan med alla spel |
| `site/game.html` | Sidan för ett spel, visas på `/spel/<id>` |
| `site/app.js`, `site/styles.css` | Logik och utseende |
| `site/_redirects`, `site/_headers` | Inställningar för Cloudflare Pages |

### Lägga till ett spel

Lägg till ett nytt objekt i `site/games.json`:

```json
{
  "id": "mitt-spel",
  "title": "Mitt spel",
  "color": "#2A6F97",
  "tagline": "En mening om spelet.",
  "description": ["Första stycket.", "Andra stycket."],
  "status": "Tidig testversion",
  "platforms": ["Android"],
  "version": null,
  "download": null,
  "webPlay": null,
  "changes": ["Vad som finns i versionen"]
}
```

- `id` blir adressen: `/spel/mitt-spel`
- `color` är spelets färg (hex, sex tecken)
- `download` och `webPlay` är `null` tills det finns något att ladda ner eller spela; då visas "Testversionen kommer snart"

### Lägga upp en ny version

1. Skapa en release på GitHub med taggen `<id>-v<version>`, till exempel `crimson-apex-v0.1.0`, och bifoga APK-filen, t.ex. `CrimsonApex-0.1.0.apk`.
2. Uppdatera spelet i `site/games.json`: `version`, `download` (länken till APK-filen i releasen) och `changes`.
3. Pusha. Sidan uppdateras inom någon minut.

Länken till filen ser ut så här:
`https://github.com/geapanenbanan/games/releases/download/crimson-apex-v0.1.0/CrimsonApex-0.1.0.apk`

**Lägg aldrig signeringsnycklar, lösenord eller källkod i det här repot – allt här är publikt.**

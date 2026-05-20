# Transfer Split — Marin Rubić

Statična web stranica za taxi/transfer biznis. Brutalistički dizajn, optimizirana za SEO i Core Web Vitals, troj jezika (HR/EN/DE).

## Struktura

```
transfer-split/
├── index.html         # Glavna (hrvatska)
├── en.html            # English version
├── de.html            # Deutsch
├── robots.txt
├── sitemap.xml
├── .htaccess          # HTTPS, caching, kompresija (za Apache)
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/peugeot-308.jpg   <-- TREBA STAVITI SLIKU OVDJE
```

## Što zamijeniti prije pokretanja

Otvori sve `.html` datoteke i zamijeni:

| Placeholder | Stvarna vrijednost |
|---|---|
| `+385 91 XXX XXXX` | Marinov pravi broj |
| `385911234567` (u tel/wa linkovima) | Marinov broj bez `+` |
| `info@transfer-split.com` | Pravi email |
| `XXXXXXXXXXX` (OIB) | Marinov OIB |
| `https://transfer-split.com/` | Stvarna domena ako se promijeni |

Tipovi placeholdera (koristi Find & Replace u editoru):
- `+385 91 XXX XXXX` → broj za display
- `tel:+385911234567` → broj za klik-poziv
- `wa.me/385911234567` → broj za WhatsApp
- `viber://chat?number=%2B385911234567` → broj za Viber

## Slika auta

Sliku Peugeota spremi kao:
```
assets/img/peugeot-308.jpg
```

Preporuka: optimiziraj na max 1200×1600px, kvaliteta 80%, ispod 200KB. Za bolje rezultate i WebP verziju (`peugeot-308.webp`).

## Domena — preporuke

Po važnosti za SEO za ključnu riječ "transfer split":

1. **transfer-split.com** (preporučeno — kratko, brand-friendly)
2. **transfer-split.hr** (.hr daje boost za lokalne pretrage)
3. **split-transfer.com**
4. **splittransfer.com**

Preporučam kupiti i `.hr` i `.com` te jedan redirektati na drugi.

## Hosting

Statična stranica, radi na svemu. Najjednostavnije:

- **Hostinger / Bluehost** — Apache, `.htaccess` već uključen, samo upload preko FTP-a.
- **Netlify / Vercel** — drag & drop deploy, besplatno za male prometne.
- **GitHub Pages** — besplatno ako ide kao open source.

## SEO postupak nakon deploya

1. **Google Search Console** — verify domain (DNS TXT), pošalji `sitemap.xml`.
2. **Bing Webmaster Tools** — isto verify + sitemap.
3. **Google Business Profile** — vrlo bitno za lokalni SEO ("transfer split aerodrom"). Kategorija: *Taxi Service*. Postavi sat rada 24/7, dodaj fotke, traži recenzije.
4. **Backlinkovi**:
   - TripAdvisor profil
   - Booking.com partner (kao transfer provider)
   - GetYourGuide / Viator (turistički transferi)
   - Croatia.hr direktorij
   - Lokalni Split direktoriji (split.com.hr, dalmacijadanas.hr business sekcije)
5. **Google Maps** — embedaj svoju Google Business lokaciju u kontakt sekciju (umjesto OpenStreetMap embeda) kad bude verificirana.

## Ciljane fraze (HR)

- transfer split (primarno)
- taxi split aerodrom
- transfer aerodrom split
- privatni transfer split
- transfer split dubrovnik / makarska / trogir / hvar
- taxi split cijenik

## Forma za rezervacije

Forma trenutno koristi **FormSubmit.co** (besplatna usluga). Pri prvom slanju forme Marin će dobiti email s linkom za potvrdu — mora kliknuti da se aktivira.

Alternative kad bude više rezervacija:
- **Web3Forms** (free)
- **Formspree** ($10/mj)
- Vlastiti backend / n8n webhook

## Performance

- Fontovi se učitavaju s `&display=swap` (nema FOIT)
- Slika auta ima `fetchpriority="high"` na hero, `loading="lazy"` na ostalom
- CSS i JS ne blokiraju rendering (defer)
- SVG favicon inline (0 dodatnih HTTP requestova)

## Sljedeći koraci (kad bude vremena)

- [ ] Pravi blog (`/blog/`) — članci tipa "Što vidjeti u Splitu u 24 sata" — generira organski promet
- [ ] Google reviews widget kad bude par recenzija
- [ ] PWA manifest + service worker za offline support
- [ ] Pretvori sliku u WebP + AVIF s `<picture>` tagom
- [ ] Integracija s Stripe za online plaćanje (ako želi)

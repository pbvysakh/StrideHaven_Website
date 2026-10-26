# Stride Haven — Image Asset Manifest

Every photo position on the site, in one place. This is the single source of truth for
"what image goes where" — to swap any photo, just replace the file at the listed path
(for Local entries) or update the URL in `build_site.py` (for Hotlink entries), then
re-run `python3 build_site.py`.

Two kinds of image source:
- **Local** — a file that lives in `assets/img/photos/`, shipped inside this site folder.
  100% reliable, no dependency on the outside internet.
- **Hotlink** — pulled live from the manufacturer's own site or DirectIndustry's product
  catalog. If a hotlink ever breaks, a small script automatically swaps it back to a plain
  icon (never a broken-image box) — see `partner_chip()` / `client_chip()` /
  `product_card()` in `build_site.py`.

As of this update, the site is almost entirely on local, real photography — the client's
own product/equipment library plus a curated set of licensed stock photos (chosen to read
as authentic industrial photography, not staged/AI-style stock). Only **Temperature
Measurement** is still on a manufacturer hotlink; every other card is local.

## Home page (index.html)

| Position | Source | File / URL |
|---|---|---|
| Hero background | Local | `assets/img/photos/home-hero-plant-night.jpg` |
| Our Clients section | Hotlink | 21 client logos, reused from stride-haven.com (see `CLIENT_LOGOS`) |
| Six solution-category nav tiles | Local | see `pressure`, `analyzer`, `scada_scene`, `iot_gateway`, `engineering_desk`, `panel_build` below |

## About page (about.html)

| Position | Source | File / URL |
|---|---|---|
| Hero background | Local | `assets/img/photos/about-hero-plant-moonlit.jpg` |
| Our Values section background | Local | `assets/img/photos/values-background.jpg` |

## Instrumentation Solutions (instrumentation-solutions.html)

| Position | Source | File / URL |
|---|---|---|
| Pressure Measurement card | Local (stock) | `assets/img/photos/pressure-measurement-panel.jpg` |
| Temperature Measurement card | Hotlink | WIKA T91.1 (DirectIndustry) — only remaining hotlink on the site |
| Flow Measurement card | Local (client photo) | `assets/img/photos/flow-metering-skid.jpg` |
| Level Measurement card | Local (client photo) | `assets/img/photos/level-measurement-gauge.jpg` |

## Analytical Solutions (analytical-solutions.html)

| Position | Source | File / URL |
|---|---|---|
| pH & ORP Analyzers card | Hotlink (HORIBA HP-480) | `https://static.horiba.com/fileadmin/Horiba/_processed_/8/1/csm_HP-480_01_c5ace23237.png` |
| Conductivity Analyzers card | Hotlink (HORIBA HE-480C) | `https://static.horiba.com/fileadmin/Horiba/_processed_/a/5/csm_HE-480C_01_b3a9ae585a.png` |
| Turbidity Analyzers card | Hotlink (HORIBA HU-200TB-W) | `https://static.horiba.com/fileadmin/Horiba/_processed_/6/0/csm_HU-200TB-W_product_bd2796f2af.png` |
| Chlorine Analyzers card | Hotlink (HORIBA HR-480) | `https://static.horiba.com/fileadmin/Horiba/_processed_/c/7/csm_HR-480_01_2018ea7344.png` |
| TOC Analyzers card | Hotlink (HORIBA HT-110) | `https://static.horiba.com/fileadmin/Horiba/_processed_/a/4/csm_HT-110_01_429ac106ac.png` |
| UV254 Analyzers card | Hotlink (HORIBA UV500) | `https://static.horiba.com/fileadmin/Horiba/_processed_/f/5/csm_UV500_f743238e3c.png` |
| Online Process Analyzers card | Local (stock) | `assets/img/photos/analytical-lab-work.jpg` |
| Water Quality Monitoring card | Hotlink (HORIBA GX-100) | `https://static.horiba.com/fileadmin/Horiba/_processed_/e/1/csm_GX-100_b6c571dafb.jpg` |
| Sample Conditioning card | Local (client photo) | `assets/img/photos/sample-conditioning-system.jpg` |
| Calibration & Verification card | Local (client photo) | `assets/img/photos/calibration-column.jpg` |

No SDI-specific product photo was added — HORIBA does not sell a dedicated SDI (Silt Density Index) analyzer, so that line stays text-only in the parameter list, same as before. The six new parameter-type cards and the Water Quality Monitoring card are hotlinked straight from horiba.com product pages (Stride Haven distributes HORIBA per Technology Partners), following the same hotlink-with-icon-fallback pattern already used for the WIKA T91.1 temperature card and all Technology Partners logos — if a HORIBA URL ever changes, that card's `onerror` swaps to a plain icon rather than a broken image. Captions were kept generic (parameter/function only, no brand name called out on the card) per the client's preference.

## Automation Solutions (automation-solutions.html)

| Position | Source | File / URL |
|---|---|---|
| PLC Systems card | Local (stock) | `assets/img/photos/plc-electronics-work.jpg` |
| SCADA Systems card | Local (stock) | `assets/img/photos/scada-control-room.jpg` |
| HMI Systems card | Local (stock) | `assets/img/photos/hmi-control-panel.jpg` |
| DCS Integration card | Local (stock) | `assets/img/photos/dcs-control-cabinet.jpg` |

## IIoT & Digital Solutions (iiot-solutions.html)

| Position | Source | File / URL |
|---|---|---|
| Hero background | Local | `assets/img/photos/iot-future-tech.jpg` |
| IoT Gateways card | Local (client photo) | `assets/img/photos/iot-gateway-device.jpg` |
| Cloud Connectivity card | Local (client photo) | `assets/img/photos/iot-cloud-connectivity.jpg` |
| Remote Monitoring card | Local (client photo) | `assets/img/photos/iot-remote-monitoring.jpg` |
| Data Analytics card | Local (client photo) | `assets/img/photos/iot-data-analytics.jpg` |

## Engineering Services (engineering-services.html)

| Position | Source | File / URL |
|---|---|---|
| Hero background | Local | `assets/img/photos/engineering-desk.jpg` |

## Manufacturing Solutions (manufacturing-solutions.html)

| Position | Source | File / URL |
|---|---|---|
| Level Chambers card | Local (client photo) | `assets/img/photos/level-chamber-external.jpg` |
| Sampling Systems card | Local (client photo) | `assets/img/photos/sampling-skid.jpg` |
| Analyzer Panels card | Local (client photo) | `assets/img/photos/analyzer-panel-fabrication.jpg` |
| Instrument Panels card | Local (stock) | `assets/img/photos/instrument-panel-cabinet.jpg` |

## Industries We Serve (industries.html)

| Position | Source | File / URL |
|---|---|---|
| Water Treatment card | Local (client photo) | `assets/img/photos/industry-water-treatment.jpg` |
| Wastewater Treatment card | Local (client photo) | `assets/img/photos/industry-wastewater.jpg` |
| Desalination card | Local (stock, upgraded) | `assets/img/photos/industry-desalination.jpg` |
| Oil & Gas card | Local (client photo) | `assets/img/photos/industry-oil-gas.jpg` |
| Petrochemical card | Local (client photo) | `assets/img/photos/industry-petrochemical.jpg` |
| Power Plants card | Local (client photo) | `assets/img/photos/industry-power-plant.jpg` |
| Food & Beverage card | Local (client photo) | `assets/img/photos/industry-food-beverage.jpg` |
| Utilities card | Local (client photo) | `assets/img/photos/industry-utilities.jpg` |

Desalination and Wastewater Treatment were upgraded from their earlier images to two
striking aerial water-treatment-plant photos pulled from the same photo batch the client
supplied — the previous Desalination photo (a wave hitting a turbine) read as generic
"renewable energy" rather than desalination specifically.

## Technology Partners (technology-partners.html)

All 18 mapped partner logos are hotlinked from the partner's own site or Wikimedia
Commons — see the `PARTNER_LOGOS` dict at the top of `build_site.py`. "Anatek" has no
confirmed logo yet and stays as a text chip until a source link is supplied.

## Our Clients (index.html)

21 client logos (ADNOC, ADCO, ABB, CPECC, DEWA, EMAAR, ENI, ExxonMobil, Exterran, KNPC,
KOC, Petrofac, SABIC, Samsung, Saudi Aramco, Schlumberger, SEAWA, Shell, SUEZ, Technip,
Worley), hotlinked from the client's own existing site (stride-haven.com) — see
`CLIENT_LOGOS`. ADCO's logo will render as a plain text chip since it's no longer a
distinct branded entity; still pending a decision on whether to drop it or relabel it
"ADNOC Onshore."

## Where this lives in code

Everything above is generated from five Python dicts near the top of `build_site.py`:

- `IMG` — the five original wide background photos used across `solutions.html`.
- `PARTNER_LOGOS` — one entry per technology partner logo.
- `CLIENT_LOGOS` — one entry per client logo shown in the Our Clients section.
- `PRODUCT_PHOTOS` — one entry per product/industry card photo (this is the dict that
  drives most of the tables above). Each key optionally has a matching `<key>_brand`
  caption — only kept where the photo shows a specific, correctly-attributed product;
  removed where the photo is now a generic/authentic work scene rather than a named
  manufacturer's catalog shot.
- `LOCAL_IMG` — the subset of the above that are local files, listed again for quick
  reference.

To swap a photo: change the value in `PRODUCT_PHOTOS` (or drop a new file into
`assets/img/photos/` and point the key at it), then run `python3 build_site.py` to
regenerate every HTML page.

## Source material reviewed but not used

The client also shared a larger photo batch (~90 licensed stock photos, mostly
Pexels/Pixabay, plus 5 `.rar` archives). Every photo was reviewed; the ones used above were
the strongest, most authentic matches for a real gap on the site. Images left unused were
either off-topic for Stride Haven's actual industries (pharma, cement, medical, automotive,
stock-market charts), duplicates of a photo already placed, or read as staged/illustrative
rather than candid (glowing-gear "engineering" graphics, world-map-overlay compositions —
the same style the client had already flagged as feeling AI-generated). The `.rar` archives
were not opened; if they contain additional photos worth reviewing, they'd need to be
extracted first.

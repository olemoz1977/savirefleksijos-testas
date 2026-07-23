# Veidrodis — savirefleksijos įrankis
 [🚀 Pradėti testą](https://olemoz1977.github.io/savirefleksijos-testas)
Trumpas (3–5 min.) savistabos įrankis žmonėms, kurie daro įtaką kitiems: *"Ar mano elgesio įpročiai kartais stabdo mano augimą?"*

Tai **nėra** psichologinis testas, diagnozė, GLA360 alternatyva ar kompetencijų vertinimas. Rezultatas — refleksija, ne nuosprendis.

## Struktūra

```
index.html   — puslapio karkasas (visi ekranai)
styles.css   — dizaino tokenai, išdėstymas, spausdinimo (PDF) stiliai
data.js      — 20 teiginių, 6 kategorijos, LT/EN tekstai, balų logika
app.js       — būsenos valdymas, atsakymų skaičiavimas, sesijos išsaugojimas
```

Jokių priklausomybių ar build žingsnio — grynas HTML/CSS/JS.

## Diegimas per GitHub Pages


## Privatumas / duomenys

- Jokia asmeninė informacija nerenkama, nėra registracijos, nėra serverio.
- Atsakymai saugomi tik naudotojo naršyklėje (`localStorage`), kad progresas išliktų nutrūkus sesijai. Automatiškai išnyksta po 30 neaktyvumo dienų arba paspaudus "Pradėti iš naujo".
- PDF eksportas veikia per naršyklės spausdinimo dialogą (`window.print()`) — be jokių išorinių bibliotekų ar siuntimo į serverį.

## Turinio logika (trumpai)

- 20 teiginių, 6 kategorijos, skalė 1–5.
- 7/20 (35%) teiginių invertuoti — balas perskaičiuojamas kaip `6 − rawScore`.
- Kategorijos rezultatas = teiginių (po inversijos) vidurkis.
- Trys refleksijos zonos (1.0–2.4 / 2.5–3.7 / 3.8–5.0), formuluojamos kaip pastebėjimas, ne diagnozė.
- Rodomos 2–3 aukščiausio balo kategorijos su vienu atviru refleksijos klausimu kiekvienai — jokių etikečių ar "problemų".

Pilna turinio specifikacija (kategorijų logika, teiginių pagrindimas, ekspertizės pataisos) — atskirame projekto dokumente.

## Redagavimas

Visas turinys (teiginiai, kategorijos, sąsajos tekstai LT/EN) yra `data.js` faile — pakeitus tekstą ten, jis automatiškai atsispindi abiejose kalbose be jokių kitų failų pakeitimų.

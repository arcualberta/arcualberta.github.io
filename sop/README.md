# Interface mockup

Responsive HTML mockup for Indigenous Stories of Philosophy. This folder is the mockup’s home: `C:\Projects\arcualberta.github.io\sop`. Open it through a local server so the map tiles and fonts load. From `C:\Projects\arcualberta.github.io`:

```
python -m http.server 8765
```

Then visit `http://127.0.0.1:8765/sop/`.

The same pages serve desktop and mobile. Narrow the window, or use a phone-width viewport, to see the map with a bottom sheet of stories and the collapsed navigation.

## Pages

| File | Role |
| --- | --- |
| `index.html` | Home. The map fills the screen under a short header. |
| `stories.html` | The collection as a list. |
| `story.html` | One story. Add `?id=river` (or `hills`, `peaks`, `confluence`, `peace`, `oldman`, `lake`, `prairie`). |
| `about.html` | Project page, including how themes and future metadata are meant to work. |

## What this proposes

The home map uses OpenLayers and OpenStreetMap, the map library the site already loads. Markers are an SVG drawn for the project: a pale ring with a gold centre. That replaces the Google Maps pin (`maps.google.com/mapfiles/ms/micons/red.png` in the story template).

With five to ten stories, the mockup does not add an advanced filter. Theme chips highlight matching stories and leave the others visible on the map. The story page reserves Nation or community, language, and further categories. When that metadata is confirmed, those labels can replace the sample themes without a new search screen. A real filter is worth adding only if the collection grows well past this grant.

Sample pins are in Alberta so the atlas matches the cities already sketched on the map page and the university’s home. `appsettings.json` currently centres the live map near the Oaxaca coast (`16.50`, `-95.06`). Confirm the real extent before building this; recentring the mockup is a coordinate change in `js/data.js`.

Titles, themes, and passages are layout copy. They are not traditional stories and not research content.

## How it maps to the CMS

- Home is the existing map page. The floating panel replaces the unwired search form.
- The list is the standard archive.
- A story is the standard post. Place, setting, and themes extend the metadata region; the dashed fields are the ones still to be defined.
- About is a standard page.

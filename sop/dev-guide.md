# How to use this file

Open the CMS repo (`C:\Projects\CMS.StoriesOfPhilosophy`) and this mockup folder (`C:\Projects\arcualberta.github.io\sop`) in Cursor. Start an Agent chat and paste everything under **Prompt** below. The mockup HTML is the visual and interaction spec. The Razor app is what must change.

---

# Prompt

Update the Indigenous Stories of Philosophy site so the public pages match the mockup in `C:\Projects\arcualberta.github.io\sop/`. Implement the design in the existing Piranha CMS app. Do not replace the app with the static HTML.

## Read these first

- `C:\Projects\arcualberta.github.io\sop/index.html`, `C:\Projects\arcualberta.github.io\sop/stories.html`, `C:\Projects\arcualberta.github.io\sop/story.html`, `C:\Projects\arcualberta.github.io\sop/about.html`
- `C:\Projects\arcualberta.github.io\sop/css/styles.css` and `C:\Projects\arcualberta.github.io\sop/js/main.js`
- `C:\Projects\arcualberta.github.io\sop/README.md` for decisions that are easy to miss
- The current map, archive, and post views:
  - `CMS.StoriesOfPhilosophy/CMS.StoriesOfPhilosophy/Features/MapPage/MapPage.cshtml`
  - `CMS.StoriesOfPhilosophy/CMS.StoriesOfPhilosophy/Features/StandardArchive/Archive.cshtml`
  - `CMS.StoriesOfPhilosophy/CMS.StoriesOfPhilosophy/Features/StandardArchive/Post.cshtml`
  - `CMS.StoriesOfPhilosophy/CMS.StoriesOfPhilosophy/Features/Main/Shared/_Layout.cshtml`, `_Header.cshtml`, `_NavBar.cshtml`, `_Footer.cshtml`
  - `CMS.StoriesOfPhilosophy/CMS.StoriesOfPhilosophy/assets/itcss/`

`C:\Projects\arcualberta.github.io\sop/js/data.js` is sample content for the layout only. Do not import those titles, coordinates, themes, or paragraphs into the CMS.

## What this site already is

The app is a Piranha CMS site on the Arts Resource Centre vertical-slice template. `PiranhaComponents` 2.8.1 supplies the map block, archive controller, and metadata mapping. Keep that structure.

| Mockup | Existing feature |
| --- | --- |
| `index.html` | Map page, `Features/MapPage/` |
| `stories.html` | Standard archive, `Features/StandardArchive/Archive.cshtml` |
| `story.html` | Standard post, `Features/StandardArchive/Post.cshtml` |
| `about.html` | Standard page, `Features/StandardPage/` |

Public navigation in the mockup is Map, Stories, and About. Drive those links from the Piranha sitemap when the pages exist. Do not hardcode a parallel menu that drifts from the pages editors manage. Login can remain available to editors. It is not a primary public item.

The shared layout always wraps body content in `l-main__container` and always renders the footer. The map page needs the map to fill the viewport under the header, with no large footer. Make that exception without changing the document shape of the other pages.

## Do not bring the sample content across

The mockup’s eight stories, Alberta coordinates, and theme names (Land, Water, Kinship, Language, Responsibility) are stand-ins. Render the posts that are actually published. The interface must still look finished if only one story exists.

Do not invent traditional stories, nation or community names, or languages. Where a metadata value is empty, show the reserved treatment from the mockup (“To be confirmed”), not a guessed value.

`appsettings.json` centres `MapPage` near the Oaxaca coast (`16.500075`, `-95.0625452`). The view’s fallback centre is Edmonton, and the mockup is framed on Alberta. Do not silently recentre the live map onto the mockup. Fit the map to the coordinates of the published posts. Use the configured centre only when there are no points. If the configured centre and the posts clearly disagree, leave the fit-to-posts behaviour in place and note the disagreement. Do not overwrite production coordinates to match the mockup.

## Visual system

Match the mockup’s chrome, type, colour, and spacing. Tokens are the `:root` variables in `C:\Projects\arcualberta.github.io\sop/css/styles.css`.

- Serif: Fraunces. Sans: Source Sans 3.
- Forest, parchment, and gold as used there. The University of Alberta green `#275D38` and gold already exist as variables; keep the institutional marks, and use the mockup palette for the new UI.
- Wordmark: the mark and “Indigenous / Stories of Philosophy” lockup in the mockup header, with the tagline “Where philosophy begins with the land.”
- Keep the official University of Alberta wordmark from `wwwroot/assets/images/` (green on light surfaces, `ua-logo-reversed-white.svg` on the dark footer). Do not redraw it.
- Footer contact stays `artsrnd@ualberta.ca`, with the Arts Resource Centre credit.

Put new styles in the ITCSS partials under `assets/itcss/` and compile with the project’s existing Sass build (`build-sass.ps1` / `build-sass.js` in the csproj). Do not add `C:\Projects\arcualberta.github.io\sop/css/styles.css` as a second stylesheet. While editing `_Layout.cshtml`, remove the duplicated font, icon, and OpenLayers stylesheet tags instead of adding more.

The decorative SVG landscapes in the mockup stand in for photographs. On a story or card, use the post’s primary image or metadata image when one exists. If it does not, use a quiet forest field. Do not ship those sample illustrations as if they were the research images.

## Home map

Replace the search panel in `MapPage.cshtml`. That form is not wired to data: the city list is hardcoded and the “Has image” toggle does nothing. Remove it.

In its place, build the panel from `C:\Projects\arcualberta.github.io\sop/index.html`:

- Eyebrow, heading, and a short line that the map is the way into the collection.
- A key that explains the place mark.
- Theme chips, a count of stories, and a control that returns to the whole map.
- A scrollable list of the published stories. Each row shows a number, the title, and the place. The selected row reveals “View story”.
- A link to the archive.
- The University of Alberta wordmark at the foot of the panel.

The map stays the Piranha Components `MapBlock`, configured from `MapPage` in appsettings, rendered with `@Html.DisplayFor`. Keep OpenLayers and the current tile source. Do not switch the public map to Google Maps or Leaflet.

Behaviour, matching `C:\Projects\arcualberta.github.io\sop/js/main.js`:

- The map fills `calc(100dvh - header)`. Fit published points into the area that is not covered by the panel.
- Selecting a row or a marker pans to that point, marks it selected, and opens the popup. On a phone, expand the sheet and show “View story” on the row instead of a popup that the sheet would cover.
- At widths of 800px and below, the panel is a bottom sheet. It starts collapsed, showing the heading and a control to open the list. The whole heading row toggles the sheet, not only the small chevron.
- Escape or a click on empty map clears the selection.
- “Whole map” clears the selection and the theme and fits all points again.

`MarkerScalePercentage` is currently `10`, which renders an icon at 10 percent. A custom mark at that scale will be invisible. Set the scale so the disc is about the size drawn in the mockup.

## Markers and popup

The commented story script in `Post.cshtml` points at `https://maps.google.com/mapfiles/ms/micons/red.png`. The live marker may instead come from `MapBlock` inside the `PiranhaComponents` package. Find the actual icon the rendered map uses. Replace it with the project mark from `markerSrc()` in `C:\Projects\arcualberta.github.io\sop/js/main.js`:

- Default: white disc, forest ring `#1E3A2B`, gold centre `#A6843D`.
- Selected: forest fill, gold ring, gold centre.
- A story that does not match the active theme stays on the map at reduced opacity.

Do not use a teardrop pin, a Google icon, or a screenshot of one. Prefer whatever icon, style, or template hook `MapBlock` already exposes. Inspect the installed package before adding a second map library or forking the package. Delete or leave unused the commented Google-pin script so it cannot be turned back on by mistake.

Restyle the popup to match `.popup` in the mockup: image when the post has one, title, place, short text, and a “View story” link. The popup HTML is the `MapPage:Template` string (`{{title}}`, `{{content}}`, `{{imageUrl}}`, `{{detailsUrl}}`, and any other tokens `MapBlock` actually replaces). Inspect the component for the real token list. Do not invent tokens. Update the template in the view and in appsettings together.

## Themes, without an advanced filter

The collection is expected to stay at about five to ten stories. Do not build a search box, facet sidebar, city dropdown, or “has image” toggle. The chips are the browse UI.

On the map, a chip highlights matching stories and dims the others. On the archive, a chip hides non-matching cards and shows a count, with a plain empty state. “All” restores the full set.

The mockup theme names are not the research categories. Add an optional themes field on `MetadataRegion` so editors can enter the real labels when they have them. Map it through `MetadataMapper` the way latitude, longitude, title, content, and image are mapped. Stories with no themes still appear. Until editors have entered themes, do not show a chip row of invented categories.

`PostFilteringStrategy` currently advertises latitude, longitude, title, and content as filters and pages at 5. Do not surface that as the public UI. Raise the public page size so this small archive is one page.

Also add optional fields, empty by default, for the story sidebar:

- Nation or community
- Language
- Further categories

Show the value when an editor has entered one. Show “To be confirmed” when they have not, using the dashed `.reserved` treatment. Wire any new field through `MetadataMapper` if the map or archive needs it. Do not require these fields to publish a story.

Place text on cards and the meta strip comes from the metadata title (the landmark), not from a hardcoded locality list.

## Story list

Restyle `Archive.cshtml` to the card grid in `C:\Projects\arcualberta.github.io\sop/stories.html`. Each card is one link: image or forest fallback, number, title, place, excerpt, and any real theme labels. Two columns from about 760px, one column below that. Drop the current image-card grid for this archive. Keep editor-authored archive blocks if the page type already renders them above the list; do not throw away CMS content to match the mockup’s static intro. The visible title and excerpt should be the page’s own title and excerpt.

## Story page

Restyle `Post.cshtml` to `C:\Projects\arcualberta.github.io\sop/story.html`:

- Breadcrumb: Map / Stories / title.
- Hero with the title, place, and excerpt over the primary image, or over the forest fallback.
- A strip of place, and of setting, locality, and themes only when those fields have values.
- The post body remains the Piranha blocks. Do not replace block content with the mockup paragraphs.
- A pull quote only if the post already has a quote block. Do not fabricate one.
- Sidebar: a small OpenLayers locator at the story’s coordinates, the same custom marker, mouse-wheel zoom disabled so the page can still scroll, and a “Show on the map” link back to the map page with that story selected. Then the reserved metadata fields.
- “Other stories” lists other published posts in the same archive, not the mockup’s related set.
- On widths of about 860px and below, stack the sidebar under the article after the opening of the body, or directly after the meta strip if that matches the mockup more cleanly. One column, readable measure, no horizontal scroll.

Comments stay off.

## About and other static pages

Style standard pages with the same header, type, and footer. Do not overwrite an editor’s About page with the mockup’s paragraphs. Those paragraphs explain the design (light themes, reserved fields, the place mark) and are useful as a content draft, not as a forced replacement. If no About page exists, leave creating it to an editor, or add it through the existing setup path only if that path already seeds pages.

The mockup’s three principle cards are a layout editors should be able to build with the blocks the site already has. Prefer styling existing blocks so an editor can reach that look. Add a new block only if the current blocks cannot produce that section.

## Check the work in a browser

Build the site and look at it at a desktop width and at about 390px wide.

- Home: the map fills the screen; markers are the ring-and-gold mark; a story opens a popup and links to the post; a theme dims non-matches; the phone sheet collapses and opens.
- Archive: cards link to posts; chips hide non-matches; one story and ten stories both look intentional.
- Story: real block content, empty reserved fields read as “To be confirmed”, the locator uses the same marker, and “Show on the map” returns to that point.
- About or any other standard page still renders editor content inside the new chrome.
- No request to `maps.google.com/mapfiles` for the marker.
- The map page does not show the old search form.

Do not change authentication, connection strings, or the publish pipeline. Do not upgrade Piranha or `PiranhaComponents` unless the installed `MapBlock` has no way to change the marker; if you must, say why.

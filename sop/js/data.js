/* Sample collection for the interface mockup.
   Places are real so the map can be reviewed. Passages are not research text. */
(function () {
  function motifSvg(inner) {
    return (
      '<svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      inner +
      "</svg>"
    );
  }

  const gold = "#E4C57A";
  const cream = "#F6F1E6";

  window.MOTIFS = {
    river: motifSvg(
      '<g fill="none" stroke-linecap="round">' +
        '<path d="M-20 200c110-70 210-28 330 14s210-32 320-8 150 24 190 6" stroke="' + cream + '" stroke-width="1.2" opacity=".35"/>' +
        '<path d="M-20 255c120-58 200-58 320 0s200 58 330 0 140-42 190-14" stroke="' + gold + '" stroke-width="1.7" opacity=".9"/>' +
        '<path d="M-20 292c140-42 220-42 330 0s200 42 320 0 130-26 190-6" stroke="' + cream + '" stroke-width="1.15" opacity=".45"/>' +
        '<circle cx="548" cy="168" r="20" stroke="' + gold + '" stroke-width="1.4"/>' +
        '<circle cx="548" cy="168" r="4" fill="' + gold + '" stroke="none"/>' +
      "</g>"
    ),
    hills: motifSvg(
      '<path d="M0 230c80-80 150-86 230-8 72 70 130 78 210 8 78-68 150-62 220 12 48 46 90 28 140-10v228H0Z" fill="#10241c" opacity=".78"/>' +
        '<path d="M0 300c100-64 180-74 280-6 90 62 150 52 240-12 72-52 140-28 280 22v156H0Z" fill="#0c1c16"/>' +
        '<circle cx="590" cy="168" r="18" fill="none" stroke="' + gold + '" stroke-width="1.4"/>' +
        '<circle cx="590" cy="168" r="4" fill="' + gold + '"/>'
    ),
    peaks: motifSvg(
      '<path d="M20 440 L210 150 L300 250 L392 78 L530 268 L650 168 L800 440 Z" fill="#0e1e18" opacity=".78"/>' +
        '<path d="M0 440 L168 230 L276 312 L404 156 L534 330 L690 210 L840 440" fill="none" stroke="' + gold + '" stroke-width="1.5" opacity=".75"/>' +
        '<circle cx="392" cy="78" r="4.5" fill="' + gold + '"/>'
    ),
    confluence: motifSvg(
      '<path d="M70 36C210 190 270 230 400 258" stroke="' + cream + '" stroke-width="1.5" fill="none" opacity=".7"/>' +
        '<path d="M760 48C590 180 510 214 400 258" stroke="' + gold + '" stroke-width="1.7" fill="none"/>' +
        '<path d="M400 258c0 78-22 130-64 186" stroke="' + gold + '" stroke-width="1.7" fill="none" opacity=".85"/>' +
        '<circle cx="400" cy="258" r="8" fill="' + gold + '"/>'
    ),
    north: motifSvg(
      '<path d="M0 150c120 48 200 22 310-24s210-28 330 14 130 36 180 8" stroke="' + gold + '" stroke-width="10" opacity=".16" fill="none"/>' +
        '<path d="M0 188c130 28 210 8 320-34s200-16 320 22 120 28 180 0" stroke="' + cream + '" stroke-width="1.6" opacity=".5" fill="none"/>' +
        '<path d="M0 230c100 22 210 42 330-4s200-52 310-8 120 28 180 6" stroke="' + gold + '" stroke-width="1.3" opacity=".85" fill="none"/>' +
        '<circle cx="168" cy="318" r="4" fill="' + gold + '"/>'
    ),
    coulee: motifSvg(
      '<path d="M0 92H800" stroke="' + gold + '" stroke-width="1.1" opacity=".4"/>' +
        '<path d="M190 92c36 0 62 78 92 176s78 156 112 176" stroke="' + gold + '" stroke-width="1.6" fill="none"/>' +
        '<path d="M610 92c-40 0-78 86-116 184s-72 150-108 172" stroke="' + cream + '" stroke-width="1.25" fill="none" opacity=".65"/>' +
        '<circle cx="132" cy="168" r="4" fill="' + gold + '"/>'
    ),
    lake: motifSvg(
      '<ellipse cx="400" cy="250" rx="230" ry="74" fill="none" stroke="' + gold + '" stroke-width="1.5" opacity=".9"/>' +
        '<ellipse cx="400" cy="250" rx="156" ry="48" fill="none" stroke="' + cream + '" stroke-width="1.15" opacity=".45"/>' +
        '<ellipse cx="400" cy="250" rx="72" ry="22" fill="none" stroke="' + gold + '" stroke-width="1.25" opacity=".75"/>' +
        '<circle cx="400" cy="250" r="4.5" fill="' + gold + '"/>'
    ),
    parkland: motifSvg(
      '<path d="M0 268H800" stroke="' + gold + '" stroke-width="1.1" opacity=".45"/>' +
        '<path d="M-20 196C160 292 300 132 520 236S760 320 840 176" stroke="' + cream + '" stroke-width="1.6" fill="none" opacity=".8"/>' +
        '<path d="M0 312H800" stroke="' + cream + '" stroke-width="1" opacity=".22"/>' +
        '<circle cx="246" cy="124" r="4" fill="' + gold + '"/>'
    )
  };

  window.THEMES = ["Land", "Water", "Kinship", "Language", "Responsibility"];

  window.STORIES = [
    {
      id: "river",
      index: "01",
      title: "The River That Remembers",
      place: "North Saskatchewan River",
      locality: "Edmonton",
      setting: "Prairie river valley",
      themes: ["Water", "Land"],
      lng: -113.508,
      lat: 53.534,
      motif: "river",
      dek: "What a city owes to the river that made its valley, and what a person owes to a bank they keep returning to.",
      quote: "A river is not scenery. It is a relation that runs in one direction and remembers in both.",
      body: [
        "The North Saskatchewan cuts a wide valley through Edmonton. Bridges cross it, paths follow it, and still the water is doing the older work of carrying silt, ice, and everything upstream toward somewhere else.",
        "If philosophy can begin with land, a river is a clear place to start. You are always downstream of other lives, and always upstream of people you will not meet. Standing on the bank makes that easy to forget and easy to see.",
        "What belongs in the full record — the community that speaks for this place, the language of its names, the teaching a reader should not flatten into a general idea — is left open on this page. The layout keeps a seat for it."
      ]
    },
    {
      id: "hills",
      index: "02",
      title: "Where the Land Begins to Rise",
      place: "Eastern slopes",
      locality: "West of Calgary",
      setting: "Foothills",
      themes: ["Land", "Responsibility"],
      lng: -114.32,
      lat: 51.09,
      motif: "hills",
      dek: "The first lift of the foothills, and the change in attention that comes with a change in ground.",
      quote: "You notice the rise in your legs before you find a word for it.",
      body: [
        "West of Calgary the prairie does not stop so much as gather itself. The ground lifts, the light breaks on the ridges, and the city becomes a line behind you.",
        "A philosophy of land can begin with a fact the body registers first: effort, weather, and a horizon that is no longer flat. Responsibility here is not an abstract duty. It is the practical question of how to move through country steeper than the country you left.",
        "The research text would name whose foothills these are, and which stories already answer that question. This page only reserves the room."
      ]
    },
    {
      id: "peaks",
      index: "03",
      title: "A Path Through the Mountains",
      place: "Athabasca valley",
      locality: "Jasper",
      setting: "Mountain valley",
      themes: ["Land"],
      lng: -118.081,
      lat: 52.874,
      motif: "peaks",
      dek: "A valley that directs the eye, and a path that is never only a way through.",
      quote: "A pass is a decision the land made long before anyone walked it.",
      body: [
        "The Athabasca valley holds the road, the river, and the eye in the same corridor. Peaks close the sides. Weather arrives quickly. A path here is easy to mistake for a route planned for travellers.",
        "A valley is not a corridor provided for passage. It is a place with its own limits, and a path through it is a guest's line, not the meaning of the ground. Philosophy that starts from land has to be willing to be slowed, turned, or stopped.",
        "Names, hosts, and the right to tell more than this would be confirmed with the research team before they were published here."
      ]
    },
    {
      id: "confluence",
      index: "04",
      title: "At the Meeting of Waters",
      place: "Athabasca and Clearwater",
      locality: "Fort McMurray",
      setting: "Boreal confluence",
      themes: ["Water", "Kinship"],
      lng: -111.379,
      lat: 56.726,
      motif: "confluence",
      dek: "Two rivers join, and the joining is a way to think about relation rather than about a point on a map.",
      quote: "A confluence is a kinship you can see.",
      body: [
        "At Fort McMurray the Clearwater meets the Athabasca. On a map the meeting is a fork. On the bank it is a change in colour, speed, and sound, one current taking on another.",
        "Waters keep their histories for a while after they join. They do not become the same water at the first point of contact. Relation, in this sense, is a long mixing, not a pin dropped on a coordinate.",
        "Who stands in relation to these rivers, and in which language that relation is spoken, is part of the record this design is waiting to carry."
      ]
    },
    {
      id: "peace",
      index: "05",
      title: "Words Kept in a Northern Valley",
      place: "Peace River valley",
      locality: "Peace River",
      setting: "Northern river valley",
      themes: ["Language", "Land"],
      lng: -117.29,
      lat: 56.234,
      motif: "north",
      dek: "A valley named in English for a peace, and the question of which words a place already held.",
      quote: "A place can be renamed and still refuse to answer to only one name.",
      body: [
        "The town of Peace River sits in a deep cut above the water. The English name records one history of agreement, and everything an agreement leaves unsaid. The valley itself does not depend on that name.",
        "Words decide what a visitor thinks they have arrived at. They can hide older names, or hold them. A research site about stories and philosophy has to show that choosing a label is already an argument.",
        "The language field on this page is unfinished on purpose. It should be filled with the names the research team is prepared to stand behind, not with a designer's guess."
      ]
    },
    {
      id: "oldman",
      index: "06",
      title: "The Long Work of a River",
      place: "Oldman River",
      locality: "Lethbridge",
      setting: "Southern prairie river",
      themes: ["Water", "Responsibility"],
      lng: -112.832,
      lat: 49.693,
      motif: "coulee",
      dek: "A river in a coulee, wind on the prairie above it, and the work of not taking water for granted.",
      quote: "To use a river well, you first have to admit that you use it.",
      body: [
        "The Oldman River runs below Lethbridge in a coulee, while the streets sit up in the wind. The separation is physical. It is also easy to live with, which is how a river becomes an invisible service.",
        "Water withdrawn, water returned, water promised: responsibility is specific here, measured in a river that a dry year makes impossible to ignore. Philosophy does not have to leave those facts for a policy brief. It can begin with them.",
        "The communities that have argued for this river, and the terms they use, belong in the confirmed metadata, beside the coordinates, not buried in a general essay."
      ]
    },
    {
      id: "lake",
      index: "07",
      title: "A Lake and Its Relations",
      place: "Lac La Biche",
      locality: "Lac La Biche",
      setting: "Boreal lake",
      themes: ["Kinship", "Language"],
      lng: -112.08,
      lat: 54.84,
      motif: "lake",
      dek: "A lake as a gathering place, and the difference between visiting a shoreline and belonging to one.",
      quote: "A shoreline is a list of relations, written in who returns.",
      body: [
        "Lac La Biche is a long lake in boreal country, a place of arrival by many routes. A shoreline collects people, birds, weather, and names. It is a poor figure for empty land and a good one for a crowd of relations.",
        "A map marker can show where the lake is. It cannot show who is expected there, who is hosted, or who is responsible when they leave. Kinship is one name for that difference. Language is another, because the right words mark it more honestly than a scenic description.",
        "Both are left as open fields. The page is built so that filling them in will not require a new design."
      ]
    },
    {
      id: "prairie",
      index: "08",
      title: "Counsel of the Open Prairie",
      place: "Red Deer River",
      locality: "Red Deer",
      setting: "Parkland prairie",
      themes: ["Responsibility", "Kinship"],
      lng: -113.811,
      lat: 52.268,
      motif: "parkland",
      dek: "Open country, a river through parkland, and the kind of attention a wide horizon asks for.",
      quote: "On open ground, nothing you do is as private as it feels.",
      body: [
        "Around Red Deer the country opens into parkland, the river a dark line through it. Distance changes conduct. You can see weather coming. You can also believe, wrongly, that what you do here dissipates before it reaches anyone else.",
        "On open ground, actions stay visible: a fire, a fence, a road, a promise. Responsibility grows with that visibility, and kinship is the reminder that visibility runs in more than one direction. Someone is always downwind.",
        "As with the other pages in this mockup, the prose is a stand-in. The structure around it — place, themes, and room for the categories still being decided — is the proposal."
      ]
    }
  ];
})();

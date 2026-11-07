# Static

A daily news game prototype for the "Reimagining News for Gen Z" challenge. Players read a short story card, make a quick gut call, see one new piece of evidence, then lock in a final call with a confidence level. They get their score right away.

Each day has five stories: two local stories from the player's city, two national, and one global. Players pick their city from the taskbar (or the city label on the home screen): Seattle, Los Angeles, Houston, New York or Miami. The results screen shows the total, a combined National + Global score compared with other players, and a "Learn more" page of sources for each story.

## Run it

It is a plain HTML, CSS and JavaScript site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 4173
```

Then go to http://localhost:4173.

## Edit the content

All stories, sources and scoring live in [`js/data.js`](js/data.js).

Each entry in `cities` has a `ranked` list of its top five local stories, shown in the city menu, and a `local` list with full game cards for the top two. Those two play on 88.1 and 91.5 FM, followed by the shared national and global stories in `sharedStories`. If a city's local story is the same vote as a shared one, mark it with `sameAs` and that city skips the shared copy (Los Angeles does this for California's Prop 1, so it plays four stories). The chosen city is remembered on each device. The current stories are real news from the week of November 3, 2026: the Seattle transit measure, the Ballard light rail timeline, the youth share of the midterm vote, California's housing bond, and Turkey's defense pact vote. Their outcomes come from early counts, so check them against official results before presenting. For each story you can set:

- `setup`, `question`, `evidence` and `outcome`: the text players see at each step.
- `answer`: `"yes"` or `"no"`.
- `sampleCrowdYes`: the share of the sample crowd that answered Yes, from 0 to 1.
- `sources`: the Learn more links, grouped by source type. Set a link's `url` to make it clickable. Links with `url: null` are hidden until they have one.

## Themes

The default look is a retro desktop theme in [`css/theme-webcore.css`](css/theme-webcore.css), layered on top of the dark radio-booth look in [`css/styles.css`](css/styles.css). Add `?theme=dark` to the URL to see the dark look, for example https://jz6424.github.io/ProductGames2026/?theme=dark, and `?theme=webcore` to switch back. The choice is remembered on that device. To go back to dark as the default, remove `data-theme="webcore"` from the `<html>` tag in `index.html` and change the last lines of [`js/theme.js`](js/theme.js).

## Scoring

Base points, before weighting:

- Gut call: +20 if right, 0 if wrong or if the 20-second timer runs out.
- Final call: Leaning +36 / −44, Confident +75 / −125, Certain +96 / −224.

Each story then scales those points by two multipliers set in `scoring` in `js/data.js`:

- Relevance: local ×1.25, national ×1, global ×0.8.
- Difficulty, set per story by how clearly the evidence points to the outcome: easy (gains ×0.8, losses ×1.1), medium (×1), hard (gains ×1.3, losses ×0.8).

Players don't see the point values before they answer. The reveal shows the gut, final and round total for each story.

The score distribution on the results screen uses sample data from `sampleDistribution` in `js/data.js`.

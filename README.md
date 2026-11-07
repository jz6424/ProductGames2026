# Static

A daily news game prototype for the "Reimagining News for Gen Z" challenge. Players read a short story card, make a quick gut call, see one new piece of evidence, then lock in a final call with a confidence level. They get their score right away.

Each day has three stories: local (Seattle), national, and global. The results screen shows the total, a combined National + Global score compared with other players, and a "Learn more" page of sources for each story.

## Run it

It is a plain HTML, CSS and JavaScript site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 4173
```

Then go to http://localhost:4173.

## Edit the content

All stories, sources and scoring live in [`js/data.js`](js/data.js). The current stories are real news from the week of November 3, 2026: the Seattle transit measure, the youth share of the midterm vote, and Turkey's defense pact vote. Their outcomes come from early counts, so check them against official results before presenting. For each story you can set:

- `setup`, `question`, `evidence` and `outcome`: the text players see at each step.
- `answer`: `"yes"` or `"no"`.
- `sampleCrowdYes`: the share of the sample crowd that answered Yes, from 0 to 1.
- `sources`: the Learn more links, grouped by source type. Set a link's `url` to make it clickable. Links with `url: null` are hidden until they have one.

## Themes

The default look is a retro desktop theme in [`css/theme-webcore.css`](css/theme-webcore.css), layered on top of the dark radio-booth look in [`css/styles.css`](css/styles.css). Add `?theme=dark` to the URL to see the dark look, for example https://jz6424.github.io/ProductGames2026/?theme=dark, and `?theme=webcore` to switch back. The choice is remembered on that device. To go back to dark as the default, remove `data-theme="webcore"` from the `<html>` tag in `index.html` and change the last lines of [`js/theme.js`](js/theme.js).

## Scoring

- Gut call: +20 if right, 0 if wrong or if the 20-second timer runs out.
- Final call: Leaning +36 / −44, Confident +75 / −125, Certain +96 / −224.

The score distribution on the results screen uses sample data from `sampleDistribution` in `js/data.js`.

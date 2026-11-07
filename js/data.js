// Game content for Static. Edit this file to change stories, sources and scoring.
// Stories are real news from the week of November 3, 2026. Outcomes were taken from
// early, uncertified counts: check them against official results before presenting.
// Crowd percentages and the score distribution are SAMPLE data.
window.STATIC_DATA = {
  city: 'Seattle',
  gutSeconds: 10,
  gutPoints: 20,

  // Points for the final call, by confidence level.
  confidence: [
    { id: 'leaning', label: 'Leaning', right: 36, wrong: -44 },
    { id: 'confident', label: 'Confident', right: 75, wrong: -125 },
    { id: 'certain', label: 'Certain', right: 96, wrong: -224 }
  ],

  // Sample spread of National + Global scores, used for the results histogram.
  // Bin i covers scores from min + i * binSize up to the next bin.
  sampleDistribution: {
    min: -200,
    binSize: 50,
    counts: [3, 5, 8, 12, 17, 21, 16, 10, 6, 2]
  },

  stories: [
    {
      id: 'seattle-transit-measure',
      scope: 'local',
      scopeLabel: 'Local · Seattle',
      sample: false,
      teaser: 'Seattle votes on renewing its transit tax',
      setup: 'Seattle\'s transit measure is up for renewal on the November 3 ballot. The new version would double the city\'s transit sales tax from 0.15% to 0.3%, raising about $138 million a year.',
      question: 'Did voters approve it?',
      evidence: 'The City Council voted 9 to 0 to put the measure on the ballot.',
      evidenceSource: { title: 'City of Seattle: transit measure renewal', url: 'https://www.seattle.gov/transportation/projects-and-programs/programs/transit-program/seattle-transit-measure/renewal' },
      answer: 'yes',
      outcome: 'More than 72% of votes were in favor as of Thursday\'s count. Results are not yet certified.',
      why: 'Shoppers in Seattle will pay a slightly higher sales tax, and the money goes to city transit service.',
      sampleCrowdYes: 0.68,
      sources: [
        { heading: 'Official record', links: [{ title: 'City of Seattle: transit measure renewal', url: 'https://www.seattle.gov/transportation/projects-and-programs/programs/transit-program/seattle-transit-measure/renewal' }] },
        { heading: 'News reports', links: [
          { title: 'Westside Seattle: election night results', url: 'https://westsideseattle.com/robinson-papers/2026/11/03/election-night-tally-incumbents-lead-and-local-school-city-measures-pass' },
          { title: 'KNKX: Seattle and King County results', url: 'https://www.knkx.org/2026-11-03/seattle-king-county-election-results' }
        ] },
        { heading: 'Competing views', links: [
          { title: 'Supporters\' statement', url: null },
          { title: 'Opponents\' statement', url: null }
        ] }
      ]
    },
    {
      id: 'youth-vote-share',
      scope: 'national',
      scopeLabel: 'National',
      sample: false,
      teaser: 'How big a share of the midterm vote came from young people?',
      setup: 'In the 2022 midterms, voters ages 18 to 29 cast about 12% of all votes. Researchers tracked whether that share would grow in the November 3, 2026 midterms.',
      question: 'Did young people make up a bigger share of voters than in 2022?',
      evidence: 'A Harvard Youth Poll this fall found that 33% of young Americans said they would definitely vote.',
      evidenceSource: { title: 'Harvard Youth Poll, Fall 2026', url: 'https://iop.harvard.edu/youth-poll/53rd-edition-fall-2026' },
      answer: 'no',
      outcome: 'CIRCLE estimates young people cast 11% of votes, slightly below 2022. Another estimate puts it at 10%.',
      why: 'Young people turned out in large numbers, but other age groups did too, so their share of the vote did not grow.',
      sampleCrowdYes: 0.57,
      sources: [
        { heading: 'Research', links: [
          { title: 'CIRCLE: youth vote in the 2026 midterms', url: 'https://circle.tufts.edu/national-youth-vote-choice-2026-midterms' },
          { title: 'CIRCLE: how college students voted', url: 'https://circle.tufts.edu/index.php/latest-research/college-students-prioritized-economy-and-voted-democratic-2026-midterms' }
        ] },
        { heading: 'Polling before the election', links: [{ title: 'Harvard Youth Poll, Fall 2026', url: 'https://iop.harvard.edu/youth-poll/53rd-edition-fall-2026' }] },
        { heading: 'News reports', links: [
          { title: 'Yahoo News: youth turnout and the economy', url: 'https://www.yahoo.com/news/politics/articles/young-people-turned-near-record-133218725.html' },
          { title: 'Axios: Gen Z voters in the 2026 midterms', url: 'https://www.axios.com/2026/11/05/gen-z-voters-2026-midterms-democrats-house' }
        ] }
      ]
    },
    {
      id: 'turkey-defense-pact',
      scope: 'global',
      scopeLabel: 'Global',
      sample: false,
      teaser: 'Turkey\'s parliament votes on a three-country defense pact',
      setup: 'Turkey\'s parliament is voting on whether to ratify a joint defense agreement with Pakistan and Saudi Arabia. Ratification is the step that makes it binding under Turkish law.',
      question: 'Did parliament ratify the pact?',
      evidence: 'Only 398 of parliament\'s 592 members took part in the vote.',
      evidenceSource: { title: 'Anadolu Agency morning briefing', url: 'https://www.aa.com.tr/en/world/morning-briefing-nov-6-2026/4113576' },
      answer: 'yes',
      outcome: 'Parliament ratified the agreement 279 to 119.',
      why: 'Turkey is now formally part of the defense agreement with Pakistan and Saudi Arabia.',
      sampleCrowdYes: 0.52,
      sources: [
        { heading: 'News reports', links: [
          { title: 'Anadolu Agency (Turkish state news agency)', url: 'https://www.aa.com.tr/en/world/morning-briefing-nov-6-2026/4113576' },
          { title: 'Open Chronicle: global news brief', url: 'https://openchronicle.org/2026/11/06/global-news-brief-key-developments-around-the-world-november-6-2026/' }
        ] },
        { heading: 'Independent coverage', links: [{ title: 'International wire report', url: null }] },
        { heading: 'Competing views', links: [
          { title: 'Governing party statement', url: null },
          { title: 'Opposition statement', url: null }
        ] }
      ]
    }
  ]
};

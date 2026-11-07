// Game content for Static. Edit this file to change stories, sources and scoring.
// Every story here is a SAMPLE written for the prototype, not real news.
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
      id: 'seattle-rent-cap',
      scope: 'local',
      scopeLabel: 'Local · Seattle',
      sample: true,
      teaser: 'Seattle City Council votes on a rent cap',
      setup: 'Seattle City Council is voting on a rent cap. Tenant groups say it would keep housing affordable. Landlords say it could reduce the supply of rentals.',
      question: 'Did it pass?',
      evidence: 'The city attorney warned of a possible legal challenge, and two undecided members asked for changes before the vote.',
      evidenceSource: { title: 'Sample source', url: null },
      answer: 'yes',
      outcome: 'It passed 6 to 3, but only for buildings with more than 20 units.',
      why: 'Smaller buildings are exempt, so the cap would cover only some Seattle renters.',
      sampleCrowdYes: 0.41,
      sources: [
        { heading: 'Official record', links: [{ title: 'City Council vote record', url: null }] },
        { heading: 'News reports', links: [{ title: 'Local news article', url: null }, { title: 'Regional news article', url: null }] },
        { heading: 'Competing views', links: [{ title: 'Tenant group statement', url: null }, { title: 'Landlord association statement', url: null }] }
      ]
    },
    {
      id: 'senate-grace-period',
      scope: 'national',
      scopeLabel: 'National',
      sample: true,
      teaser: 'The Senate votes on student loan relief',
      setup: 'The Senate is voting on a bill to add six months to a student loan grace period. Supporters say it helps recent graduates. Opponents point to the cost.',
      question: 'Did it pass?',
      evidence: 'A budget estimate raised the projected cost, and two senators who had supported the idea asked for a smaller version.',
      evidenceSource: { title: 'Sample source', url: null },
      answer: 'no',
      outcome: 'It failed 47 to 53, and sponsors said they would try a smaller bill.',
      why: 'Current grace periods stay the same for now. A smaller bill would need a new vote.',
      sampleCrowdYes: 0.63,
      sources: [
        { heading: 'Official record', links: [{ title: 'Senate roll call vote', url: null }] },
        { heading: 'News reports', links: [{ title: 'Wire service report', url: null }, { title: 'National news article', url: null }] },
        { heading: 'Competing views', links: [{ title: 'Bill sponsor statement', url: null }, { title: 'Bill opponent statement', url: null }] }
      ]
    },
    {
      id: 'river-water-deal',
      scope: 'global',
      scopeLabel: 'Global',
      sample: true,
      teaser: 'Two countries try to settle a water dispute',
      setup: 'Two neighboring countries are holding a final round of talks on sharing a major river. Both say they need more water for farms during droughts.',
      question: 'Did they sign a deal?',
      evidence: 'Talks ran a day past the deadline, and one delegation said several technical issues were still unresolved.',
      evidenceSource: { title: 'Sample source', url: null },
      answer: 'yes',
      outcome: 'They signed a five-year deal that sets a review if drought conditions worsen.',
      why: 'The deal sets shared rules for now, but its review clause leaves room for another dispute.',
      sampleCrowdYes: 0.34,
      sources: [
        { heading: 'Official record', links: [{ title: 'Signed agreement text', url: null }] },
        { heading: 'News reports', links: [{ title: 'International wire report', url: null }, { title: 'Regional news article', url: null }] },
        { heading: 'Competing views', links: [{ title: 'Country A government statement', url: null }, { title: 'Country B government statement', url: null }] }
      ]
    }
  ]
};

// Game content for Static. Edit this file to change stories, sources and scoring.
// Stories are real news from the week of November 3, 2026. Outcomes were taken from
// early, uncertified counts: check them against official results before presenting.
// Crowd percentages and the score distribution are SAMPLE data.
// A story is a Yes or No question unless it sets type: 'dial', which asks for
// a number: see the README for the fields a dial story needs.
window.STATIC_DATA = {
  defaultCity: 'seattle',
  gutSeconds: 20,
  gutPoints: 20,

  // Points for the final call, by confidence level.
  confidence: [
    { id: 'leaning', label: 'Leaning', right: 36, wrong: -44 },
    { id: 'confident', label: 'Confident', right: 75, wrong: -125 },
    { id: 'certain', label: 'Certain', right: 96, wrong: -224 }
  ],

  // Each story's points are scaled by two factors, multiplied together.
  // Relevance: local stories affect players most directly, so they count most.
  // Difficulty: how hard it is to reach the outcome from the evidence. Hard
  // stories pay more for a right call and cost less for a wrong one.
  scoring: {
    relevance: { local: 1.25, national: 1, global: 0.8 },
    difficulty: {
      easy: { label: 'Easy', gain: 0.8, loss: 1.1 },
      medium: { label: 'Medium', gain: 1, loss: 1 },
      hard: { label: 'Hard', gain: 1.3, loss: 0.8 }
    }
  },

  // Sample spread of National + Global scores, used for the results histogram.
  // Skewed low for the demo, so a combined score of 50 to 100 beats about 80%.
  // Bin i covers scores from min + i * binSize up to the next bin.
  sampleDistribution: {
    min: -200,
    binSize: 50,
    counts: [8, 11, 15, 19, 20, 12, 7, 4, 3, 1]
  },

  // Each city supplies the two local stories in its game, plus its top five
  // ranked local stories for the city menu. The first two ranked stories are
  // the ones in the game; the rest are backups. Local stories take their
  // level, label and station (88.1 and 91.5 FM) from the city.
  cities: [
    {
      id: 'seattle',
      name: 'Seattle',
      ranked: [
        { title: 'Seattle transit tax renewal', outcome: 'Passed with over 72% in early counts' },
        { title: 'Ballard light rail timeline', outcome: 'Pushed to 2042' },
        { title: 'Washington I-645, repealing the millionaires\' tax', outcome: 'Failed, about 57.7% no' },
        { title: 'Seattle library levy renewal', outcome: 'Passed in August, 71.7% yes' },
        { title: 'Washington I-001, the Parents\' Bill of Rights', outcome: 'Leaning fail, about 52% no, not yet called' }
      ],
      local: [
        {
          id: 'seattle-transit-measure',
          // The evidence (a 9 to 0 council vote) points straight at Yes.
          difficulty: 'easy',
          sample: false,
          teaser: 'Seattle votes on renewing its transit tax',
          setup: 'Seattle\'s transit measure is up for renewal on the November 3 ballot.',
          extra: 'The new version would double the city\'s transit sales tax from 0.15% to 0.3%, raising about $138 million a year.',
          question: 'Did Seattle voters renew the transit tax?',
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
          id: 'ballard-light-rail',
          // The evidence (a budget shortfall) hints at a delay but gives no date.
          difficulty: 'medium',
          sample: false,
          teaser: 'When will light rail reach Ballard?',
          setup: 'Sound Transit is planning a light rail line from downtown Seattle to Ballard.',
          extra: 'It is part of the regional transit expansion voters approved in 2016, and the agency recently updated the project\'s timeline.',
          question: 'In what year is Ballard light rail now set to open?',
          type: 'dial',
          unit: '',
          min: 2030,
          max: 2050,
          fullCredit: 5,
          evidence: 'Sound Transit is looking for ways to borrow billions more dollars to cover a large budget shortfall.',
          evidenceSource: { title: 'The Chronicle: how Sound Transit seeks to borrow more money', url: 'https://www.chronline.com/stories/how-sound-transit-seeks-to-borrow-more-money-avoid-more-delays,411298' },
          answer: 2042,
          outcome: 'The latest update says the line from Market Street to Seattle Center will not open until 2042.',
          why: 'Construction from SODO to Seattle Center is funded, but the Ballard section is not yet. Public comment on the draft environmental review opens December 11.',
          sampleCrowdGuess: 2037,
          sources: [
            { heading: 'Official record', links: [{ title: 'Sound Transit news releases', url: 'https://www.soundtransit.org/get-to-know-us/news-events/news-releases' }] },
            { heading: 'News reports', links: [
              { title: 'KOMO: Ballard extension pushed to 2042', url: 'https://komonews.com/news/local/sound-transit-link-light-rail-ballard-extension-delay-2042-2060-community-meeting-opening-funding-board-budget-deficit-market-street-to-seattle-center' },
              { title: 'Railway Gazette: consultation begins in December', url: 'https://www.railwaygazette.com/usa/2026/11/05/seattle-light-rail-extension-consultation-to-begin-in-december/' },
              { title: 'The Chronicle: how Sound Transit seeks to borrow more money', url: 'https://www.chronline.com/stories/how-sound-transit-seeks-to-borrow-more-money-avoid-more-delays,411298' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'los-angeles',
      name: 'Los Angeles',
      ranked: [
        { title: 'LA Measure FD, a half-cent sales tax for the Fire Department', outcome: 'Projected to pass, 53.7% yes (not certified)' },
        { title: 'California Prop 1, an $11.25 billion housing bond', outcome: 'Passed, 60.5% yes with about 72% counted' },
        { title: 'California Prop 45, shorter environmental reviews for some projects', outcome: 'Trailing at 44.4% yes, not yet called' },
        { title: 'LA Measure TE, a mansion tax exemption for fire-damaged homes', outcome: 'Leading at 61.6% yes, not yet called' },
        { title: 'California Prop 43, a two-thirds vote for local special taxes', outcome: 'Trailing at about 46% yes, not yet called' }
      ],
      local: [
        {
          id: 'la-measure-fd-fire-tax',
          // The evidence points to voters being tired of sales tax increases, but June's measure still passed.
          difficulty: 'hard',
          sample: false,
          teaser: 'Will LA pay more at the register for firefighters?',
          setup: 'Measure FD would raise the Los Angeles city sales tax by half a cent, from 10.25% to 10.75%, to fund the Fire Department. It needed a simple majority to pass.',
          supporters: 'Backers estimate about $345 million a year for hiring, equipment and stations, and say more staff would cut response times.',
          opponents: 'Groups including the Howard Jarvis Taxpayers Association say residents already pay enough.',
          question: 'What share of Los Angeles voters said yes to the fire department sales tax?',
          type: 'dial',
          unit: '%',
          min: 0,
          max: 100,
          evidence: 'In June, a half-cent LA County sales tax for health care (Measure ER) only narrowly passed. Measure FD would be the third sales tax increase for city residents in about two years.',
          evidenceSource: { title: 'LAist: LA County\'s latest bid to raise taxes, Measure ER, narrowly passes', url: 'https://laist.com/news/politics/voter-guides/2026-election-california-primary-la-live-results-la-county-measure-er' },
          answer: 53.7,
          outcome: 'NBC Los Angeles projected on November 5 that Measure FD will pass. As of the November 6 count it had 53.7% yes. Results are not yet certified.',
          why: 'Supporters, including the firefighters union and Mayor Bass, said the department needs more staff to cut response times. Opponents, including the Howard Jarvis Taxpayers Association, said residents already pay enough.',
          sampleCrowdGuess: 47,
          sources: [
            { heading: 'Official record', links: [{ title: 'California Choices: Measure FD summary and arguments', url: 'https://www.californiachoices.org/los-angeles-measure-fd-2026' }] },
            { heading: 'News reports', links: [
              { title: 'NBC Los Angeles: LA voters approve Measure FD', url: 'https://www.nbclosangeles.com/elections/measure-fd-los-angeles-fire/3964835/' },
              { title: 'Daily Trojan: Guide to Los Angeles city ballot measures', url: 'https://dailytrojan.com/2026/10/19/guide-to-los-angeles-city-ballot-measures/' },
              { title: 'LAist: LA city ballot measure results', url: 'https://laist.com/brief/news/politics/voter-guides/2026-election-california-general-la-live-results-los-angeles-city-ballot-measures-ee-fd-la-te-se-prt-el' }
            ] }
          ]
        },
        {
          id: 'ca-prop-1-housing-bond',
          // Same vote as the shared California story, so LA games skip that one.
          sameAs: 'california-housing-bonds',
          // The evidence highlights the cost, which could suggest a No, but says nothing about how voters felt.
          difficulty: 'medium',
          sample: false,
          teaser: 'Will California borrow billions for housing?',
          setup: 'Prop 1 would let California borrow $11.25 billion: $10 billion for affordable housing construction, preservation and homeownership help, and $1.25 billion for veterans\' home loans.',
          supporters: 'Developers can\'t get enough funding to build affordable housing.',
          opponents: 'The state can\'t afford to take on more debt.',
          question: 'Did California voters approve the $11.25 billion housing bond?',
          evidence: 'The Legislative Analyst\'s Office estimated that repaying the housing part of the bond would cost the state about $500 million to $600 million a year for roughly 25 years.',
          evidenceSource: { title: 'Spectrum News: What the $11.25B housing bond would do', url: 'https://spectrumlocalnews.com/ca/california/politics/2026/10/16/california-prop-1-housing-bon-veterans-2026' },
          answer: 'yes',
          outcome: 'The AP called Prop 1 as passing on election night. With about 72% of the vote counted, it had 60.5% yes. Results are not yet certified.',
          why: 'Most of the money goes to affordable rental housing. Opponents called it adding debt without reforms that would bring down building costs.',
          sampleCrowdYes: 0.63,
          sources: [
            { heading: 'Official record', links: [{ title: 'California Secretary of State voter guide: Proposition 1', url: 'https://voterguide.sos.ca.gov/propositions/1/' }] },
            { heading: 'News reports', links: [
              { title: 'KQED: Live election results for Proposition 1', url: 'https://www.kqed.org/voterguide/california/proposition-1' },
              { title: 'CalMatters: California election results, all 14 propositions', url: 'https://calmatters.org/politics/elections/2026/11/california-election-result-propositions/' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'houston',
      name: 'Houston',
      ranked: [
        { title: 'Houston Prop A, lowest priority for marijuana possession and a no-knock warrant ban', outcome: 'Passed, about 71% yes (unofficial)' },
        { title: 'Six area school districts asking for tax increases or bonds', outcome: 'All failed (unofficial)' },
        { title: 'METRO approves $40 million for road, sidewalk and bus stop repairs', outcome: 'Approved unanimously on September 30' },
        { title: 'Harris County property tax rate increase', outcome: 'Approved 3 to 1 in September' },
        { title: 'City Council applies for a federal counter-drone grant', outcome: 'Approved November 4' }
      ],
      local: [
        {
          id: 'houston-prop-a-freedom-act',
          // The mayor's comment could mean the measure is harmless or unnecessary, so it points neither way.
          difficulty: 'medium',
          sample: false,
          teaser: 'Should marijuana possession be Houston police\'s lowest priority?',
          setup: 'Proposition A would make misdemeanor marijuana possession the police department\'s lowest enforcement priority and ban no-knock search warrants. Voters had to accept or reject both parts together.',
          supporters: 'Police could focus their time on more serious crimes.',
          opponents: 'The measure could conflict with state law and complicate police work.',
          question: 'What share of Houston voters voted yes on Proposition A?',
          type: 'dial',
          unit: '%',
          min: 0,
          max: 100,
          evidence: 'Mayor John Whitmire said low-level marijuana possession had not been a police priority "for some time" and that the department does not serve no-knock warrants.',
          evidenceSource: { title: 'KPRC Click2Houston: Houston voters to decide on marijuana enforcement and no-knock warrants', url: 'https://www.click2houston.com/news/local/2026/08/12/houston-voters-to-decide-on-marijuana-enforcement-no-knock-warrant-ban-in-november/' },
          answer: 71,
          outcome: 'Voters approved Prop A with about 71% yes in unofficial returns with about 70% of precincts counted. The count is not yet certified.',
          why: 'Supporters said police could focus on more serious crimes, while opponents raised concerns about conflicts with state law. Texas\'s attorney general has challenged similar measures in Austin and Dallas in court.',
          sampleCrowdGuess: 62,
          sources: [
            { heading: 'Official record', links: [{ title: 'City of Houston: 2026 Charter Amendment Election', url: 'https://www.houstontx.gov/2026-coh-charter-amendment-election.html' }] },
            { heading: 'News reports', links: [
              { title: 'KPRC Click2Houston: Houston voters approve Proposition A', url: 'https://www.click2houston.com/decision-2026/2026/11/04/houston-voters-approve-proposition-a-changing-marijuana-enforcement-and-no-knock-warrant-policies/' },
              { title: 'Reason: Houston voters approve restrictions on marijuana arrests and no-knock raids', url: 'https://reason.com/2026/11/06/houston-voters-approve-restrictions-on-marijuana-arrests-and-a-ban-on-no-knock-police-raids/' }
            ] }
          ]
        },
        {
          id: 'houston-school-tax-bonds-2026',
          // A modest yearly cost suggests one might pass, and the clue covers only one of six districts.
          difficulty: 'hard',
          sample: false,
          teaser: 'Would Houston-area voters pay more for their schools?',
          setup: 'Six Houston-area school districts, including Cypress-Fairbanks, Spring and La Porte, asked voters for property tax increases, bonds or both.',
          extra: 'Tax increases would mostly pay for operating costs like staff pay, and bonds would pay for repairs, technology and new buildings.',
          question: 'Did any of the six school districts get a tax or bond approved?',
          evidence: 'Cy-Fair ISD estimated that passing all five of its measures would add about $126 a year in property taxes on a $350,000 home with homestead exemptions.',
          evidenceSource: { title: 'KPRC Click2Houston: Cy-Fair ISD voters reject $1.64 billion bond package', url: 'https://www.click2houston.com/decision-2026/2026/11/04/cy-fair-isd-voters-reject-164-billion-school-bond-package/' },
          answer: 'no',
          outcome: 'Voters rejected every proposal in all six districts in unofficial results. The closest was Spring ISD\'s tax increase, with about 45% yes.',
          why: 'Districts like Cy-Fair and La Porte face budget deficits and now have to cut spending, delay projects or return to voters. Tax increases also failed in districts near Dallas, Austin and San Antonio.',
          sampleCrowdYes: 0.62,
          sources: [
            { heading: 'Official record', links: [{ title: 'Cy-Fair ISD: VATRE and Bond Election', url: 'https://election.cfisd.net/' }] },
            { heading: 'News reports', links: [
              { title: 'KPRC Click2Houston: Houston-area voters reject every school tax and bond proposal', url: 'https://www.click2houston.com/news/local/2026/11/06/houston-area-voters-reject-every-school-district-tax-increase-and-bond-proposal-on-election-day/' },
              { title: 'The Texan: Texas voters reject tax increases and school bonds', url: 'https://thetexan.news/elections/2026/amid-blue-wave-texas-voters-reject-tax-increases-and-public-school-bonds/article_e8ddb3a0-cbcd-4780-acaa-00bd14257024.html' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'new-york',
      name: 'New York',
      ranked: [
        { title: 'City Council vote on the revised COPA housing bill', outcome: 'Passed 38 to 9 on October 22' },
        { title: 'Ballot Proposal 3, faster bike and bus lane reviews', outcome: 'Passed with 65.7% (unofficial)' },
        { title: 'Ballot Proposal 1, faster outdoor dining permits', outcome: 'Passed with 63.4% (unofficial)' },
        { title: 'Court ruling on the state ban on algorithmic rent-setting', outcome: 'Partly blocked for RealPage on September 29' },
        { title: 'Council vote ending Central Park horse carriages', outcome: 'Passed October 22, phased out by June 2028' }
      ],
      local: [
        {
          id: 'nyc-copa-vote',
          // The evidence shows the bill failing earlier and does not mention it was rewritten.
          difficulty: 'hard',
          sample: false,
          teaser: 'Will nonprofits get first dibs on troubled buildings?',
          setup: 'COPA would give qualified nonprofit housing groups the first chance to buy certain residential buildings when owners sell. A version passed in December 2025 but was vetoed, and in October 2026 the Council brought back a narrower one.',
          supporters: 'It keeps affordable apartments away from speculative buyers.',
          opponents: 'Small property owners say it will lower building values.',
          question: 'Did the City Council pass the revised COPA housing bill?',
          evidence: 'In January 2026, Speaker Julie Menin let the Adams veto stand after supporters fell short of the 34 votes needed to override it, and Mayor Mamdani\'s law department had raised legal concerns about the bill.',
          evidenceSource: { title: 'Bisnow: COPA is officially dead as City Council lets Adams\' veto stand', url: 'https://www.bisnow.com/new-york/news/multifamily/menin-will-let-adams-copa-veto-stand-killing-controversial-legislation-132933' },
          answer: 'yes',
          outcome: 'On October 22, 2026, the Council passed COPA 38 to 9 with two abstentions. Mayor Mamdani has pledged to sign it.',
          why: 'The new version covers about 2,100 buildings instead of roughly 10,000. Supporters say it keeps affordable apartments away from speculative buyers, while small property owners say it will lower building values.',
          sampleCrowdYes: 0.45,
          sources: [
            { heading: 'Official record', links: [{ title: 'NYC Council: Council votes on housing and affordability (Oct 22, 2026)', url: 'https://council.nyc.gov/press/2026/10/22/3309/' }] },
            { heading: 'News reports', links: [
              { title: 'amNY: Council passes scaled-back nonprofit property COPA bill', url: 'https://www.amny.com/politics/council-passes-scaled-back-nonprofit-copa/' },
              { title: 'The Real Deal: COPA passes City Council after six-year battle', url: 'https://therealdeal.com/new-york/2026/10/22/copa-passes-nyc-council-after-six-year-battle/' },
              { title: 'Bisnow: COPA is officially dead as City Council lets Adams\' veto stand', url: 'https://www.bisnow.com/new-york/news/multifamily/menin-will-let-adams-copa-veto-stand-killing-controversial-legislation-132933' }
            ] }
          ]
        },
        {
          id: 'nyc-ballot-prop-3',
          // The evidence names an organized opposition campaign, but most city ballot proposals pass.
          difficulty: 'easy',
          sample: false,
          teaser: 'Should bike and bus lanes get a faster review?',
          setup: 'Proposal 3 would speed up reviews of street safety projects like bike and bus lanes, let the city sell small undevelopable lots without an auction, and end Council approval of city office leases.',
          supporters: 'It would cut street project timelines by about a third.',
          opponents: 'Communities should keep more say in reviewing projects.',
          question: 'What share of New York City voters approved Proposal 3?',
          type: 'dial',
          unit: '%',
          min: 0,
          max: 100,
          evidence: 'The Municipal Art Society of New York ran a "No on Ballot 3" campaign, and some groups that oppose bike lanes also opposed it.',
          evidenceSource: { title: 'City & State: Understanding the NYC ballot proposals', url: 'https://www.cityandstateny.com/politics/2026/10/understanding-nyc-ballot-proposals/416773/' },
          answer: 65.7,
          outcome: 'Proposal 3 passed with 65.7% of the vote in unofficial results with about 97% reported. All five proposals passed.',
          why: 'Supporters said it would cut street project timelines by about a third, while opponents wanted to keep more community review.',
          sampleCrowdGuess: 58,
          sources: [
            { heading: 'Analysis', links: [{ title: 'City & State: Understanding the NYC ballot proposals', url: 'https://www.cityandstateny.com/politics/2026/10/understanding-nyc-ballot-proposals/416773/' }] },
            { heading: 'News reports', links: [
              { title: 'Bushwick Daily: NYC voters back all five ballot proposals', url: 'https://bushwickdaily.com/news/from-outdoor-dining-permits-to-a-rainy-day-fund-target-nyc-voters-back-all-five-election-day-ballot-proposals-with-at-least-61-yes/' },
              { title: 'amNY: NYC voters approve all five ballot proposals', url: 'https://www.amny.com/politics/nyc-voters-approve-all-five-ballot-proposals/' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'miami',
      name: 'Miami',
      ranked: [
        { title: 'Florida Amendment 3, a bigger homestead property tax exemption', outcome: 'Passed with about 62%, needed 60% (unofficial)' },
        { title: 'Virginia Key marina lease (Miami Referendum 3)', outcome: 'Rejected, about 65% no (election night count)' },
        { title: '$450 million fire and public safety bond (Miami Referendum 1)', outcome: 'Approved, about 60.9% yes' },
        { title: 'Miami-Dade schools property tax for teacher pay', outcome: 'Approved, about 81.8% yes' },
        { title: 'Miami Beach Michigan Avenue property lease', outcome: 'Rejected, about 62.6% no' }
      ],
      local: [
        {
          id: 'florida-amendment-3-homestead',
          // The evidence (a poll at 50% yes, short of the 60% needed) points toward failure.
          difficulty: 'hard',
          sample: false,
          teaser: 'Will Florida voters approve a bigger property tax break?',
          setup: 'Amendment 3 would raise the homestead exemption on non-school property taxes from $50,000 to $250,000 by 2028 and cap yearly assessment increases on rentals and second homes at 5%. Florida amendments need 60% to pass.',
          supporters: 'Homeowners need relief from rising costs.',
          opponents: 'Local governments would lose billions for services.',
          question: 'What share of Florida voters voted yes on Amendment 3?',
          type: 'dial',
          unit: '%',
          min: 0,
          max: 100,
          evidence: 'A University of North Florida poll of 1,471 likely voters, taken October 12 to 19, found 50% planned to vote yes, 30% no and 14% did not know.',
          evidenceSource: { title: 'News4JAX: UNF poll finds homestead amendment short of 60%', url: 'https://www.news4jax.com/news/local/2026/10/21/unf-poll-shows-tight-florida-governor-senate-races/' },
          answer: 62,
          outcome: 'Amendment 3 passed with about 62% of the vote, two points above the 60% it needed, according to unofficial results.',
          why: 'Most undecided voters broke toward yes. Miami-Dade\'s mayor estimated the county could lose about $385 million in the first year, with transit, parks and libraries among the services that could face cuts.',
          sampleCrowdGuess: 54,
          sources: [
            { heading: 'Official record', links: [{ title: 'Miami-Dade Supervisor of Elections: November 3, 2026 sample ballot', url: 'https://www.miamidade.gov/elections/library/2026-11-03-general-election-sample-ballot.pdf' }] },
            { heading: 'News reports', links: [
              { title: 'CBS Miami: Florida Amendment 3 is approved', url: 'https://www.cbsnews.com/miami/news/florida-amendment-3-property-tax-election-results-2026/' },
              { title: 'CBS12: Amendment 3 passes with 62% of the vote', url: 'https://cbs12.com/news/local/florida-amendment-3-what-a-yes-or-no-vote-means-for-homeowners-and-local-services' },
              { title: 'News4JAX: UNF poll on the homestead amendment', url: 'https://www.news4jax.com/news/local/2026/10/21/unf-poll-shows-tight-florida-governor-senate-races/' }
            ] }
          ]
        },
        {
          id: 'miami-virginia-key-marinas',
          // The evidence shows the city did not want the deal, but not how voters felt.
          difficulty: 'medium',
          sample: false,
          teaser: 'Should a private developer run the Virginia Key marinas?',
          setup: 'Miami voters were asked whether to lease about 27 acres around the Rickenbacker and Marine Stadium marinas to a private venture for 45 years.',
          supporters: 'The deal brings an estimated $80 million in private upgrades and more public access.',
          opponents: 'The rent is below market, and public waterfront should stay under city control.',
          question: 'Did Miami voters approve the Virginia Key marina lease?',
          evidence: 'The deal came from a 2016 bid. Commissioners put it on the ballot after courts ruled against the city for canceling it and the city attorney warned they risked contempt of court.',
          evidenceSource: { title: 'WLRN: What to know about Miami\'s Virginia Key referendum', url: 'https://www.wlrn.org/government-politics/2026-10-30/what-to-know-about-miamis-virginia-key-referendum-and-whether-it-affects-the-historic-black-beach' },
          answer: 'no',
          outcome: 'Voters rejected Referendum 3, with about 65% voting no in the election night count.',
          why: 'The lease offered about $2.2 million in base rent plus 6% of gross revenue, below city appraisals of $3.35 million to $3.86 million. The developer partnership has said it does not intend to give up.',
          sampleCrowdYes: 0.42,
          sources: [
            { heading: 'Official record', links: [{ title: 'Miami-Dade Supervisor of Elections: November 3, 2026 master ballot', url: 'https://www.miamidade.gov/elections/library/2026-11-03-general-election-master-ballot.pdf' }] },
            { heading: 'News reports', links: [
              { title: 'WLRN: Miami rejects marina plan, approves $450 million safety bond', url: 'https://www.wlrn.org/government-politics/2026-11-03/miami-referendum-result-virginia-key-bond-fire-police' },
              { title: 'CBS Miami: Both sides of the Referendum 3 debate', url: 'https://www.cbsnews.com/miami/news/miami-referendum-3-virginia-key-marinas-future-debate-midterm-elections-2026/' },
              { title: 'NBC Miami: Miami-Dade election results', url: 'https://www.nbcmiami.com/elections/miami-dade-election-results-2026-midterms/3880240/' }
            ] }
          ]
        }
      ]
    }
  ],

  // National and global stories every city plays, after its two local ones.
  sharedStories: [
    {
      id: 'youth-vote-share',
      scope: 'national',
      scopeLabel: 'National',
      frequency: '96.5',
      // The evidence (a turnout poll) does not say which way the share moved.
      difficulty: 'hard',
      sample: false,
      teaser: 'How big a share of the midterm vote came from young people?',
      setup: 'In the 2022 midterms, voters ages 18 to 29 cast about 12% of all votes.',
      extra: 'Researchers tracked whether that share would grow in the November 3, 2026 midterms.',
      question: 'What share of the 2026 midterm vote came from voters ages 18 to 29?',
      type: 'dial',
      unit: '%',
      min: 0,
      max: 30,
      evidence: 'A Harvard Youth Poll this fall found that 33% of young Americans said they would definitely vote.',
      evidenceSource: { title: 'Harvard Youth Poll, Fall 2026', url: 'https://iop.harvard.edu/youth-poll/53rd-edition-fall-2026' },
      answer: 11,
      outcome: 'CIRCLE estimates young people cast 11% of votes, slightly below 2022. Another estimate puts it at 10%.',
      why: 'Young people turned out in large numbers, but other age groups did too, so their share of the vote did not grow.',
      sampleCrowdGuess: 17,
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
      id: 'california-housing-bonds',
      scope: 'national',
      scopeLabel: 'National · California',
      frequency: '100.7',
      // The evidence (a repayment cost) could suggest a No, but says nothing about how voters felt.
      difficulty: 'medium',
      sample: false,
      teaser: 'California votes on $11.25 billion for housing',
      setup: 'California voters are deciding on Proposition 1, which would let the state borrow $11.25 billion through bonds for housing assistance.',
      supporters: 'It would fund more affordable housing.',
      opponents: 'It adds debt the state would have to repay.',
      question: 'Did California voters approve the $11.25 billion housing bond?',
      evidence: 'The Legislative Analyst\'s Office estimated that repaying the housing part of the bond would cost the state about $500 million to $600 million a year for roughly 25 years.',
      evidenceSource: { title: 'Spectrum News: What the $11.25B housing bond would do', url: 'https://spectrumlocalnews.com/ca/california/politics/2026/10/16/california-prop-1-housing-bon-veterans-2026' },
      answer: 'yes',
      outcome: 'The AP called it as passing on election night, with 60.5% yes and about 72% of the vote counted. Results are not yet certified.',
      why: 'The state gets a large pool of money for housing programs, along with a debt it has to repay.',
      sampleCrowdYes: 0.6,
      sources: [
        { heading: 'Official record', links: [{ title: 'NBC Los Angeles: California proposition results', url: 'https://www.nbclosangeles.com/elections/2026-california-ballot-propositions-election-results/3961904/' }] },
        { heading: 'News reports', links: [
          { title: 'Quartz: 6 tax and housing measures on the 2026 ballot', url: 'https://qz.com/2026-ballot-measures-tax-housing-wunc' },
          { title: 'Ballotpedia: 2026 ballot measures', url: 'https://ballotpedia.org/2026_ballot_measures' }
        ] }
      ]
    },
    {
      id: 'turkey-defense-pact',
      scope: 'global',
      scopeLabel: 'Global',
      frequency: '104.3',
      // The evidence (partial attendance) does not point either way.
      difficulty: 'hard',
      sample: false,
      teaser: 'Turkey\'s parliament votes on a three-country defense pact',
      setup: 'Turkey\'s parliament is voting on whether to ratify a joint defense agreement with Pakistan and Saudi Arabia.',
      extra: 'Ratification is the step that makes the agreement binding under Turkish law.',
      question: 'Did Turkey\'s parliament approve the three-country defense pact?',
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

(function () {
  'use strict';

  const DATA = window.STATIC_DATA;
  const app = document.getElementById('app');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Cities ----------

  const LOCAL_FREQUENCIES = ['88.1', '91.5'];
  const CITY_KEY = 'static-city';

  function findCity(id) {
    return DATA.cities.find((city) => city.id === id) || DATA.cities.find((city) => city.id === DATA.defaultCity);
  }

  // A city's game: its two local stories on 88.1 and 91.5 FM, then the shared
  // national and global stories. A shared story the city already plays as a
  // local one (marked with sameAs) is skipped, so nobody gets the same vote twice.
  function useCity(id) {
    const city = findCity(id);
    const playedLocally = city.local.map((story) => story.sameAs).filter(Boolean);
    DATA.cityId = city.id;
    DATA.city = city.name;
    DATA.stories = city.local
      .map((story, i) => Object.assign({}, story, {
        scope: 'local',
        scopeLabel: 'Local · ' + city.name,
        frequency: LOCAL_FREQUENCIES[i]
      }))
      .concat(DATA.sharedStories.filter((story) => !playedLocally.includes(story.id)));
  }

  function savedCity() {
    try {
      return window.localStorage.getItem(CITY_KEY);
    } catch (err) {
      return null;
    }
  }

  useCity(savedCity() || DATA.defaultCity);

  let state = freshState();
  let timer = null;

  function freshState() {
    return {
      screen: 'home',
      idx: 0,
      gut: null,
      final: null,
      conf: null,
      results: [],
      learnIdx: 0,
      timeLeft: DATA.gutSeconds,
      shareLabel: 'Share my score'
    };
  }

  // ---------- Helpers ----------

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  // Pixel-art map pin, drawn as one-pixel rows so it stays crisp when scaled.
  const PIN_EDGE = [[3, 0, 4], [2, 1, 6], [1, 2, 8], [1, 3, 8], [1, 4, 8], [1, 5, 8], [2, 6, 6], [3, 7, 4], [3, 8, 4], [4, 9, 2], [4, 10, 2], [4, 11, 2]];
  const PIN_BODY = [[3, 1, 4], [2, 2, 6], [2, 3, 6], [2, 4, 6], [2, 5, 6], [3, 6, 4], [4, 7, 2], [4, 8, 2]];
  const PIN_SHINE = [[4, 3, 2], [4, 4, 2]];

  function pixelRows(rows) {
    return rows.map(([x, y, w]) => `M${x} ${y}h${w}v1h-${w}z`).join('');
  }

  function pinIcon() {
    return `<svg class="pin" viewBox="0 0 10 12" aria-hidden="true" shape-rendering="crispEdges"><path class="pin-edge" d="${pixelRows(PIN_EDGE)}"></path><path class="pin-body" d="${pixelRows(PIN_BODY)}"></path><path class="pin-shine" d="${pixelRows(PIN_SHINE)}"></path></svg>`;
  }

  function signed(n) {
    return n > 0 ? '+' + n : String(n);
  }

  function answerWord(value) {
    if (value === 'yes') return 'Yes';
    if (value === 'no') return 'No';
    return 'No call';
  }

  function gutSentence(value) {
    return value ? 'Your gut said ' + answerWord(value) : 'You didn\'t make a gut call';
  }

  function findConfidence(id) {
    return DATA.confidence.find((c) => c.id === id);
  }

  function currentStory() {
    return DATA.stories[state.idx];
  }

  // A story's multipliers: relevance (local counts most) times difficulty
  // (hard stories pay more for a right call and cost less for a wrong one).
  function storyWeights(story) {
    const relevance = DATA.scoring.relevance[story.scope] ?? 1;
    const difficulty = DATA.scoring.difficulty[story.difficulty] || DATA.scoring.difficulty.medium;
    return { gain: difficulty.gain * relevance, loss: difficulty.loss * relevance, difficulty: difficulty.label };
  }

  function scoreRound(story) {
    const gutRight = state.gut === story.answer;
    const finalRight = state.final === story.answer;
    const conf = findConfidence(state.conf);
    const weights = storyWeights(story);
    const gutPoints = gutRight ? Math.round(DATA.gutPoints * weights.gain) : 0;
    const finalPoints = finalRight ? Math.round(conf.right * weights.gain) : Math.round(conf.wrong * weights.loss);

    let label = 'Fooled twice';
    let note = 'Your gut call and your final call were both wrong';
    if (gutRight && finalRight) {
      label = 'Called it';
      note = 'Your instinct was right, and you stayed with it';
    } else if (finalRight && state.gut === null) {
      label = 'Good final call';
      note = 'You missed the gut call, but the evidence led you to the right answer';
    } else if (finalRight) {
      label = 'Great update';
      note = 'The evidence changed your mind, and your final call was right';
    } else if (gutRight) {
      label = 'Talked out of it';
      note = 'Your first instinct was right this time';
    } else if (state.gut === null) {
      label = 'Missed it';
      note = 'The timer ran out on your gut call, and your final call was wrong';
    }

    return { gutPoints, finalPoints, total: gutPoints + finalPoints, label, note, difficulty: weights.difficulty };
  }

  // ---------- Actions ----------

  function go(change) {
    state = Object.assign({}, state, change);
    render();
  }

  // How long "Off air" stays on screen after the countdown reaches 0.
  const OFF_AIR_HOLD_MS = 1000;

  // The countdown and the bar both read one deadline on every tick, so the bar
  // empties exactly as the count reaches 0. At 0 the answer buttons lock, the
  // sign reads "Off air" for OFF_AIR_HOLD_MS, and then the round moves on.
  function startTimer() {
    stopTimer();
    const duration = DATA.gutSeconds * 1000;
    const startedAt = performance.now();
    const current = { tick: null, hold: null };
    timer = current;
    current.tick = window.setInterval(() => {
      const remaining = Math.max(0, duration - (performance.now() - startedAt));
      updateTimer(remaining);
      if (remaining > 0) return;
      window.clearInterval(current.tick);
      document.querySelectorAll('[data-action="gut"]').forEach((button) => { button.disabled = true; });
      current.hold = window.setTimeout(() => {
        if (timer !== current) return;
        stopTimer();
        go({ gut: null, final: null, screen: 'evidence' });
      }, OFF_AIR_HOLD_MS);
    }, 50);
  }

  function stopTimer() {
    if (timer !== null) {
      window.clearInterval(timer.tick);
      window.clearTimeout(timer.hold);
      timer = null;
    }
  }

  // Seconds at which the on-air sign switches to its amber warning.
  const WARNING_SECONDS = 5;

  function onAirState(timeLeft) {
    if (timeLeft <= 0) return 'off';
    return timeLeft <= WARNING_SECONDS ? 'warning' : 'live';
  }

  // The neon tube flickers through the warning, faster in the last 2 seconds.
  function onAirFlicker(timeLeft) {
    if (timeLeft <= 0 || timeLeft > WARNING_SECONDS) return 'none';
    return timeLeft <= 2 ? 'fast' : 'slow';
  }

  // ---------- Countdown clocks ----------

  function clockDigits(seconds) {
    const text = String(Math.max(0, seconds)).padStart(2, '0');
    return [text[0], text[1]];
  }

  // Digital readout used by the webcore theme, e.g. "00:20".
  function digitalTime(seconds) {
    return '00:' + clockDigits(seconds).join('');
  }

  function flipCard(digit) {
    return `<span class="flip-card" data-digit="${digit}"><span class="flip-half flip-top"><span>${digit}</span></span><span class="flip-half flip-bottom"><span>${digit}</span></span></span>`;
  }

  function flipLeaf(half, digit) {
    const leaf = document.createElement('span');
    leaf.className = 'flip-half flip-leaf flip-' + half;
    const face = document.createElement('span');
    face.textContent = digit;
    leaf.appendChild(face);
    return leaf;
  }

  // Split-flap flip: the old top half folds down, then the new bottom half
  // falls into place. The still halves underneath already show the new top
  // and the old bottom, so nothing jumps.
  function flipTo(card, digit) {
    const old = card.dataset.digit;
    if (old === digit) return;
    card.dataset.digit = digit;
    card.querySelectorAll('.flip-leaf').forEach((leaf) => leaf.remove());
    const top = card.querySelector('.flip-top > span');
    const bottom = card.querySelector('.flip-bottom > span');
    top.textContent = digit;
    if (reduceMotion || typeof card.animate !== 'function') {
      bottom.textContent = digit;
      return;
    }
    bottom.textContent = old;
    const fold = flipLeaf('top', old);
    const fall = flipLeaf('bottom', digit);
    fall.style.transform = 'rotateX(90deg)';
    card.append(fold, fall);
    fold.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
    const drop = fall.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], { duration: 160, delay: 160, easing: 'ease-out', fill: 'forwards' });
    drop.onfinish = () => {
      bottom.textContent = digit;
      fold.remove();
      fall.remove();
    };
  }

  function updateTimer(remaining) {
    state.timeLeft = Math.ceil(remaining / 1000);
    const count = document.getElementById('time-left');
    const clock = document.getElementById('flip-clock');
    const bar = document.getElementById('time-bar');
    const sign = document.getElementById('on-air');
    const label = document.getElementById('on-air-label');
    if (count) count.textContent = String(state.timeLeft);
    const digital = document.getElementById('digital-clock');
    if (digital) digital.textContent = digitalTime(state.timeLeft);
    if (clock) {
      const digits = clockDigits(state.timeLeft);
      clock.querySelectorAll('.flip-card').forEach((card, i) => flipTo(card, digits[i]));
    }
    // One block per second; the block for each second that has passed goes out.
    if (bar) bar.querySelectorAll('.timer-block').forEach((block, i) => block.classList.toggle('on', i < state.timeLeft));
    if (sign) {
      const status = onAirState(state.timeLeft);
      sign.dataset.state = status;
      sign.dataset.flicker = onAirFlicker(state.timeLeft);
      if (label) label.setAttribute('aria-label', status === 'off' ? 'Off air' : 'On air');
    }
  }

  function startRound(idx) {
    state = Object.assign({}, state, { screen: 'gut', idx, gut: null, final: null, conf: null, timeLeft: DATA.gutSeconds });
    // A new game starts from the zero-point signal instead of easing in from the last game.
    if (idx === 0) Object.assign(wave, waveTarget());
    render();
    startTimer();
  }

  const actions = {
    start() {
      state = freshState();
      startRound(0);
    },
    gut(value) {
      stopTimer();
      go({ gut: value, final: value, screen: 'evidence' });
    },
    toFinal() {
      go({ screen: 'final' });
    },
    final(value) {
      go({ final: value });
    },
    conf(id) {
      go({ conf: id });
    },
    lock() {
      if (!state.final || !state.conf) return;
      const story = currentStory();
      const round = scoreRound(story);
      go({
        screen: 'reveal',
        lastRound: round,
        results: state.results.concat([{ storyIdx: state.idx, label: round.label, points: round.total, gutPoints: round.gutPoints, finalPoints: round.finalPoints }])
      });
    },
    next() {
      if (state.idx < DATA.stories.length - 1) {
        startRound(state.idx + 1);
      } else {
        go({ screen: 'summary' });
      }
    },
    learn(idx) {
      go({ screen: 'learn', learnIdx: Number(idx) });
    },
    back() {
      go({ screen: 'summary' });
    },
    home() {
      stopTimer();
      state = freshState();
      render();
    },
    share() {
      const total = state.results.reduce((sum, r) => sum + r.points, 0);
      const text = 'I scored ' + signed(total) + ' in today\'s Static game. Can you beat it?';
      const done = (label) => go({ shareLabel: label });
      try {
        navigator.clipboard.writeText(text).then(() => done('Copied to clipboard'), () => done('Copy not available'));
      } catch (err) {
        done('Copy not available');
      }
    }
  };

  app.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    const action = actions[target.dataset.action];
    if (action) action(target.dataset.value);
  });

  // ---------- Taskbar and city menu ----------

  const taskbar = document.getElementById('taskbar');
  const cityMenu = document.getElementById('city-menu');
  let menuPreview = DATA.cityId;

  function renderTaskbar() {
    if (!taskbar) return;
    taskbar.innerHTML = `
      <span class="taskbar-brand">Static</span>
      <span class="taskbar-divider" aria-hidden="true"></span>
      <button type="button" class="taskbar-city" data-city-menu aria-haspopup="dialog">${pinIcon()}<span>${esc(DATA.city)}</span></button>`;
  }

  // Cities on the left; the previewed city's top five local stories on the
  // right, with the first two marked as the ones in the game.
  function renderCityMenu() {
    const preview = findCity(menuPreview);
    cityMenu.innerHTML = `
      <h2 id="city-menu-title" class="city-menu-title">Choose your city</h2>
      <div class="city-menu-body">
        <ul class="city-list">
          ${DATA.cities.map((city) => `
            <li>
              <button type="button" class="city-option ${city.id === preview.id ? 'selected' : ''}" aria-pressed="${city.id === preview.id}" data-city-preview="${city.id}">
                ${pinIcon()}<span>${esc(city.name)}</span>${city.id === DATA.cityId ? '<span class="city-current">Playing</span>' : ''}
              </button>
            </li>`).join('')}
        </ul>
        <div class="city-stories">
          <span class="label">Top local stories in ${esc(preview.name)}</span>
          <ol class="city-ranked">
            ${preview.ranked.map((story, i) => `
              <li>
                <span class="ranked-title">${esc(story.title)}</span>
                <span class="muted small">${esc(story.outcome)}${i < preview.local.length ? ' · In the game' : ''}</span>
              </li>`).join('')}
          </ol>
        </div>
      </div>
      <div class="city-menu-actions">
        <button type="button" class="ghost" data-city-close>Cancel</button>
        <button type="button" class="primary" data-city-choose="${preview.id}">Tune in to ${esc(preview.name)}</button>
      </div>`;
  }

  function openCityMenu() {
    if (!cityMenu) return;
    menuPreview = DATA.cityId;
    renderCityMenu();
    if (typeof cityMenu.showModal === 'function') cityMenu.showModal();
    else cityMenu.setAttribute('open', '');
  }

  function closeCityMenu() {
    if (typeof cityMenu.close === 'function') cityMenu.close();
    else cityMenu.removeAttribute('open');
  }

  // Switching cities starts a fresh game with that city's local stories.
  function chooseCity(id) {
    useCity(id);
    try {
      window.localStorage.setItem(CITY_KEY, DATA.cityId);
    } catch (err) {
      // Storage can be blocked; the city still applies for this visit.
    }
    stopTimer();
    state = freshState();
    closeCityMenu();
    renderTaskbar();
    render();
  }

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-city-menu]');
    const preview = event.target.closest('[data-city-preview]');
    const choose = event.target.closest('[data-city-choose]');
    const close = event.target.closest('[data-city-close]');
    if (opener) openCityMenu();
    if (preview) {
      menuPreview = preview.dataset.cityPreview;
      renderCityMenu();
    }
    if (choose) chooseCity(choose.dataset.cityChoose);
    if (close) closeCityMenu();
  });

  // ---------- Templates ----------

  const STEPS = [['gut', 'Gut call'], ['evidence', 'Evidence'], ['final', 'Final call']];
  const SIGNAL = { gut: 'Headline only', evidence: 'New evidence added', final: 'All information shown', reveal: 'Outcome revealed' };

  // ---------- Radio parts ----------

  const DIAL_MIN = 88;
  const DIAL_MAX = 108;
  const SIGNAL_LEVEL = { gut: 1, evidence: 2, final: 3, reveal: 4 };

  function dialPercent(freq) {
    return ((parseFloat(freq) - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * 100;
  }

  // An FM tuner scale. The needle sits on the station being played; on the
  // full-size dial, each story's station is marked with its number.
  function tunerDial(activeIdx, compact) {
    let ticks = '';
    for (let f = DIAL_MIN; f <= DIAL_MAX; f += 1) {
      const major = f % 4 === 0;
      ticks += `<span class="tick ${major ? 'major' : ''}" style="left: ${dialPercent(f)}%"></span>`;
      if (major && !compact) ticks += `<span class="tick-label" style="left: ${dialPercent(f)}%">${f}</span>`;
    }
    const presets = compact ? '' : DATA.stories.map((s, i) => `
      <span class="preset-mark" style="left: ${dialPercent(s.frequency)}%">${i + 1}</span>`).join('');
    const needle = DATA.stories[activeIdx]
      ? `<span class="needle" style="left: ${dialPercent(DATA.stories[activeIdx].frequency)}%"></span>`
      : '';
    return `<div class="dial ${compact ? 'compact' : ''}" aria-hidden="true">${presets}<div class="dial-scale">${ticks}${needle}</div></div>`;
  }

  function signalMeter(level, total, label) {
    let bars = '';
    for (let n = 1; n <= total; n += 1) {
      bars += `<span class="meter-bar ${n <= level ? 'on' : ''}" style="height: ${n * 4}px"></span>`;
    }
    return label
      ? `<span class="meter" role="img" aria-label="${esc(label)}">${bars}</span>`
      : `<span class="meter" aria-hidden="true">${bars}</span>`;
  }

  function frequencyDisplay(freq) {
    return `<span class="lcd"><span class="lcd-freq">${esc(freq)}</span><span class="lcd-band">FM</span></span>`;
  }

  function roundHeader(story) {
    const current = STEPS.findIndex((s) => s[0] === state.screen);
    const level = SIGNAL_LEVEL[state.screen] || 4;
    const steps = current === -1 ? '' : `
      <ol class="steps" aria-label="Round progress">
        ${STEPS.map((s, i) => `
          <li class="${i <= current ? 'done' : ''} ${i === current ? 'current' : ''}" ${i === current ? 'aria-current="step"' : ''}>
            <span class="step-bar"></span>${s[1]}
          </li>`).join('')}
      </ol>`;
    return `
      <header class="round-header">
        <div class="faceplate">
          ${frequencyDisplay(story.frequency)}
          <div class="station">
            <span class="scope">${esc(story.scopeLabel)}</span>
            <span class="round-meta">Story ${state.idx + 1} of ${DATA.stories.length}</span>
          </div>
          ${signalMeter(level, 4, 'Signal strength ' + level + ' of 4')}
        </div>
        ${tunerDial(state.idx, true)}
        <div class="scope-screen">
          <svg class="wave" viewBox="0 0 350 56" preserveAspectRatio="none" role="img" aria-label="Radio wave, ${SIGNAL[state.screen].toLowerCase()}">
            <path id="wave-path" d=""></path>
          </svg>
        </div>
        <div class="signal-label">${SIGNAL[state.screen]}</div>
        ${steps}
      </header>`;
  }

  function homeScreen() {
    return `
      <section class="screen home">
        <div class="home-intro">
          <div class="brand-row">
            <span class="brand">Static</span>
            <button type="button" class="city city-button" data-city-menu aria-haspopup="dialog">${pinIcon()}<span>${esc(DATA.city)}</span></button>
          </div>
          <h1>Guess how real news stories turned out</h1>
          <p class="muted">You get a score right after each story, and a full round takes about five minutes</p>
          <div class="spacer"></div>
          <button type="button" class="primary" data-action="start">Start today's game</button>
          <p class="footnote">Real stories from the week of Nov 3, 2026, with sample crowd data</p>
        </div>
        <div class="home-stations">
          <div class="tuner">${tunerDial(0, false)}</div>
          <ul class="story-list">
            ${DATA.stories.map((s, i) => `
              <li class="card preset-row">
                <span class="preset-key" aria-hidden="true">${i + 1}</span>
                <div class="preset-text">
                  <span class="scope"><span class="freq">${esc(s.frequency)} FM</span> · ${esc(s.scopeLabel)}</span>
                  <span class="teaser">${esc(s.teaser)}</span>
                </div>
              </li>`).join('')}
          </ul>
          <p class="muted small">At the end, you can see how your score compares with other players</p>
        </div>
      </section>`;
  }

  function gutScreen(story) {
    return `
      <section class="screen">
        <div id="on-air" class="on-air" data-state="${onAirState(state.timeLeft)}" data-flicker="${onAirFlicker(state.timeLeft)}" role="timer" aria-label="Seconds left for your gut call">
          <span class="neon-sign"><span id="on-air-label" class="neon-text" aria-label="On air">On air</span></span>
          <span class="on-air-count">
            <span id="digital-clock" class="digital-clock" aria-hidden="true">${digitalTime(state.timeLeft)}</span>
            <span id="flip-clock" class="flip-clock" aria-hidden="true">${clockDigits(state.timeLeft).map(flipCard).join('')}</span>
            <span class="on-air-unit" aria-hidden="true">sec</span>
            <span id="time-left" class="sr-only">${state.timeLeft}</span>
          </span>
        </div>
        ${story.sample ? '<span class="tag">Sample story</span>' : ''}
        <p class="setup">${esc(story.setup)}</p>
        <h2 class="question">${esc(story.question)}</h2>
        <div class="spacer"></div>
        <div class="timer">
          <span>Time left for your gut call</span>
          <span id="time-bar" class="timer-track">${Array.from({ length: DATA.gutSeconds }, (_, i) => `<span class="timer-block ${i < state.timeLeft ? 'on' : ''}"></span>`).join('')}</span>
        </div>
        <div class="choice-row">
          <button type="button" class="choice" data-action="gut" data-value="no">No</button>
          <button type="button" class="choice" data-action="gut" data-value="yes">Yes</button>
        </div>
      </section>`;
  }

  function evidenceScreen(story) {
    const source = story.evidenceSource;
    const sourceHtml = source.url
      ? `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)}</a>`
      : esc(source.title);
    return `
      <section class="screen">
        <div class="question-row">
          <span>${esc(story.question)}</span>
          <span class="nowrap">${gutSentence(state.gut)}</span>
        </div>
        <div class="evidence-card">
          <span class="scope">New evidence</span>
          <p>${esc(story.evidence)}</p>
          <span class="muted small">Source: ${sourceHtml}</span>
        </div>
        <p class="muted">You can keep or change your answer on the next screen. Changing it has no penalty.</p>
        <div class="spacer"></div>
        <button type="button" class="primary" data-action="toFinal">Make my final call</button>
      </section>`;
  }

  function finalScreen(story) {
    const pick = (value) => `
      <button type="button" class="choice ${state.final === value ? 'selected' : ''}" aria-pressed="${state.final === value}" data-action="final" data-value="${value}">${answerWord(value)}</button>`;
    const ready = state.final && state.conf;
    return `
      <section class="screen">
        <h2 class="question">${esc(story.question)}</h2>
        <p class="muted small">${gutSentence(state.gut)}</p>
        <div class="choice-row">${pick('no')}${pick('yes')}</div>
        <span class="label">How confident are you?</span>
        <div class="confidence-list">
          ${DATA.confidence.map((c, i) => `
            <button type="button" class="confidence ${state.conf === c.id ? 'selected' : ''}" aria-pressed="${state.conf === c.id}" data-action="conf" data-value="${c.id}">
              <span class="confidence-name">${signalMeter(i + 1, DATA.confidence.length)}${c.label}</span>
            </button>`).join('')}
        </div>
        <div class="spacer"></div>
        <button type="button" class="primary" data-action="lock" ${ready ? '' : 'disabled'}>Lock in my answer</button>
      </section>`;
  }

  function revealScreen(story) {
    const round = state.lastRound;
    const crowdYes = Math.round(story.sampleCrowdYes * 100);
    const conf = findConfidence(state.conf);
    return `
      <section class="screen reveal">
        <div class="reveal-head">
          <h2>${esc(round.label)}</h2>
          <span class="points ${round.total >= 0 ? 'pos' : 'neg'}">${signed(round.total)}</span>
        </div>
        <p class="muted small">${esc(round.note)}</p>
        <div class="card">
          <span class="scope">What happened</span>
          <span class="outcome">${esc(story.outcome)}</span>
        </div>
        <dl class="breakdown">
          <div><dt>Gut call: ${answerWord(state.gut)}</dt><dd>${signed(round.gutPoints)}</dd></div>
          <div><dt>Final call: ${answerWord(state.final)}, ${conf.label}</dt><dd>${signed(round.finalPoints)}</dd></div>
          <div class="breakdown-total"><dt>Round total</dt><dd>${signed(round.total)}</dd></div>
        </dl>
        <p class="muted small">${esc(round.difficulty)} story, ${esc(story.scopeLabel)}</p>
        <hr>
        <p class="small strong">${crowdYes}% of the sample crowd said Yes</p>
        <p class="small">${esc(story.why)}</p>
        <div class="spacer"></div>
        <button type="button" class="primary" data-action="next">${state.idx < DATA.stories.length - 1 ? 'Next story' : 'See my results'}</button>
      </section>`;
  }

  function summaryScreen() {
    const total = state.results.reduce((sum, r) => sum + r.points, 0);
    const combined = state.results
      .filter((r) => DATA.stories[r.storyIdx].scope !== 'local')
      .reduce((sum, r) => sum + r.points, 0);

    const dist = DATA.sampleDistribution;
    const yourBin = Math.min(dist.counts.length - 1, Math.max(0, Math.floor((combined - dist.min) / dist.binSize)));
    const players = dist.counts.reduce((a, b) => a + b, 0);
    const below = dist.counts.slice(0, yourBin).reduce((a, b) => a + b, 0);
    const percentile = Math.round(((below + dist.counts[yourBin] / 2) / players) * 100);
    const tallest = Math.max.apply(null, dist.counts);
    const maxScore = dist.min + dist.binSize * dist.counts.length;

    return `
      <section class="screen summary">
        <div class="score-panel">
          <span class="scope">Today's score</span>
          <div class="total"><strong>${signed(total)}</strong><span class="muted">total points</span></div>
          ${signalMeter(state.results.filter((r) => r.points > 0).length, DATA.stories.length, state.results.filter((r) => r.points > 0).length + ' of ' + DATA.stories.length + ' stories scored points')}
        </div>
        <ul class="result-list">
          ${state.results.map((r, i) => `
            <li class="result-row">
              <div>
                <span class="muted small"><span class="freq">${esc(DATA.stories[r.storyIdx].frequency)}</span> ${esc(DATA.stories[r.storyIdx].scopeLabel)}</span>
                <span class="strong">${esc(r.label)}</span>
                <span class="muted small">Gut ${signed(r.gutPoints)} · Final ${signed(r.finalPoints)}</span>
              </div>
              <div class="result-actions">
                <span class="points small-points ${r.points >= 0 ? 'pos' : 'neg'}">${signed(r.points)}</span>
                <button type="button" class="ghost" data-action="learn" data-value="${i}">Learn more</button>
              </div>
            </li>`).join('')}
        </ul>
        <div class="combined"><span class="strong">National and global score</span><strong>${signed(combined)}</strong></div>
        <div class="dist-meta"><span class="strong">All players today</span><span>Sample data</span></div>
        <p class="strong">You scored higher than about ${percentile}% of players</p>
        <figure class="histogram" role="img" aria-label="Score distribution. You scored higher than about ${percentile}% of players.">
          <div class="bars">
            ${dist.counts.map((count, i) => `
              <div class="bin ${i === yourBin ? 'you' : ''}">
                ${i === yourBin ? '<span class="you-label">You</span>' : ''}
                <span class="bar" style="height: ${Math.round((count / tallest) * 84)}px"></span>
              </div>`).join('')}
          </div>
          <figcaption class="axis"><span>${signed(dist.min)}</span><span>${signed(maxScore)}</span></figcaption>
        </figure>
        <div class="spacer"></div>
        <button type="button" class="primary" data-action="share">${esc(state.shareLabel)}</button>
        <button type="button" class="ghost wide" data-action="home">Play again</button>
      </section>`;
  }

  function learnScreen() {
    const result = state.results[state.learnIdx];
    const story = DATA.stories[result ? result.storyIdx : 0];
    return `
      <section class="screen learn">
        <button type="button" class="ghost back" data-action="back">Back to results</button>
        <span class="scope">${esc(story.scopeLabel)}</span>
        <h2>${esc(story.teaser)}</h2>
        <p>${esc(story.outcome)}</p>
        ${story.sources.map((section) => {
          // Links without a URL yet stay in data.js but are not shown.
          const links = section.links.filter((link) => link.url);
          if (!links.length) return '';
          return `
          <div class="source-group">
            <span class="label">${esc(section.heading)}</span>
            ${links.map((link) => `<a class="source-link" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.title)}</a>`).join('')}
          </div>`;
        }).join('')}
        <p class="muted small">We group links by source type and show who is speaking, instead of rating outlets by political leaning</p>
      </section>`;
  }

  // ---------- Render ----------

  function render() {
    const story = currentStory();
    const inRound = ['gut', 'evidence', 'final', 'reveal'].includes(state.screen);
    let body = '';
    if (state.screen === 'home') body = homeScreen();
    if (state.screen === 'gut') body = gutScreen(story);
    if (state.screen === 'evidence') body = evidenceScreen(story);
    if (state.screen === 'final') body = finalScreen(story);
    if (state.screen === 'reveal') body = revealScreen(story);
    if (state.screen === 'summary') body = summaryScreen();
    if (state.screen === 'learn') body = learnScreen();
    const closeButton = '<button type="button" class="window-close" data-action="home" aria-label="Back to the start" title="Back to the start">&times;</button>';
    app.innerHTML = closeButton + (inRound ? roundHeader(story) : '') + body;
    // Wide screens lay rounds out in two columns: radio panel and story.
    app.classList.toggle('in-round', inRound);
    // The webcore title bar names the station being played.
    app.dataset.station = inRound ? story.frequency + ' FM' : DATA.city;
    window.scrollTo(0, 0);
    drawWave();
  }

  // ---------- Radio wave ----------

  // The wave's clarity follows the running score: more points, smoother
  // signal; negative points, choppier. Points are only added on the reveal,
  // so the wave holds steady through each round and then eases to its new
  // shape once that round is scored.
  const WAVE_START_NOISE = 16;
  const WAVE_NOISE_PER_POINT = 0.07;
  const WAVE_MAX_NOISE = 26;

  function scoreWave(total) {
    const noise = Math.min(WAVE_MAX_NOISE, Math.max(0, WAVE_START_NOISE - total * WAVE_NOISE_PER_POINT));
    return { amplitude: 22 - noise * 0.4, noise };
  }

  function waveTarget() {
    return scoreWave(state.results.reduce((sum, r) => sum + r.points, 0));
  }

  const wave = scoreWave(0);

  function hash(x, seed) {
    const v = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
  }

  // The wave keeps its jagged shape and slowly scrolls sideways, like an
  // oscilloscope. It never moves up and down. Its jaggedness matches the
  // current score, and a high score also gives the line a soft glow.
  const WAVE_SCROLL_SPEED = 0.35; // how far the line slides each frame (wave units, 350 = full width)
  let waveOffset = 0;
  const WAVE_GLOW_BELOW_NOISE = 10; // glow starts once the noise drops below this
  const WAVE_MAX_GLOW = 7; // glow size in pixels for a perfectly clean signal

  // Webcore only: low scores make the signal look like a weak picture on an
  // old phosphor screen. The jagged line stays jagged but softens into a
  // blur with a wide bloom. Blur fades out as the noise drops below
  // WAVE_BLUR_FROM, where the sharp line and its glow take over.
  const WAVE_BLUR_FROM = 6; // noise level where blur starts
  const WAVE_BLUR_FULL = 26; // noise level with the most blur
  const WAVE_MAX_BLUR = 1.6; // blur radius in pixels at the lowest scores
  const WAVE_MAX_BLOOM = 6; // phosphor bloom radius in pixels at the lowest scores

  function waveBlur() {
    if (document.documentElement.dataset.theme !== 'webcore') return 0;
    return Math.min(1, Math.max(0, (wave.noise - WAVE_BLUR_FROM) / (WAVE_BLUR_FULL - WAVE_BLUR_FROM)));
  }

  function drawWave() {
    const path = document.getElementById('wave-path');
    if (!path) return;
    Object.assign(wave, waveTarget());
    const points = [];
    for (let x = 0; x <= 350; x += 4) {
      // u is the point's place along the endless line; blend between fixed
      // jitter points so the jagged shape slides smoothly instead of twitching.
      const u = x + waveOffset;
      const cell = Math.floor(u / 4);
      const t = u / 4 - cell;
      const jitter = (hash(cell, 0) * (1 - t) + hash(cell + 1, 0) * t) * 2 * wave.noise;
      const y = 28 + wave.amplitude * Math.sin((2 * Math.PI * 4 * u) / 350) + jitter;
      points.push(x + ' ' + Math.min(54, Math.max(2, y)).toFixed(1));
    }
    path.setAttribute('d', 'M' + points.join(' L'));

    const stroke = getComputedStyle(path).stroke;
    const filters = [];
    const blur = waveBlur();
    if (blur > 0.02) {
      filters.push('blur(' + (blur * WAVE_MAX_BLUR).toFixed(2) + 'px)');
      filters.push('drop-shadow(0 0 ' + (blur * WAVE_MAX_BLOOM).toFixed(1) + 'px ' + stroke + ')');
    }
    const glow = Math.max(0, (WAVE_GLOW_BELOW_NOISE - wave.noise) / WAVE_GLOW_BELOW_NOISE) * WAVE_MAX_GLOW;
    if (glow > 0.3) filters.push('drop-shadow(0 0 ' + glow.toFixed(1) + 'px ' + stroke + ')');
    path.style.filter = filters.join(' ');
  }

  function scrollWave() {
    waveOffset += WAVE_SCROLL_SPEED;
    drawWave();
    window.requestAnimationFrame(scrollWave);
  }

  renderTaskbar();
  render();
  if (!reduceMotion) window.requestAnimationFrame(scrollWave);
})();

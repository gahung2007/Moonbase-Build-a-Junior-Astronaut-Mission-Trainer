const RESOURCES = [
  {
    id: 'power',
    name: 'Power',
    icon: '⚡',
    color: '#c2a243',
    max: 100,
    unit: 'units',
    note: 'Stored energy',
  },
  {
    id: 'oxygen',
    name: 'Oxygen',
    icon: '◉',
    color: '#6398a0',
    max: 100,
    unit: 'units',
    note: 'Crew life support',
  },
  {
    id: 'food',
    name: 'Food',
    icon: '✿',
    color: '#c66b43',
    max: 100,
    unit: 'packs',
    note: 'Crew meals',
  },
  {
    id: 'shield',
    name: 'Storm shelter',
    icon: '⬡',
    color: '#76866a',
    max: 100,
    unit: 'strength',
    note: 'Storm protection',
  },
];

const PLANS = [
  {
    id: 'garden',
    title: 'Tend the garden',
    icon: '🌱',
    desc: 'Grow fresh food for later meals.',
    gain: { food: 18 },
    cost: { power: 14 },
    trade: '−14 power  ·  +18 food',
  },
  {
    id: 'berm',
    title: 'Build a soil berm',
    icon: '🪨',
    desc: 'Pile lunar soil around the shelter.',
    gain: { shield: 22 },
    cost: { power: 13 },
    trade: '−13 power  ·  +22 shelter',
  },
  {
    id: 'solar',
    title: 'Aim the solar wings',
    icon: '☀️',
    desc: 'Collect more sunlight while it lasts.',
    gain: { power: 23 },
    cost: { food: 5 },
    trade: '−5 food  ·  +23 power',
  },
  {
    id: 'science',
    title: 'Run a science walk',
    icon: '🔭',
    desc: 'Collect valuable samples outside.',
    gain: { science: 1 },
    cost: { power: 17, oxygen: 9 },
    trade: '−17 power  ·  −9 oxygen  ·  +1 discovery',
  },
];

const state = {
  day: 1,
  power: 72,
  oxygen: 78,
  food: 68,
  shield: 24,
  science: 0,
  selected: null,
  ended: false,
  log: [],
};

const $ = (id) => document.getElementById(id);
const clamp = (number) => Math.max(0, Math.min(100, number));

function renderResources() {
  $('resourceGrid').innerHTML = RESOURCES.map((resource) => `
    <article class="resource-card">
      <div class="resource-top">
        <span class="resource-name">${resource.name}</span>
        <span class="resource-icon">${resource.icon}</span>
      </div>
      <div class="resource-value">
        ${Math.round(state[resource.id])}
        <span class="resource-unit">${resource.unit}</span>
      </div>
      <div class="meter">
        <div class="meter-fill"
          style="width: ${clamp(state[resource.id])}%; --resource-color: ${resource.color}">
        </div>
      </div>
      <div class="resource-note">${resource.note}</div>
    </article>
  `).join('');
}

function renderPlans() {
  $('choiceGrid').innerHTML = PLANS.map((plan) => `
    <button
      type="button"
      class="choice-card ${state.selected === plan.id ? 'selected' : ''}"
      data-plan="${plan.id}"
      aria-pressed="${state.selected === plan.id}"
    >
      <span class="choice-head">
        <span class="choice-emoji">${plan.icon}</span>
        <span class="choice-title">${plan.title}</span>
      </span>
      <span class="choice-desc">${plan.desc}</span>
      <span class="trade">${plan.trade}</span>
    </button>
  `).join('');

  document.querySelectorAll('.choice-card').forEach((button) => {
    button.addEventListener('click', () => {
      state.selected = button.dataset.plan;
      renderPlans();
      $('deployButton').disabled = false;

      const selectedPlan = PLANS.find((plan) => plan.id === state.selected);
      $('deployButton').innerHTML = `
        Confirm ${selectedPlan.title.toLowerCase()} <span>→</span>
      `;
    });
  });
}

function renderProgress() {
  $('solLabel').textContent = state.ended
    ? 'Mission finished'
    : `Sol ${state.day} of 5`;

  $('solDots').innerHTML = Array.from({ length: 5 }, (_, index) => `
    <span class="dot ${index < state.day - 1 ? 'done' : ''}"></span>
  `).join('');
}

function setSignal(title, text, alert, fact, source, url, warning = false) {
  $('signalTitle').textContent = title;
  $('signalText').textContent = text;
  $('alertChip').textContent = alert;
  $('alertChip').classList.toggle('warning', warning);
  $('factText').textContent = fact;
  $('sourceLink').textContent = `${source} ↗`;
  $('sourceLink').href = url;
}

function updateSignal() {
  if (state.day === 3 && !state.ended) {
    setSignal(
      'Solar storm watch',
      'A training alert is on the way. Your crew should spend time in the sheltered habitat when the alert arrives.',
      'Practice storm alert',
      'Solar particle events can bring extra radiation. A well-shielded shelter can help, but shielding adds mass and must be planned.',
      'NASA · Radiation protection',
      'https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation/',
      true,
    );
  } else if (state.day >= 4) {
    setSignal(
      'Long lunar night ahead',
      'Sunlight can be scarce for a long stretch. Keep enough stored power for essential equipment.',
      'Save a little power',
      'A lunar night can last about 14 Earth days at many places on the Moon. This game compresses the challenge into a few turns.',
      'NASA · Lunar day and night',
      'https://science.nasa.gov/wp-content/uploads/2024/01/lrolitho7temperaturevariation27may2014.pdf',
    );
  } else {
    setSignal(
      'A new crew, a big job',
      'Your outpost is ready. Keep an eye on power, oxygen, food, and your storm shelter. No single resource can save the mission by itself.',
      'All quiet for now',
      'This is a simplified training game. Its resource units and storm alert are invented for play; NASA links provide the real-world context.',
      'NASA DONKI · Space weather data',
      'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
    );
  }
}

function renderLog() {
  if (state.log.length === 0) {
    $('logList').innerHTML = `
      <div class="log-empty">
        Your crew's story will appear here after the first plan.
      </div>
    `;
    return;
  }

  $('logList').innerHTML = state.log
    .slice()
    .reverse()
    .map((entry) => `
      <div class="log-entry ${entry.alert ? 'alert' : ''}">
        <strong>${entry.label}</strong>
        <span>${entry.text}</span>
      </div>
    `)
    .join('');
}

function addLog(label, text, alert = false) {
  state.log.push({ label, text, alert });
  renderLog();
}

function finishMission(success, reason) {
  state.ended = true;
  renderProgress();

  $('decisionTitle').textContent = 'Mission debrief';
  $('choiceGrid').innerHTML = '';
  $('deployButton').disabled = true;
  $('deployButton').textContent = 'Mission complete';
  $('endTitle').textContent = success
    ? 'You brought your crew home!'
    : 'Mission paused for safety';
  $('endMessage').textContent = success
    ? `Your crew completed five sols with ${state.science} science ${state.science === 1 ? 'discovery' : 'discoveries'}. The biggest lesson: every resource decision changes another part of the mission.`
    : `${reason} The crew pauses the mission before supplies run out. What would you plan differently next time?`;
  $('endModal').classList.remove('hidden');
}

function deploy() {
  if (!state.selected || state.ended) {
    return;
  }

  const plan = PLANS.find((item) => item.id === state.selected);

  for (const [resource, cost] of Object.entries(plan.cost)) {
    state[resource] = clamp(state[resource] - cost);
  }

  for (const [resource, gain] of Object.entries(plan.gain)) {
    state[resource] = resource === 'science'
      ? state[resource] + gain
      : clamp(state[resource] + gain);
  }

  // The crew uses life-support supplies every sol, whatever plan they choose.
  state.power = clamp(state.power - 8);
  state.oxygen = clamp(state.oxygen - 7);
  state.food = clamp(state.food - 6);

  if (state.day === 3) {
    // Shelter strength reduces the effect of this simplified training alert.
    const protection = Math.min(18, Math.floor(state.shield * 0.45));
    const remainingRisk = Math.max(0, 18 - protection);

    addLog(
      'Storm alert',
      'A simulated solar particle event reached the outpost. Shelter helped reduce the crew’s exposure; the remaining risk is part of this training scenario.',
      true,
    );

    if (remainingRisk > 12) {
      state.oxygen = clamp(state.oxygen - 4);
    }
  }

  if (state.power <= 0 || state.oxygen <= 0 || state.food <= 0) {
    addLog(
      `Sol ${state.day}`,
      `${plan.title} chosen. The crew’s essential supplies are too low, so the mission team pauses for safety.`,
    );
    renderResources();
    finishMission(false, 'Essential supplies became too low.');
    return;
  }

  addLog(
    `Sol ${state.day}`,
    `${plan.title}: ${plan.trade}. Daily life support used 8 power, 7 oxygen, and 6 food.`,
  );

  if (state.day === 5) {
    renderResources();
    finishMission(true, '');
    return;
  }

  state.day += 1;
  state.selected = null;
  $('decisionTitle').textContent = `Choose a plan for Sol ${state.day}`;
  $('deployButton').disabled = true;
  $('deployButton').innerHTML = 'Choose a plan to continue <span>→</span>';

  renderResources();
  renderPlans();
  renderProgress();
  updateSignal();
}

function restart() {
  Object.assign(state, {
    day: 1,
    power: 72,
    oxygen: 78,
    food: 68,
    shield: 24,
    science: 0,
    selected: null,
    ended: false,
    log: [],
  });

  $('endModal').classList.add('hidden');
  $('decisionTitle').textContent = 'Choose a plan for Sol 1';
  $('deployButton').disabled = true;
  $('deployButton').innerHTML = 'Choose a plan to continue <span>→</span>';

  renderResources();
  renderPlans();
  renderProgress();
  renderLog();
  updateSignal();
}

$('deployButton').addEventListener('click', deploy);
$('restartButton').addEventListener('click', restart);
$('playAgain').addEventListener('click', restart);

renderResources();
renderPlans();
renderProgress();
renderLog();
updateSignal();

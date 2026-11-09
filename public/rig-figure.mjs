import * as k from './iso-kit.mjs';

export const WIDTH = 680;
export const HEIGHT = 390;

export const PLATE = { x: -152, y: -72, w: 304, d: 144, r: 8 };
export const PLATE_H = 12;
export const FOOT_H = 5.5;

export const MAG = { x: -136, y: -54, w: 44, d: 40, r: 3 };
export const MAG_H = 24;
export const POST = [-114, -34];
export const POST_TOP = 128;
export const CLAMP_Z = 104;

export const DIAL = [10, -8];
export const DIAL_R = 21;
export const DIAL_Z = 86;
export const DIAL_H = 10;
export const DIAL_TOP = DIAL_Z + DIAL_H;

export const RAIL_FROM = -86;
export const RAIL_TO = 138;

// 16 week blocks on the sliding carriage
export const BLOCK_COUNT = 16;
export const BLOCK_STEP = 11.5;
export const BLOCK_W = 9.8;
export const BLOCK_D = 22;
export const FIRST_BLOCK_X = -86;
export const CARRIAGE = { x: -94, y: -22, w: 200, d: 34, r: 3 };
export const CARRIAGE_Z = 3;
export const CARRIAGE_TOP = 8;
export const TIP_R = 2.4;

export const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [POST[0], POST[1], POST_TOP + 4],
    [DIAL[0] + DIAL_R, DIAL[1], DIAL_TOP + 2]
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 42, elevation: 30 }
);

const at = point => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = points =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

export function blockHeightForPct(pct) {
  return 3.2 + (Math.max(0, Math.min(100, pct)) / 100) * 19.8;
}

export function stopForWeekIndex(idx) {
  const blockCenter = FIRST_BLOCK_X + idx * BLOCK_STEP + BLOCK_W / 2;
  return DIAL[0] - blockCenter;
}

function buildPlate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  // 4 stepped feet sorted back-to-front
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7.4, -PLATE_H - FOOT_H, 1.8, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.6, -PLATE_H - FOOT_H + 1.8, FOOT_H - 1.8, P, 28), { tone: 'mid' }));
  }
  // Surface plate slab with side seam
  const plateSeam = k.sideSeam(PLATE, -4, P, 8);
  out.push(
    S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), {
      tone: 'mid',
      inner: L(plateSeam, { tone: 'faint' })
    })
  );
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));

  // 4 corner socket screws with rings
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.3, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.52 }));

  // Career Evolution stepped reference blocks on back deck (Bosch -> Bridgetek -> MessageMedia -> AWS)
  const careerTiers = [
    { label: 'ADAS', h: 5 },
    { label: 'IOT', h: 8.5 },
    { label: 'SAAS', h: 12 },
    { label: 'AWS', h: 15.5 }
  ];
  careerTiers.forEach((tier, i) => {
    const plan = { x: -58 + i * 24, y: -58, w: 20, d: 14, r: 1.5 };
    out.push(
      S(k.slabOf(plan, 0, tier.h, P, 4, 0.4), {
        tone: i === 3 ? 'hi' : 'mid',
        inner: L(k.sideSeam(plan, tier.h * 0.5, P, 4), { tone: 'faint' })
      })
    );
    out.push(L(k.planOutline(k.insetPlan(plan, 2), tier.h, P, 3), { tone: 'faint' }));
    out.push(D(k.corners(plan, 3).map(([cx, cy]) => at([cx, cy, tier.h])), { size: 0.35, tone: 'lo' }));
    out.push(
      k.faceTextSvg(k.topMatrix([plan.x + 10, plan.y + 8], tier.h, P, 'x'), tier.label, {
        size: 2.3,
        tone: i === 3 ? 'hi' : 'lo',
        anchor: 'middle'
      })
    );
  });

  // Engraved nameplate on front-left
  const platePlan = { x: -136, y: 26, w: 44, d: 22, r: 1.5 };
  out.push(S(k.slabOf(platePlan, 0, 0.9, P, 4), { tone: 'lo', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(platePlan, 1.8), 0.9, P, 3), { tone: 'faint' }));
  const npScrews = k.corners(platePlan, 3.2);
  out.push(D(npScrews.map(([x, y]) => at([x, y, 0.9])), { size: 0.38, tone: 'mid' }));
  out.push(
    k.faceTextSvg(k.topMatrix([platePlan.x + 22, platePlan.y + 8], 0.9, P, 'x'), 'DVA-C02', {
      size: 2.6,
      tone: 'hi',
      anchor: 'middle'
    })
  );
  // Three rule lines on label plate (free: true per craft.md)
  out.push(
    L(k.lineOnTop([platePlan.x + 6, platePlan.y + 13.5], [platePlan.x + 38, platePlan.y + 13.5], 0.9, P), {
      tone: 'mid',
      free: true
    }),
    L(k.lineOnTop([platePlan.x + 6, platePlan.y + 16.2], [platePlan.x + 33, platePlan.y + 16.2], 0.9, P), {
      tone: 'lo',
      free: true
    }),
    L(k.lineOnTop([platePlan.x + 6, platePlan.y + 18.8], [platePlan.x + 26, platePlan.y + 18.8], 0.9, P), {
      tone: 'lo',
      free: true
    })
  );

  // Front precision ruler strip
  const strip = { x: -84, y: PLATE.y + PLATE.d - 16, w: 222, d: 7.5, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.7, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 3.5, 4, strip.y + 0.8, 0.7, [2.0, 3.8], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
  out.push(
    D([at([strip.x + 2.2, strip.y + 3.8, 0.7]), at([strip.x + strip.w - 2.2, strip.y + 3.8, 0.7])], {
      size: 0.45
    })
  );

  return out.join('');
}

function buildRails() {
  const out = [];
  for (const y of [-22, 11]) {
    out.push(
      S(k.slabOf({ x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 4.8, r: 1 }, 0, 3, P, 3, 0.4), {
        tone: 'mid'
      })
    );
    out.push(
      D(
        [RAIL_FROM + 8, RAIL_FROM + 55, RAIL_FROM + 110, RAIL_FROM + 165, RAIL_TO - 8].map(x =>
          at([x, y + 2.4, 3])
        ),
        { size: 0.4 }
      )
    );
  }
  for (const x of [RAIL_FROM - 5, RAIL_TO]) {
    const stopPlan = { x, y: -25, w: 5, d: 44, r: 1.2 };
    out.push(
      S(k.slabOf(stopPlan, 0, 7.5, P, 3, 0.5), {
        tone: 'mid',
        inner: L(k.sideSeam(stopPlan, 3.8, P, 3), { tone: 'faint' })
      })
    );
    out.push(D([at([x + 2.5, -20, 7.5]), at([x + 2.5, 14, 7.5])], { size: 0.45 }));
  }
  return out.join('');
}

function buildFixture() {
  const out = [];
  // Stepped magnetic base with weld seam
  out.push(
    S(k.slabOf(MAG, 0, 11, P, 6, 0.8), {
      tone: 'mid',
      inner: L(k.sideSeam(MAG, 5.5, P, 6), { tone: 'faint' })
    })
  );
  const magTop = k.insetPlan(MAG, 0.8);
  out.push(S(k.slabOf(magTop, 11, MAG_H - 11, P, 6, 0.8), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(MAG, 3), MAG_H, P), { tone: 'faint' }));
  out.push(
    D(
      [
        at([MAG.x + 5, MAG.y + 5, MAG_H]),
        at([MAG.x + 5, MAG.y + MAG.d - 5, MAG_H]),
        at([MAG.x + MAG.w - 5, MAG.y + 5, MAG_H])
      ],
      { size: 0.45 }
    )
  );

  // Knurled selector knob on magnetic base (pointer ends on cylinder rim +6)
  const knob = [MAG.x + 32, MAG.y + 28];
  out.push(S(k.cylinder(knob[0], knob[1], 6, MAG_H, 4.2, P, 32), { tone: 'mid' }));
  out.push(L(k.knurl(knob[0], knob[1], 6, MAG_H, MAG_H + 4.2, 36, P), { tone: 'lo' }));
  out.push(L(k.lineOnTop([knob[0], knob[1]], [knob[0] + 6, knob[1]], MAG_H + 4.2, P), { tone: 'hi' }));
  out.push(D([at([knob[0], knob[1], MAG_H + 4.2])], { size: 0.5, tone: 'hi' }));

  // Vertical post & clamp
  out.push(S(k.cylinder(POST[0], POST[1], 5.2, MAG_H, 4, P, 28), { tone: 'mid' }));
  const clamp = { x: POST[0] - 7, y: POST[1] - 7, w: 14, d: 14, r: 2.5 };
  out.push(
    S(k.cylinder(POST[0], POST[1], 3.3, MAG_H + 4, CLAMP_Z - 4 - MAG_H - 4, P, 28), {
      tone: 'mid',
      crease: 'none'
    })
  );
  out.push(L([48, 68, 88].map(z => k.sideArc(POST[0], POST[1], 3.3, z, P, 16)).join(''), { tone: 'faint' }));
  out.push(
    S(k.slabOf(clamp, CLAMP_Z - 4, 12, P, 4, 0.6), {
      tone: 'mid',
      inner: L(k.sideSeam(clamp, CLAMP_Z + 2, P, 4), { tone: 'faint' })
    })
  );
  out.push(
    S(k.cylinder(POST[0], POST[1], 3.3, CLAMP_Z + 8, POST_TOP - CLAMP_Z - 8, P, 28), {
      tone: 'mid',
      crease: 'none'
    })
  );
  out.push(S(k.cylinder(POST[0], POST[1], 3.9, POST_TOP, 2.2, P, 28), { tone: 'mid' }));

  // Cross-arm from post clamp to dial
  const arm = {
    x: POST[0] + 7,
    y: DIAL[1] - 3,
    w: DIAL[0] - DIAL_R - POST[0] - 5,
    d: 6,
    r: 2
  };
  out.push(S(k.slabOf(arm, CLAMP_Z, 4.2, P, 4, 0.5), { tone: 'mid' }));
  out.push(
    D([at([arm.x + 5, DIAL[1], CLAMP_Z + 4.2]), at([arm.x + arm.w - 5, DIAL[1], CLAMP_Z + 4.2])], {
      size: 0.45
    })
  );

  // Clamp thumbscrew
  const thumb = [clamp.x + 7, clamp.y + clamp.d + 3];
  out.push(
    S(k.slabOf({ x: thumb[0] - 1.4, y: clamp.y + clamp.d, w: 2.8, d: 3, r: 0.8 }, CLAMP_Z + 1, 4, P, 2), {
      tone: 'mid',
      crease: 'none'
    })
  );
  out.push(S(k.cylinder(thumb[0], thumb[1] + 1.4, 2.6, CLAMP_Z, 6, P, 20), { tone: 'mid' }));
  out.push(L(k.knurl(thumb[0], thumb[1] + 1.4, 2.6, CLAMP_Z, CLAMP_Z + 6, 18, P), { tone: 'lo' }));

  return out.join('');
}

export function buildCarriage(weekProgressList) {
  const out = [
    `<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), CARRIAGE_Z, 0.1, P)}" style="filter:blur(4px)"/>`
  ];
  out.push(
    S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, P, 5, 0.6), {
      tone: 'mid',
      inner: L(k.sideSeam(CARRIAGE, CARRIAGE_Z + 2.5, P, 5), { tone: 'faint' })
    })
  );
  out.push(
    D(
      [-80, -35, 10, 55, 95].map(x => at([x, CARRIAGE.y + CARRIAGE.d - 2.4, CARRIAGE_TOP])),
      { size: 0.38, tone: 'lo' }
    )
  );
  out.push(
    L(k.lineOnTop([CARRIAGE.x, CARRIAGE.y + 4], [CARRIAGE.x + CARRIAGE.w, CARRIAGE.y + 4], CARRIAGE_TOP, P), {
      tone: 'faint'
    })
  );
  out.push(
    L(
      k.lineOnTop(
        [CARRIAGE.x, CARRIAGE.y + CARRIAGE.d - 4],
        [CARRIAGE.x + CARRIAGE.w, CARRIAGE.y + CARRIAGE.d - 4],
        CARRIAGE_TOP,
        P
      ),
      { tone: 'faint' }
    )
  );

  // 16 precision gauge blocks (1 per Week)
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const pct = weekProgressList[i] ?? 0;
    const h = blockHeightForPct(pct);
    const plan = { x: FIRST_BLOCK_X + i * BLOCK_STEP, y: -16, w: BLOCK_W, d: BLOCK_D, r: 0.9 };
    const tone = pct > 0 ? 'hi' : 'mid';
    out.push(S(k.slabOf(plan, CARRIAGE_TOP, h, P, 3, 0.35), { tone, crease: 'lo' }));
    out.push(L(k.planOutline(k.insetPlan(plan, 1.4), CARRIAGE_TOP + h, P, 2), { tone: 'faint' }));
    out.push(D([at([plan.x + BLOCK_W / 2, plan.y + BLOCK_D / 2, CARRIAGE_TOP + h])], { size: 0.32, tone: 'lo' }));
  }

  // Knurled carriage handle at front right
  const handle = [CARRIAGE.x + CARRIAGE.w - 8, CARRIAGE.y + CARRIAGE.d + 3];
  out.push(
    S(
      k.slabOf({ x: handle[0] - 2, y: CARRIAGE.y + CARRIAGE.d - 1, w: 4, d: 4, r: 1 }, CARRIAGE_Z + 1, 3, P, 2),
      { tone: 'mid', crease: 'none' }
    )
  );
  out.push(S(k.cylinder(handle[0], handle[1] + 1, 3.2, CARRIAGE_Z, 5, P, 20), { tone: 'mid' }));
  out.push(L(k.knurl(handle[0], handle[1] + 1, 3.2, CARRIAGE_Z, CARRIAGE_Z + 5, 18, P), { tone: 'lo' }));

  return out.join('');
}

function buildPlunger() {
  const out = [];
  out.push(S(k.cylinder(DIAL[0], DIAL[1], TIP_R, 0, 2.4, P, 20), { tone: 'hi', lit: true }));
  out.push(S(k.cylinder(DIAL[0], DIAL[1], 1.4, 2.4, 54, P, 16), { tone: 'hi', crease: 'none', lit: true }));
  return out.join('');
}

function buildDial() {
  const out = [];
  const [x, y] = DIAL;
  out.push(S(k.cylinder(x, y, 2.9, 56, DIAL_Z - 56, P, 20), { tone: 'mid' }));
  out.push(L(k.sideArc(x, y, 2.9, 64, P, 12), { tone: 'lo' }));
  out.push(
    S(k.slabOf({ x: x - DIAL_R - 6, y: y - 4, w: 8, d: 8, r: 1.5 }, DIAL_Z + 2, CLAMP_Z - DIAL_Z - 2, P, 3, 0.4), {
      tone: 'mid'
    })
  );
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: 'hi', crease: 'lo' }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), { tone: 'lo' }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3.4, P, 40), { tone: 'faint' }));
  out.push(L(k.ring(x, y, DIAL_R - 2.2, DIAL_TOP, P, 64), { tone: 'lo' }));

  const ticks = k.radialTicks(x, y, DIAL_R - 3, 50, 5, DIAL_TOP, [1.3, 2.8], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));

  out.push(S(k.slabOf({ x: x + DIAL_R - 1, y: y - 2.4, w: 5, d: 4.8, r: 1.2 }, DIAL_Z + 2, 5, P, 3), { tone: 'mid' }));
  out.push(
    S(k.slabOf({ x: x + DIAL_R + 3.6, y: y - 3.2, w: 2.6, d: 6.4, r: 1.2 }, DIAL_Z + 1.2, 6.6, P, 3), {
      tone: 'mid'
    })
  );
  out.push(L(k.ring(x, y, 1.6, DIAL_TOP, P, 16), { tone: 'mid' }));
  out.push(
    k.faceTextSvg(k.topMatrix([x, y + 9], DIAL_TOP, P, 'x'), '0-100%', {
      size: 2.3,
      tone: 'lo',
      anchor: 'middle'
    })
  );
  return out.join('');
}

export function needlePathForTurn(turn) {
  const angle = turn * Math.PI * 2;
  const [x, y] = DIAL;
  return k.lineOnTop(
    [x - Math.sin(angle) * 3.4, y + Math.cos(angle) * 3.4],
    [x + Math.sin(angle) * (DIAL_R - 4), y - Math.cos(angle) * (DIAL_R - 4)],
    DIAL_TOP + 0.2,
    P
  );
}

export function renderAnatomyInstrumentSvg(weekProgressList, activeWeekIndex = 5) {
  const startX = stopForWeekIndex(activeWeekIndex);
  const startH = blockHeightForPct(weekProgressList[activeWeekIndex] ?? 20);
  const turn = (weekProgressList[activeWeekIndex] ?? 20) / 100;

  return k.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    label:
      'Precision Career & AWS DVA-C02 Metrology Rig. Sixteen gauge blocks on a sliding carriage represent Weeks 1 to 16 of the DVA-C02 curriculum; the dial indicator plunger rides on the selected week block and reads out topic coverage percentage.',
    body: [
      buildPlate(),
      buildRails(),
      buildFixture(),
      `<g data-part="carriage" transform="${k.translateAlong(P, [startX, 0, 0])}">${buildCarriage(weekProgressList)}</g>`,
      `<g data-part="plunger" transform="${k.translateAlong(P, [0, 0, CARRIAGE_TOP + startH])}">${buildPlunger()}</g>`,
      buildDial(),
      `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needlePathForTurn(turn)}" style="stroke-width:1.15"/>`
    ]
  });
}

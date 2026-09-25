// Single source of truth for page content. Text follows the paper source in
// overleaf/sessions/*.tex; numbers follow Fig. 3 (task_seq) and Sec. V.
//
// Identifying data (authors, affiliations, contact, BibTeX, acknowledgment)
// lives in identity.json and is injected by vite.config.js as __IDENTITY__.
// It is null in the anonymous build (VITE_ANONYMOUS=true).

/* global __IDENTITY__ */
export const identity = __IDENTITY__
export const ANONYMOUS = identity === null

const base = import.meta.env.BASE_URL
export const imgBase = `${base}imgs`
export const videoBase = `${base}videos`

export const paper = {
  method: 'ELEVATE',
  title: 'ELEVATE: Agentic Controller Acquisition from Task Failure for Quadrupedal Manipulation',
  // `publicOnly` links are hidden in the anonymous build.
  links: [
    { label: 'arXiv', href: '#', iconClass: 'ai ai-arxiv', publicOnly: true },
    { label: 'PDF', href: '#', iconClass: 'fas fa-file-pdf' },
    { label: 'Code', href: '#', iconClass: 'fab fa-github', publicOnly: true },
    { label: 'Video', href: '#video', iconClass: 'fas fa-video' },
  ],
  abstract:
    'Quadrupedal manipulators can extend their workspace through whole-body interaction, but task-planning agents remain bounded by the capabilities of their available controllers. We present ELEVATE, a framework that uses persistent failures during task-program refinement to identify and acquire missing whole-body control capabilities. When repeated execution failures suggest a missing physical capability, a coding agent formulates and iteratively refines a reinforcement-learning problem, specifying behavior-specific rewards, curricula, and termination conditions. The resulting controller is validated, added to the capability library, and composed with existing controllers through reusable Python skills. Starting from a single pretrained loco-manipulation controller, ELEVATE autonomously acquires controllers for wall-supported elevation, supported manipulation, and wall descent across a seven-task simulation sequence. The acquired capabilities are reused on subsequent reaching and object-manipulation tasks, achieving 92%–100% success on five tasks beyond the initial controller’s workspace. Fixed-library coding agents fail on these five tasks, while ELEVATE uses additional controller-training computation to expand task coverage. Without real-robot training or fine-tuning, the acquired controllers transfer to a physical quadrupedal manipulator, achieving 18/20 successes in rack retrieval and 16/20 in floor-to-rack placement.',
}

// Simulation rollouts used by the capability-growth timeline live under
// public/videos/sim/: one ELEVATE clip per task, one per controller, and one
// per skill. Paths below are relative to videos/.
const simTask = (file) => `sim/tasks/ELEVATE/${file}`
const simController = (id) => `sim/controllers/${id}.mp4`
const simSkill = (id) => `sim/skills/${id}.mp4`

// Drop files with these names into public/videos/ and the slots fill in.
// A missing file shows a "video coming soon" placeholder instead of a broken player.
export const videos = {
  teaser: 'teaser.mp4',
  overview: 'icra_video.mp4',
  b02: 'B02_real_3x.mp4',
  b03: 'B03_real_3x.mp4',
  rackMaintenance: 'rack_maintain_10x.mp4',
  wallCleaning: 'wall_clean_10x.mp4',
  pegInsertion: 'peg_insert.mp4',
}

// Additional real-robot demonstrations, one row each, in "More Real-Robot Demonstrations".
export const demos = [
  {
    id: 'rack-maintenance',
    tag: 'Long-horizon task',
    title: 'Rack maintenance',
    video: videos.rackMaintenance,
    videoLabel: 'Rack maintenance on the physical robot',
    paragraphs: [
      'The robot is asked to place the soda can into the cardboard box and the water bottles on the rack, moving objects back and forth between the rack and the ground. Completing the whole sequence demonstrates that the learned controllers and skills can be composed to solve a long-horizon task.',
    ],
  },
  {
    id: 'wall-cleaning',
    tag: 'Enlarged workspace',
    title: 'Wall cleaning',
    video: videos.wallCleaning,
    videoLabel: 'Wall cleaning on the physical robot',
    paragraphs: [
      'The robot picks up a towel from the floor and uses it to wipe the wall. The task program calls all three high-level skills: floor_pickup to grab the towel, wall_high_reach to wipe targets above the reach of the floor-supported controller, and floor_recover to return to the floor. This demo shows the workspace enlarged by the learned skills and controllers.',
    ],
  },
  {
    id: 'peg-insertion',
    tag: 'Insertion precision',
    title: 'Peg insertion',
    video: videos.pegInsertion,
    videoLabel: 'Peg insertion on the physical robot',
    paragraphs: [
      'The robot is commanded to insert a peg into a hole on the wall. The hole position is estimated from AprilTags, and the approach is closed under visual servoing: the wrist camera keeps re-estimating the hole position and corrects the end effector until the peg is aligned. The demonstration shows the insertion precision the system reaches with this feedback in the loop.',
    ],
  },
]

// Real-robot experiments shown one at a time in the "Zero-Shot Transfer to the Physical Robot" section.
export const realExperiments = [
  {
    id: 'b02',
    code: 'B02',
    title: 'Rack retrieval',
    score: '18/20',
    video: videos.b02,
    videoLabel: 'B02 rack retrieval on the physical robot',
    storyboard: 'real_b02_storyboard.png',
    storyboardAlt: 'B02 storyboard with active skills and controllers',
    caption:
      'Retrieve a bottle from the 1.2 m rack and return to a four-foot stance while keeping hold of it. Bands show the active skill and controller. The two failures come from limited gripper contact that lets the bottle slip during floor recovery.',
  },
  {
    id: 'b03',
    code: 'B03',
    title: 'Floor-to-rack placement',
    score: '16/20',
    video: videos.b03,
    videoLabel: 'B03 floor-to-rack placement on the physical robot',
    storyboard: 'real_b03_storyboard.png',
    storyboardAlt: 'B03 storyboard with active skills and controllers',
    caption:
      'Pick a bottle up from the floor and place it upright on the rack. Failures mainly arise from unintended gripper contact during floor pickup.',
  },
]

export const methods = [
  { id: 'elevate', label: 'ELEVATE (Ours)', short: 'ELEVATE', colorVar: '--series-1' },
  { id: 'aspire', label: 'ASPIRE', short: 'ASPIRE', colorVar: '--series-2' },
  { id: 'cap', label: 'Code-as-Policy', short: 'CaP', colorVar: '--series-3' },
]

export const trialsPerTask = 50

export const controllers = [
  {
    id: 'loco_manipulation',
    kind: 'controller',
    video: simController('loco_manipulation'),
    initial: true,
    summary: 'Pretrained loco-manipulation: base velocity, 6D end-effector pose, and gripper commands.',
  },
  {
    id: 'wall_stand',
    kind: 'controller',
    video: simController('wall_stand'),
    loop: [0, 2], // seconds: replay only the stand-up itself
    acquiredAt: 'A02',
    summary: 'Body reconfiguration: raise the arm mount by placing the front feet on the wall.',
  },
  {
    id: 'wall_reach',
    kind: 'controller',
    video: simController('wall_reach'),
    acquiredAt: 'A02',
    summary: 'Supported manipulation: track end-effector targets from the wall-supported stance.',
  },
  {
    id: 'wall_descent',
    kind: 'controller',
    video: simController('wall_descent'),
    loop: [0, 2], // seconds: replay only the descent itself
    acquiredAt: 'A04',
    summary: 'Body reconfiguration: return from the wall stance to a four-foot stance.',
  },
]

export const skills = [
  {
    id: 'floor_pickup',
    kind: 'skill',
    video: simSkill('floor_pickup'),
    initial: true,
    summary: 'Locate an object from depth and segmentation, then pick it up from the floor.',
  },
  {
    id: 'wall_high_reach',
    kind: 'skill',
    video: simSkill('wall_high_reach'),
    loop: [5, null],
    acquiredAt: 'A02',
    summary: 'Approach the wall, raise the body with wall_stand, and reach the target with wall_reach.',
  },
  {
    id: 'floor_recover',
    kind: 'skill',
    video: simSkill('floor_recover'),
    loop: [11, 14],
    acquiredAt: 'A04',
    summary: 'Descend from the wall stance back to the floor while retaining a held object.',
  },
]

export const capabilities = [...controllers, ...skills]

// "Different Environments, Different Strategies": the same A02 task solved in
// the default environment (wall support) and with a box added (box support).
// Each variant lists the controllers the agent trained in that run.
export const strategies = {
  intro:
    'ELEVATE does not learn one fixed way to solve a task. Given the same A02 objective, reach a target 1.25 m above the floor, the agent diagnoses the missing capability from its failures and trains whatever the environment affords. Both runs below start from the same pretrained loco-manipulation controller and the same task-program loop.',
  variants: [
    {
      id: 'wall',
      title: 'Default environment',
      tag: 'Wall support',
      video: simTask('A02.mp4'),
      videoLabel: 'A02 solved with wall support',
      caption:
        'The only support in the default environment is the wall. The agent trains wall_stand to raise the body with the front feet on the wall and wall_reach to track targets from that stance, then composes them into the wall_high_reach skill.',
      controllers: [
        { id: 'wall_stand', video: simController('wall_stand'), loop: [0, 2] },
        { id: 'wall_reach', video: simController('wall_reach') },
      ],
    },
    {
      id: 'box',
      title: 'Box environment',
      tag: 'Box support',
      video: simTask('A02_box.mp4'),
      videoLabel: 'A02 solved with box support',
      caption:
        'With a box placed in the environment, the same failure-driven process instead learns box_stand to raise the body with the box as support and box_reach to manipulate from that stance, reaching the target without using the wall.',
      controllers: [
        { id: 'box_stand', video: simController('box_stand'), loop: [0, 2] },
        { id: 'box_reach', video: simController('box_reach') },
      ],
    },
  ],
}

// "How the Agent Refines a Controller": wall_stand after each round of the
// agent's own reward revision. `changes` are the training changes the agent
// made at that stage (kind: add / remove / tune); `outcome` is what the
// resulting controller does.
export const refinement = {
  intro:
    'When a task keeps failing, the agent does not just retry the program. It formulates a reinforcement-learning problem for the missing capability, watches how the trained controller behaves, and revises the rewards and training aids itself. wall_stand shows this loop: each stage below is the controller after one round of revision.',
  stages: [
    {
      id: 'initial',
      label: 'Initial formulation',
      video: simController('wall_stand_initial'),
      loop: [0, 2],
      changes: [{ kind: 'add', text: 'Reward for reaching the target pose, from the reusable training template' }],
      outcome: 'Fails to reach the desired position.',
      outcomeKind: 'fail',
    },
    {
      id: 'mid',
      label: 'Reward revision',
      video: simController('wall_stand_mid'),
      loop: [0, 2],
      changes: [
        { kind: 'add', text: 'Reward for raising the body height' },
        { kind: 'add', text: 'Reward for placing the front feet on the wall while the rear feet stay on the floor' },
        { kind: 'add', text: 'Upward assist force on the body to help it rise during training' },
      ],
      outcome: 'Raises the body onto the wall, still helped by the assist force.',
      outcomeKind: 'partial',
    },
    {
      id: 'final',
      label: 'Refinement',
      video: simController('wall_stand'),
      loop: [0, 2],
      changes: [
        { kind: 'tune', text: 'Reward terms rebalanced' },
        { kind: 'remove', text: 'Assist force gradually removed' },
      ],
      outcome: 'A usable wall_stand controller that stands on the wall unaided.',
      outcomeKind: 'success',
    },
  ],
}

// Every controller/skill name that prose should render as inline code.
export const identifiers = [
  ...capabilities.map((c) => c.id),
  ...strategies.variants.flatMap((v) => v.controllers.map((c) => c.id)),
]

// usage: 'acquired' = diamond, 'used' = filled circle. Capabilities that exist
// but are not listed are drawn as "retained" (gray line). Not-yet-existing
// capabilities are blank.
export const tasks = [
  {
    id: 'A01',
    family: 'Reaching',
    short: 'Floor-level target',
    video: simTask('A01.mp4'),
    loop: [8, null], // seconds: replay from 8 s to the end of the clip
    objective: 'Reach a random floor-level target.',
    success: { elevate: 49, aspire: 50, cap: 43 },
    usage: { loco_manipulation: 'used' },
    story:
      'The pretrained loco-manipulation controller is enough. All three methods solve the task from the initial library.',
    note: '',
  },
  {
    id: 'A02',
    family: 'Reaching',
    short: 'High wall target',
    video: simTask('A02.mp4'),
    loop: [9, null],
    objective: 'Reach a target 1.25 m above the floor, 0.30 m from the wall.',
    success: { elevate: 50, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'acquired',
      wall_reach: 'acquired',
      wall_high_reach: 'acquired',
    },
    story:
      'With only the loco-manipulation controller, repeated development sweeps yield 0/15 successes. The agent diagnoses insufficient arm-base elevation, then trains wall_stand to raise the body with front-foot wall support and wall_reach to track targets from that stance. It composes both into the wall_high_reach skill.',
    note: 'Both controllers are formulated, trained, revised, and validated by the agent without human intervention.',
  },
  {
    id: 'A03',
    family: 'Reaching',
    short: 'Three waypoints',
    video: simTask('A03.mp4'),
    loop: [3, null],
    objective: 'Reach three elevated waypoints in order.',
    success: { elevate: 48, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'used',
      wall_reach: 'used',
      wall_high_reach: 'used',
    },
    story:
      'The two controllers acquired on A02 are reused unchanged. The first task-program candidate passes both development sweeps by adapting wall_high_reach to visit three waypoints, with no further controller training or program repairs.',
    note: '',
  },
  {
    id: 'A04',
    family: 'Reaching',
    short: 'High, then low',
    video: simTask('A04.mp4'),
    loop: [9, null],
    objective: 'Reach targets at 1.25 m then 0.40 m in the same wall column.',
    success: { elevate: 46, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'used',
      wall_reach: 'used',
      wall_descent: 'acquired',
      wall_high_reach: 'used',
      floor_recover: 'acquired',
    },
    story:
      'Reaching the low target after the high one requires leaving the wall stance. The agent acquires a wall_descent controller and wraps it in a floor_recover skill, expanding the library to four controllers.',
    note: '',
  },
  {
    id: 'B01',
    family: 'Manipulation',
    short: 'Floor pickup',
    video: simTask('B01/run_002-third-person-camera-step-0.mp4'),
    objective: 'Lift a floor bottle or soda can at least 0.30 m above the floor.',
    success: { elevate: 50, aspire: 50, cap: 50 },
    usage: { loco_manipulation: 'used', floor_pickup: 'used' },
    story:
      'The predefined floor_pickup skill combines with the initial loco-manipulation controller. All three methods reach 50/50 on bottles and soda cans.',
    note: 'No new controllers are trained in B01, B02, or B03.',
  },
  {
    id: 'B02',
    family: 'Manipulation',
    short: 'Rack retrieval',
    video: simTask('B02/B02-third-person-camera-step-0.mp4'),
    loop: [5, null],
    objective: 'Retrieve a bottle from a 1.2 m-high rack; retain it with all four feet on the floor.',
    success: { elevate: 50, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'used',
      wall_reach: 'used',
      wall_descent: 'used',
      wall_high_reach: 'used',
      floor_recover: 'used',
    },
    story:
      'wall_high_reach lifts the robot to the rack for the grasp, then floor_recover brings it back to a four-foot stance while it keeps hold of the bottle. Every controller in the library is exercised in one program.',
    note: 'Also deployed zero-shot on the physical robot: 18/20 successes.',
  },
  {
    id: 'B03',
    family: 'Manipulation',
    short: 'Rack placement',
    video: simTask('B03/B03-third-person-camera-step-0.mp4'),
    objective: 'Pick up a floor bottle and place it on the rack; the released bottle remains upright on the shelf.',
    success: { elevate: 47, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'used',
      wall_reach: 'used',
      floor_pickup: 'used',
      wall_high_reach: 'used',
    },
    story:
      'floor_pickup lifts the bottle from the floor, then wall_high_reach transports and places it on the rack. The acquired reaching capability transfers from targets to object placement.',
    note: 'Also deployed zero-shot on the physical robot: 16/20 successes.',
  },
]

export const taskIndex = Object.fromEntries(tasks.map((task, index) => [task.id, index]))

// State of a capability at a given task column.
export function capabilityState(capability, taskPosition) {
  const task = tasks[taskPosition]
  const explicit = task.usage[capability.id]
  if (explicit) return explicit
  const bornAt = capability.initial ? -1 : taskIndex[capability.acquiredAt]
  return bornAt < taskPosition ? 'retained' : 'absent'
}

export const totals = methods.map((method) => {
  const successes = tasks.reduce((sum, task) => sum + task.success[method.id], 0)
  const trials = tasks.length * trialsPerTask
  return { ...method, successes, trials, rate: (100 * successes) / trials }
})

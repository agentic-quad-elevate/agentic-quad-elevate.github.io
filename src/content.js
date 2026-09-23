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
  title: 'ELEVATE: Agentic Learning of Missing Capabilities for Quadrupedal Manipulation',
  venue: 'Submitted to ICRA 2027',
  // `publicOnly` links are hidden in the anonymous build.
  links: [
    { label: 'arXiv', href: '#', iconClass: 'ai ai-arxiv', publicOnly: true },
    { label: 'PDF', href: '#', iconClass: 'fas fa-file-pdf' },
    { label: 'Code', href: '#', iconClass: 'fab fa-github', publicOnly: true },
    { label: 'Video', href: '#video', iconClass: 'fas fa-video' },
  ],
  abstract:
    'Quadrupedal manipulators can extend their workspace through whole-body interaction, but task-planning agents remain bounded by the capabilities of their available controllers. We present ELEVATE, a framework that connects persistent task-execution failures to the acquisition of new learned controllers. A coding agent first attempts to solve each task with its current capabilities. When execution feedback indicates a capability gap, the agent constructs a reinforcement-learning problem from a reusable training template, then trains and validates a new controller. Learned controllers and reusable Python skills are retained for subsequent tasks. Starting from a pretrained loco-manipulation controller, the agent acquires wall-elevated, wall-supported manipulation, and floor-recovery controllers across seven simulation tasks. ELEVATE achieves 97.1% success over 350 final evaluation trials, compared with 28.6% for ASPIRE using a fixed library of learned controllers. Without real-robot fine-tuning, the transferred controllers achieve 18/20 successes on rack retrieval and 16/20 on floor-to-rack placement with a physical quadrupedal manipulator.',
}

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
      'The robot places a soda can into a cardboard box, then picks up a water bottle and places it on the rack.',
      'The task program chains two pick-and-place subtasks with different objects and destinations, so the robot has to locate, grasp, carry, and release twice in a row. Finishing the whole sequence shows that the composed skills hold up over a long horizon.',
    ],
  },
  {
    id: 'wall-cleaning',
    tag: 'Enlarged workspace',
    title: 'Wall cleaning',
    video: videos.wallCleaning,
    videoLabel: 'Wall cleaning on the physical robot',
    paragraphs: [
      'The robot picks up a towel from the floor and uses it to wipe the wall.',
      'The wiping targets lie above the reach of the floor-supported controller. The task program calls the learned wall_stand and wall_reach controllers to raise the body against the wall and track the towel along it, so the workspace gained for the rack tasks carries over to a new job.',
    ],
  },
  {
    id: 'peg-insertion',
    tag: 'Insertion precision',
    title: 'Peg insertion',
    video: videos.pegInsertion,
    videoLabel: 'Peg insertion on the physical robot',
    paragraphs: [
      'The robot is commanded to insert a peg into a hole on the wall.',
      'The hole is only slightly wider than the peg, so the approach is closed under visual servoing: the wrist camera keeps re-estimating the hole position and the end effector is corrected until the peg is aligned. The demonstration shows the insertion precision the system reaches with this feedback in the loop.',
    ],
  },
]

// Real-robot experiments shown one at a time in the "Real Experiments" section.
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
    initial: true,
    summary: 'Pretrained loco-manipulation: base velocity, 6D end-effector pose, and gripper commands.',
  },
  {
    id: 'wall_stand',
    kind: 'controller',
    acquiredAt: 'A02',
    summary: 'Body reconfiguration: raise the arm mount by placing the front feet on the wall.',
  },
  {
    id: 'wall_reach',
    kind: 'controller',
    acquiredAt: 'A02',
    summary: 'Supported manipulation: track end-effector targets from the wall-supported stance.',
  },
  {
    id: 'wall_descent',
    kind: 'controller',
    acquiredAt: 'A04',
    summary: 'Body reconfiguration: return from the wall stance to a four-foot stance.',
  },
]

export const skills = [
  {
    id: 'pickup_object',
    kind: 'skill',
    initial: true,
    summary: 'Locate an object from depth and segmentation, then pick it up from the floor.',
  },
  {
    id: 'wall_high_reach',
    kind: 'skill',
    acquiredAt: 'A02',
    summary: 'Approach the wall, raise the body with wall_stand, and reach the target with wall_reach.',
  },
  {
    id: 'floor_recover',
    kind: 'skill',
    acquiredAt: 'A04',
    summary: 'Descend from the wall stance back to the floor while retaining a held object.',
  },
]

export const capabilities = [...controllers, ...skills]

// usage: 'acquired' = diamond, 'used' = filled circle. Capabilities that exist
// but are not listed are drawn as "retained" (gray line). Not-yet-existing
// capabilities are blank.
export const tasks = [
  {
    id: 'A01',
    family: 'Reaching',
    short: 'Floor-level target',
    objective: 'Reach a random floor-level target.',
    success: { elevate: 49, aspire: 50, cap: 43 },
    usage: { loco_manipulation: 'used' },
    story:
      'The pretrained loco-manipulation controller is enough. All three methods solve the task from the initial library.',
    note: 'The single ELEVATE failure meets the position tolerance but has 0.242 rad orientation error.',
  },
  {
    id: 'A02',
    family: 'Reaching',
    short: 'High wall target',
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
    note: 'The two failures stop at the program deadline before completing the second or third waypoint dwell.',
  },
  {
    id: 'A04',
    family: 'Reaching',
    short: 'High, then low',
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
    note: 'The four failures are incomplete target dwells at the stage deadlines, two at the high target and two at the low target.',
  },
  {
    id: 'B01',
    family: 'Manipulation',
    short: 'Floor pickup',
    objective: 'Lift a floor bottle or soda can at least 0.30 m above the floor.',
    success: { elevate: 50, aspire: 50, cap: 50 },
    usage: { loco_manipulation: 'used', pickup_object: 'used' },
    story:
      'The predefined search and pickup skills combine with the initial loco-manipulation controller. All three methods reach 50/50 on bottles and soda cans.',
    note: 'No new controllers are trained in B01, B02, or B03.',
  },
  {
    id: 'B02',
    family: 'Manipulation',
    short: 'Rack retrieval',
    objective: 'Retrieve a bottle from a 1.2 m-high rack; retain it with all four feet on the floor.',
    success: { elevate: 50, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'used',
      wall_reach: 'used',
      wall_descent: 'used',
      pickup_object: 'used',
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
    objective: 'Pick up a floor bottle and place it on the rack; the released bottle remains upright on the shelf.',
    success: { elevate: 47, aspire: 0, cap: 0 },
    usage: {
      loco_manipulation: 'used',
      wall_stand: 'used',
      wall_reach: 'used',
      pickup_object: 'used',
      wall_high_reach: 'used',
    },
    story:
      'Floor pickup with the initial skill, then the elevated-reaching skill to transport and place the bottle on the rack. The acquired reaching capability transfers from targets to object placement.',
    note: 'In the three failures, two bottles fall onto the rack and one falls to the ground during placement. Physical deployment: 16/20 successes.',
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

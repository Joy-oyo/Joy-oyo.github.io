/**
 * Knowledge systems for the cosmos — ported from the Reading Collection's
 * Knowledge Playground. These sit in the business half; humanities stars
 * come from the humanities shelf itself.
 */
export type KnowledgeSystem = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  idea: string;
  summary: string;
  steps: [title: string, body: string][];
  note: string;
};

export const knowledgeSystems: KnowledgeSystem[] = [
  {
    id: "lean",
    index: "01 / Philosophy",
    kicker: "Operational philosophy",
    title: "Lean thinking",
    idea: "Five principles for value and flow",
    summary:
      "Create more customer value with less waste by improving the flow of work across the whole system.",
    steps: [
      ["Specify value", "Define value from the customer’s point of view."],
      ["Map the value stream", "Expose every step and remove work that does not create value."],
      ["Create flow", "Make the remaining work move continuously without interruption."],
      ["Establish pull", "Produce in response to real downstream demand."],
      ["Pursue perfection", "Repeat improvement as waste becomes visible."],
    ],
    note: "Core lens: value, waste, flow, pull, and continuous improvement.",
  },
  {
    id: "six-sigma",
    index: "02 / Method",
    kicker: "Variation-reduction method",
    title: "Six Sigma · DMAIC",
    idea: "DMAIC, CTQs, capability, and control",
    summary:
      "Improve an existing process by defining the customer-critical problem, measuring performance, proving causes, improving the process, and controlling the gain.",
    steps: [
      ["Define", "Clarify the problem, scope, customers, CTQs, goals, and high-level SIPOC."],
      ["Measure", "Validate the measurement system and baseline defects, DPMO, yield, and Cp/Cpk."],
      ["Analyze", "Use process data to verify root causes with Pareto analysis, tests, regression, or cause maps."],
      ["Improve", "Pilot solutions, reduce critical sources of variation, and test settings with DOE when useful."],
      ["Control", "Hold the gain through control plans, SPC charts, ownership, and defined response actions."],
    ],
    note: "Specifics: VOC → CTQ; MSA before trusting data; capability for specification fit; control charts for process stability.",
  },
  {
    id: "toc",
    index: "03 / Flow",
    kicker: "System-flow method",
    title: "Theory of Constraints",
    idea: "Improve the system through its limiting factor",
    summary:
      "Improve total system throughput by finding and managing the one constraint that currently limits the goal.",
    steps: [
      ["Identify", "Find the current system constraint."],
      ["Exploit", "Use the constraint fully without major investment."],
      ["Subordinate", "Align other work to the pace and needs of the constraint."],
      ["Elevate", "Increase constraint capacity when exploitation is insufficient."],
      ["Repeat", "Return to step one when the constraint moves."],
    ],
    note: "Core measures: throughput, inventory, and operating expense—not local efficiency in isolation.",
  },
  {
    id: "pdca",
    index: "04 / Learning",
    kicker: "Learning cycle",
    title: "PDCA cycle",
    idea: "Iterative learning and standardization",
    summary:
      "Treat improvement as a repeatable learning cycle that tests a change, studies what happened, and turns learning into the next standard.",
    steps: [
      ["Plan", "Understand the condition, define the aim, form a hypothesis, and design the test."],
      ["Do", "Run the change at a controlled scale and record observations."],
      ["Check", "Compare results with the prediction and explain the gap."],
      ["Act", "Standardize a successful change or revise the theory and begin again."],
    ],
    note: "PDCA is not a one-time project sequence; each cycle should improve both the process and the team’s knowledge.",
  },
];

export const businessIdeas = ["Value", "Flow", "Variation", "Capability", "Constraint", "Control"];

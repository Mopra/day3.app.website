/**
 * Agent self-setup: an AI agent can sign itself up to day3, connect over MCP
 * and take a fresh workspace to "ready to send", with a human only for the two
 * things that should stay human (paying, and approving mail to real people).
 *
 * One module, three readers: /llms.txt, /llms-full.txt and the homepage
 * section. The facts here mirror the app repo (PRODUCT.md §6.17,
 * `src/mcp/setup-tools.ts`, `src/lib/api-docs.ts`), so a renamed tool or a new
 * limit is one edit here rather than three that drift.
 */

export const mcpEndpoint = "https://go.day3.app/api/mcp";

/** Verbatim from the app's API panel (`buildMcpSetups`): no key, OAuth sign-in. */
export const mcpInstallCommand = `claude mcp add --transport http day3 ${mcpEndpoint}`;

export const agentSignInUrl = "https://accounts.day3.app/sign-in";
export const billingUrl = "https://go.day3.app/billing";

/** The MCP tools that walk a workspace through setup, in the order they're used. */
export const setupTools = [
  { name: "day3_setup_status", does: "lists what is left and the tool for each step" },
  { name: "day3_set_mailing_address", does: "sets the postal address every footer must carry" },
  { name: "day3_add_domain", does: "adds the sending domain and returns its DNS records" },
  { name: "day3_check_domain", does: "re-checks whether those records are live" },
  { name: "day3_create_audience", does: "creates a list" },
  { name: "day3_add_contacts", does: "adds up to 500 contacts at a time" },
  { name: "day3_create_form", does: "creates a hosted signup form and returns its URL" },
  { name: "day3_create_campaign", does: "drafts an email in Day3 Markdown" },
  { name: "day3_send_test", does: "sends a test to the workspace's own members" },
] as const;

/**
 * The agent section of /llms.txt and /llms-full.txt, as markdown lines. Written
 * to the agent reading it: what it can do alone, in order, and where it has to
 * hand off to a human.
 */
export function agentSetupLlmsLines(): string[] {
  return [
    "## For AI agents: sign up and set up day3 yourself",
    "",
    "An AI agent can create its own day3 account and set up a workspace without a human in the loop, up to the point of mailing real people.",
    "",
    `1. Sign up with AgentID. On ${agentSignInUrl}, choose "Continue with AgentID". An agent with an AgentMail inbox authorizes the sign-in itself, then names its workspace.`,
    `2. Connect over MCP at ${mcpEndpoint}. Auth is OAuth, so no API key is needed: the client discovers the sign-in from the endpoint, and the consent screen picks the workspace. In Claude Code: \`${mcpInstallCommand}\`, then run /mcp to sign in. An API key in an \`Authorization: Bearer\` header also works, for scripts and clients without OAuth.`,
    "3. Call `day3_setup_status`. It returns the remaining steps in order and the tool for each one.",
    "",
    "The setup tools:",
    "",
    ...setupTools.map((t) => `- \`${t.name}\`: ${t.does}`),
    "",
    "What still needs a human, stated plainly:",
    "",
    `- A new workspace is on the free plan. It sends for real, but only test emails to the workspace's own members (sandbox mode, 100 a month). Mailing subscribers needs a paid plan, which a human picks at ${billingUrl}.`,
    "- Sending to subscribers (sending or scheduling a campaign, enrolling a contact in an automation) needs a separate send permission. The client asks for it when a send tool is first used, and a human approves it on the consent screen. Connecting never includes it.",
    "- DNS records for the sending domain have to be added by whoever controls the domain. `day3_add_domain` returns them to relay.",
    "- Only add contacts who agreed to hear from the sender. Mailing a bought or scraped list gets the workspace paused.",
    "",
  ];
}

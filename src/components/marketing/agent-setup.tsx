import * as React from "react";
import { Bot, Globe, Mail, PenLine, Users } from "lucide-react";

import { Container } from "@/components/marketing/container";
import { CodeCard } from "@/components/marketing/code-card";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { mcpInstallCommand } from "@/lib/agent-setup";

/**
 * "Let your AI agent set it up."
 *
 * Written for the human who owns the agent, not for the agent: agents read
 * /llms.txt, which carries the same facts in their order of operations. The
 * job here is to make one claim believable (hand the setup to your agent) and
 * to say in the same breath where it stops, because a reader who assumes an
 * agent can now mail their whole list unattended would be right to walk away.
 *
 * The command is the app's own, read from `src/lib/agent-setup.ts`.
 */
const agentDoes = [
  { Icon: Bot, title: "Signs itself up", body: "With its own AgentID, no shared password." },
  { Icon: Globe, title: "Adds your domain", body: "And hands you the DNS records to publish." },
  { Icon: Users, title: "Imports your contacts", body: "Or builds a signup form to start a list." },
  { Icon: PenLine, title: "Drafts the first email", body: "Then sends you a test to read." },
];

function AgentSetup() {
  return (
    <section id="agents" className="scroll-mt-20 border-t border-border">
      <Container className="py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="AI agents"
              title="Let your AI agent set it up."
              description="Give your agent one line and it can open a day3 account and get it ready to send, while you do something else."
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {agentDoes.map(({ Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-caramel" />
                  <div>
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <CodeCard
              label="Give your agent this line"
              code={mcpInstallCommand}
              note="No API key. Your agent signs in, or you do, in the browser."
            />
            <div className="mt-8 flex gap-3 rounded-xl border border-border bg-oat/30 p-5">
              <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <p className="leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">You stay in charge of sending.</span>{" "}
                Until you pick a plan, it can only send tests to your own team. Mailing
                your subscribers also needs you to approve it, once, on a sign-in screen.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export { AgentSetup };

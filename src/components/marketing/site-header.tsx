"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { Logo } from "@/components/marketing/logo";
import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="day3 home"
          >
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              render={<a href={siteConfig.loginUrl} />}
            >
              Log in
            </Button>
            <Button size="sm" render={<a href={siteConfig.signupUrl} />}>
              Sign up
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground outline-none hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="py-4">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="outline"
                render={<a href={siteConfig.loginUrl} />}
              >
                Log in
              </Button>
              <Button render={<a href={siteConfig.signupUrl} />}>
                Sign up
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

export { SiteHeader };

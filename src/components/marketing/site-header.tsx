"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ChevronDown, Menu, X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { Logo } from "@/components/marketing/logo";
import { siteConfig } from "@/lib/site";
import { featurePages } from "@/lib/features-content";
import { comparePages } from "@/lib/compare-content";
import { cn } from "@/lib/utils";

type NavChild = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

/**
 * Primary navigation. Features and Compare are dropdowns whose children are
 * derived from the same content arrays that power their hub and detail pages,
 * so the menu can never drift out of sync with the pages that actually exist.
 */
const primaryNav: NavItem[] = [
  { label: "How it works", href: "/how-it-works" },
  {
    label: "Features",
    href: "/features",
    children: featurePages.map((page) => ({
      label: page.navLabel,
      href: `/features/${page.slug}`,
      description: page.summary,
      icon: page.icon,
    })),
  },
  {
    label: "Compare",
    href: "/compare",
    children: comparePages.map((page) => ({
      label: `vs ${page.competitor}`,
      href: `/compare/${page.slug}`,
    })),
  },
  { label: "Pricing", href: "/pricing" },
];

const triggerClasses =
  "group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[popup-open]:text-foreground";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname() ?? "/";

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
          <NavigationMenu.Root
            aria-label="Primary"
            className="hidden md:block"
          >
            <NavigationMenu.List className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <NavigationMenu.Item key={item.href}>
                  {item.children ? (
                    <>
                      <NavigationMenu.Trigger
                        className={cn(
                          triggerClasses,
                          isActive(pathname, item.href) && "text-foreground",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className="size-4 transition-transform duration-200 group-data-[popup-open]:rotate-180"
                          aria-hidden
                        />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="p-2">
                        <DropdownPanel
                          hub={item}
                          pathname={pathname}
                        />
                      </NavigationMenu.Content>
                    </>
                  ) : (
                    <NavigationMenu.Link
                      active={isActive(pathname, item.href)}
                      render={<Link href={item.href} />}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active]:text-foreground",
                      )}
                    >
                      {item.label}
                    </NavigationMenu.Link>
                  )}
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>

            <NavigationMenu.Portal>
              <NavigationMenu.Positioner
                sideOffset={10}
                collisionPadding={16}
                className="z-50 box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-200 ease-out"
              >
                <NavigationMenu.Popup className="relative h-[var(--popup-height)] w-[var(--popup-width)] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl transition-[width,height,opacity,transform] duration-200 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                  <NavigationMenu.Viewport className="relative h-full w-full" />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>

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
            {primaryNav.map((item) =>
              item.children ? (
                <MobileSection
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ),
            )}
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

/** The desktop dropdown body shared by Features and Compare. */
function DropdownPanel({
  hub,
  pathname,
}: {
  hub: NavItem;
  pathname: string;
}) {
  const children = hub.children ?? [];
  // Features carry icons + descriptions and read best as a two-column grid;
  // Compare is a tighter single column of competitor names.
  const rich = children.some((child) => child.description);

  return (
    <div className={cn(rich ? "w-[34rem]" : "w-64")}>
      <ul
        className={cn(
          "grid gap-1",
          rich ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {children.map((child) => {
          const Icon = child.icon;
          return (
            <li key={child.href}>
              <NavigationMenu.Link
                active={isActive(pathname, child.href)}
                render={<Link href={child.href} />}
                className="group flex gap-3 rounded-lg p-3 text-left outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring data-[active]:bg-secondary/60"
              >
                {Icon ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {child.label}
                  </span>
                  {child.description ? (
                    <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                      {child.description}
                    </span>
                  ) : null}
                </span>
              </NavigationMenu.Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-1 border-t border-border pt-1">
        <NavigationMenu.Link
          render={<Link href={hub.href} />}
          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-accent outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring"
        >
          See all {hub.label.toLowerCase()}
          <ChevronDown className="size-4 -rotate-90" aria-hidden />
        </NavigationMenu.Link>
      </div>
    </div>
  );
}

/** A collapsible section for the mobile menu (Features / Compare). */
function MobileSection({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = React.useState(() =>
    isActive(pathname, item.href),
  );
  const children = item.children ?? [];

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex-1 rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>
      {expanded ? (
        <ul className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
          {children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { SiteHeader };

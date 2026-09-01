import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store";
import { useLogoutAction } from "../../features/auth/useLogoutAction";
import { ThemeToggle } from "./theme-toggle";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Sidebar() {
  const logout = useLogoutAction();
  const permissions = useAuthStore((state) => state.permissions);

  const sections = [
    {
      title: "Sistema",
      items: [
        { kind: "link" as const, label: "Dashboard", to: "/app/dashboard" },
        ...(permissions.includes("core.plugin.runtime.read") || permissions.includes("core.plugin.manage")
          ? [{ kind: "link" as const, label: "Plugins", to: "/app/plugins" }]
          : []),
      ],
    },
    ...(permissions.includes("core.users.read") ||
    permissions.includes("core.roles.read") ||
    permissions.includes("core.roles.manage") ||
    permissions.includes("core.branches.read") ||
    permissions.includes("core.branches.manage")
      ? [
          {
            title: "Ajustes",
            items: [
              ...(permissions.includes("core.users.read")
                ? [{ kind: "link" as const, label: "Usuarios", to: "/app/settings/users" }]
                : []),
              ...(permissions.includes("core.roles.read") || permissions.includes("core.roles.manage")
                ? [{ kind: "link" as const, label: "Roles", to: "/app/settings/roles" }]
                : []),
              ...(permissions.includes("core.branches.read") || permissions.includes("core.branches.manage")
                ? [{ kind: "link" as const, label: "Sucursales", to: "/app/settings/branches" }]
                : []),
            ],
          },
        ]
      : []),
    {
      title: "Sesion",
      items: [{ kind: "action" as const, label: "Cerrar sesion", action: "logout" as const }],
    },
  ];

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(),
  );

  function toggleSection(key: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <aside className="flex h-screen flex-col border-r border-border bg-sidebar p-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-sidebar-foreground">SYSTUTOR</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {sections.map((section) => {
          const sectionKey = section.title;
          const isCollapsed = collapsedSections.has(sectionKey);

          return (
            <div key={sectionKey} className="space-y-2">
              <button
                type="button"
                onClick={() => toggleSection(sectionKey)}
                className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-sidebar-muted hover:text-sidebar-foreground"
              >
                <span>{section.title}</span>
                <ChevronDown open={!isCollapsed} />
              </button>

              {!isCollapsed ? (
                <div className="space-y-2">
                  {section.items.map((item) => {
                    if (item.kind === "link") {
                      return (
                        <NavLink
                          key={`${sectionKey}:${item.to}`}
                          to={item.to}
                          end
                          className={({ isActive }) =>
                            [
                              "block rounded-md px-3 py-2 text-sm transition",
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-sidebar-foreground/85 hover:bg-accent hover:text-accent-foreground",
                            ].join(" ")
                          }
                        >
                          {item.label}
                        </NavLink>
                      );
                    }
                    if (item.kind === "action") {
                      return (
                        <button
                          key={`${sectionKey}:${item.action}`}
                          type="button"
                          onClick={logout}
                          className="block w-full rounded-md px-3 py-2 text-left text-sm text-sidebar-foreground/70 transition hover:bg-accent hover:text-accent-foreground"
                        >
                          {item.label}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-3">
        <ThemeToggle />
      </div>
    </aside>
  );
}

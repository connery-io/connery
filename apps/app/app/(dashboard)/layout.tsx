import Link from "next/link";
import { Icons } from "@/components/icons";
import { UserAccountNav } from "@/components/user-account-nav";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // TODO: Get user from session.
  // TODO: If user is not logged in, redirect them to the login page.

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center space-x-2 md:flex"
            >
              <Icons.logo />
              <span className="hidden font-bold sm:inline-block">Connery</span>
            </Link>
            <Badge variant="outline">Beta</Badge>
          </div>
          <UserAccountNav
            user={{
              name: "John Doe",
              email: "john@example.com",
            }}
          />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

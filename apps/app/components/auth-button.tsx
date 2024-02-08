import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default async function AuthButton() {
  return (
    <Link
      href="/login"
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "px-4"
      )}
    >
      Login
    </Link>
  );
}

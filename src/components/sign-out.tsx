"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      className="btn-ghost w-full justify-start text-sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await fetch("/auth/signout", { method: "POST" });
          router.push("/");
          router.refresh();
        })
      }
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

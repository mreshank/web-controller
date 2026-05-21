import { PresenterKeysShell } from "@/components/PresenterKeysShell";

export default function RehearseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PresenterKeysShell>{children}</PresenterKeysShell>;
}

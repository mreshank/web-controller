import { PresenterKeysShell } from "@/components/PresenterKeysShell";

export default function CodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PresenterKeysShell>{children}</PresenterKeysShell>;
}

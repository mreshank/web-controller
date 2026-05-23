import { Providers } from "@/components/Providers";

export const dynamic = "force-dynamic";

export default function VanillaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}

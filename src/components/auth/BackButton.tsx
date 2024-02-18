import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

export function BackButton({ href, label }: Props) {
  return (
    <Button variant={"link"} size={"sm"} asChild className="font-normal w-full">
      <Link href={href}>{label}</Link>
    </Button>
  );
}

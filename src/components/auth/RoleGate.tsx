import { useCurrentRole } from "@/hooks/useCurrentRole";
import { UserRole } from "@prisma/client";
import React from "react";
import { FormError } from "../FormError";

type Props = {
  children: React.ReactNode;
  allowedRoles: UserRole;
};

export function RoleGate({ children, allowedRoles }: Props) {
  const role = useCurrentRole();
  if (role !== allowedRoles) {
    return <FormError message="You are not authorized to view this page" />;
  }
  return <>{children}</>;
}

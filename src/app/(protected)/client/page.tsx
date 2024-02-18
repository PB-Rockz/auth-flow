"use client";
import UserInfo from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";

type Props = {};

export default function ClientPage({}: Props) {
  const user = useCurrentUser();
  return (
    <div>
      <UserInfo user={user} label="📱 Client Component" />
    </div>
  );
}

import React from "react";
import CardWrapper from "@/components/auth/CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type Props = {};

export default function ErrorCard({}: Props) {
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
      headerLabel="Oops! Something went wrong."
    >
      <div className="flex justify-center items-center">
        <ExclamationTriangleIcon className="w-10 h-10 text-destructive" />
      </div>
    </CardWrapper>
  );
}

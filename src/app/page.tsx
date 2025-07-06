"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

const HomePage = () => {
  const [value, setValue] = useState<string>("");

  const trpc = useTRPC();
  const invokeAgent = useMutation(
    trpc.invokeAgent.mutationOptions({
      onSuccess: () => {
        toast.success("Agent invoked");
      },
    })
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <form
        action=""
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            invokeAgent.mutate({
              value: value,
            });
          }}
          disabled={invokeAgent.isPending}
        >
          Invoke Background
        </Button>
      </form>
    </div>
  );
};

export default HomePage;

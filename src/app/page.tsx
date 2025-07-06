"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HomePage = () => {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.createAI.queryOptions({ text: "test world" }));

  return <div>{greeting.data?.greeting}</div>;
};

export default HomePage;

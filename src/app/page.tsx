"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const HomePage = () => {
  const router = useRouter();

  const [value, setValue] = useState<string>("");
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        if (!data || (data && !data.id)) toast.error("Something went wrong");
        else {
          router.push(`/projects/${data.id}`);
        }
      },
    })
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col">
      <form
        action=""
        className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          name="user-prompt"
        />
        <Button
          onClick={() => {
            createProject.mutate({
              value: value,
            });
          }}
          disabled={createProject.isPending}
        >
          Create Project
        </Button>
      </form>

      {projects &&
        projects?.length > 0 &&
        projects?.map((project, index) => {
          return (
            <div className="" key={project.id}>
              {project?.name}
            </div>
          );
        })}
    </div>
  );
};

export default HomePage;

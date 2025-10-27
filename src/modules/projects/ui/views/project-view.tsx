"use client";

import { Suspense, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessagesContainer from "../components/messages-container";
import { Fragment } from "@/generated/prisma";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";

import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodeIcon, CrownIcon, EyeIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import FileExplorer from "@/components/file-explorer";
import UserControl from "@/components/user-control";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { CreditsInNavbar } from "../components/usage";
import { MessageSkeleton } from "@/components/skeleton/message-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { has } = useAuth();

  const isOnFreePlan = has?.({ plan: "free_user" });
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("code");

  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({
      projectId,
    })
  );

  return (
    <div className="h-screen">
      {!!project ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={35}
            minSize={20}
            className="flex flex-col min-h-0"
          >
            <Suspense fallback={<Skeleton className="w-32 h-6" />}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
            <Suspense fallback={<MessageSkeleton />}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={65}
            minSize={50}
            className="flex flex-col min-h-0"
          >
            <Tabs
              className="h-full gap-y-0"
              defaultValue={"preview"}
              value={tabState}
              onValueChange={(value) => {
                const isPreviewReady = !!activeFragment;
                if (!isPreviewReady && value === "preview") return;
                setTabState(value as "preview" | "code");
              }}
            >
              <div className="w-full flex items-center p-2 border-b gap-x-2">
                <TabsList className="h-8 p-0 border rounded-md">
                  <TabsTrigger
                    value="preview"
                    className="rounded-md"
                    disabled={!!activeFragment === false}
                  >
                    <EyeIcon />
                    <span>Demo</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="rounded-md">
                    <CodeIcon />
                    <span>Code</span>
                  </TabsTrigger>
                </TabsList>

                <div className="ml-auto flex items-center gap-x-4">
                  <CreditsInNavbar />
                  {isOnFreePlan && (
                    <Button asChild size="sm" variant={"default"}>
                      <Link href={"/pricing"}>
                        <CrownIcon /> Upgrade
                      </Link>
                    </Button>
                  )}
                  <SignedIn>
                    <UserControl />
                  </SignedIn>
                </div>
              </div>

              <TabsContent value="code" className="min-h-0">
                {!!activeFragment?.files ? (
                  <FileExplorer
                    files={activeFragment?.files as { [path: string]: string }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Loader className="size-32 animate-spin" />
                    <p className="h-xl font-bold italic animate-pulse">
                      {" "}
                      Generating/loading source code
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="preview">
                {!!activeFragment ? (
                  <FragmentWeb data={activeFragment} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Loader className="size-32 animate-spin" />
                    <p className="h-xl font-bold italic animate-pulse">
                      {" "}
                      Generating/loading {"NextJs "}App
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-col items-center justify-center w-screen h-screen ">
          <h1 className="text-xl md:text-3xl font-bold text-muted-foreground">
            Project Not Found
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProjectView;

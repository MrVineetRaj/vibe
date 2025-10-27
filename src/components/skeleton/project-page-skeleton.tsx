import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Skeleton } from "../ui/skeleton";
import { MessageSkeleton } from "./message-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import { CreditsInNavbar } from "@/modules/projects/ui/components/usage";
import { SignedIn } from "@clerk/nextjs";
import UserControl from "../user-control";

export const ProjectPageSkeleton = () => {
  return (
    <div className="min-h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Skeleton className="w-32 h-6" />
          <MessageSkeleton />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          <Tabs className="h-full gap-y-0" defaultValue={"preview"}>
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>

              <Skeleton className="ml-auto flex items-center gap-x-4 w-24 h-8"></Skeleton>
            </div>
            <TabsContent value="preview">
              <Skeleton className="w-full h-full" />
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              <Skeleton className="w-full h-full" />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

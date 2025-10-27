import React, { Suspense } from "react";
import ProjectView from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProjectPageSkeleton } from "@/components/skeleton/project-page-skeleton";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.message.getMany.queryOptions({
      projectId,
    })
  );

  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({
      projectId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <ErrorBoundary errorComponent={<p>Error!</p>}> */}
      <Suspense fallback={<ProjectPageSkeleton />}>
        <ProjectView projectId={projectId} />
      </Suspense>
      {/* </ErrorBoundary> */}
    </HydrationBoundary>
  );
};

export default ProjectPage;

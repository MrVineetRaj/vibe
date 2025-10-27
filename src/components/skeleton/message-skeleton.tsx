import React from "react";
import { Skeleton } from "../ui/skeleton";

export const MessageSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex justify-end pb-4 pr-2 pl-10">
        <Skeleton className="rounded-lg bg-muted p-3 shadow-none border-none min-w-[80%] min-h-72" />
      </div>
      <div className="flex justify-start pb-4 pr-2 pl-10">
        <Skeleton className="rounded-lg bg-muted p-3 shadow-none border-none min-w-[80%] min-h-48" />
      </div>
      <div className="flex justify-end pb-4 pr-2 pl-10">
        <Skeleton className="rounded-lg bg-muted p-3 shadow-none border-none min-w-[80%] min-h-72" />
      </div>
      <div className="flex justify-start pb-4 pr-2 pl-10">
        <Skeleton className="rounded-lg bg-muted p-3 shadow-none border-none min-w-[80%] min-h-48" />
      </div>
    </div>
  );
};

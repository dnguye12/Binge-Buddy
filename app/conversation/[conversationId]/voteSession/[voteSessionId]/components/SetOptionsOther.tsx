import { Skeleton } from "@/components/ui/skeleton";

interface SetOptionsOtherProps {
  name: string;
}
const SetOptionsOther = ({ name }: SetOptionsOtherProps) => {
  return (
    <div className="relative w-2/3 flex-1 overflow-y-auto">
      <div className="flex h-[calc(100vh-73px)] flex-col gap-6 py-6">
        <h1 className="text-muted-foreground my-6 text-center text-xl font-semibold">
          {name} is setting preferences.
        </h1>
        <div className="mb-6 grid grid-cols-3 gap-x-8 gap-y-4 px-6">
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
          <Skeleton className="h-[76px] w-full rounded-md shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default SetOptionsOther;

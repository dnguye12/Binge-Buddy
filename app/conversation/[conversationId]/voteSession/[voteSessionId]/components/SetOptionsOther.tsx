import { Skeleton } from "@/components/ui/skeleton"

interface SetOptionsOtherProps {
    name: string
}
const SetOptionsOther = ({ name }: SetOptionsOtherProps) => {
    return (
        <div className="flex-1 overflow-y-auto relative w-2/3">
            <div className="flex flex-col gap-6 py-6 h-[calc(100vh-73px)]">
                <h1 className="text-center text-muted-foreground text-xl font-semibold my-6">{name} is setting preferences.</h1>
                <div className="grid grid-cols-3 gap-y-4 gap-x-8 px-6 mb-6">
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                    <Skeleton className="w-full h-[76px] rounded-md shadow-md" />
                </div>
            </div>
        </div>
    );
}

export default SetOptionsOther;
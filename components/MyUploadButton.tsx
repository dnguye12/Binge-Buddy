import { ImagePlus } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

interface MyUploadButtonProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleUpload: (request: any) => void
}
const MyUploadButton = ({handleUpload} : MyUploadButtonProps) => {
    return (
        <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={handleUpload}
            uploadPreset="binged_buddy"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-md cursor-pointer size-9 border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
        >
            <ImagePlus className="h-auto w-8" />
        </CldUploadButton>
    );
}

export default MyUploadButton;
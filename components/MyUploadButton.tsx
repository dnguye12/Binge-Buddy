import { ImagePlus } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

interface MyUploadButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleUpload: (request: any) => void;
}
const MyUploadButton = ({ handleUpload }: MyUploadButtonProps) => {
  return (
    <CldUploadButton
      options={{ maxFiles: 1 }}
      onSuccess={handleUpload}
      uploadPreset="binged_buddy"
      className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    >
      <ImagePlus className="h-auto w-8" />
    </CldUploadButton>
  );
};

export default MyUploadButton;

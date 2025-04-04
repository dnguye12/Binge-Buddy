import { useModal } from "@/app/hooks/useModalStore";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

const ImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { image } = data;

  const isModalOpen = isOpen && type === "image";

  if (!image) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="h-96 w-96 p-6">
          <Image src={image} alt="Image" className="object-contain" fill />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;

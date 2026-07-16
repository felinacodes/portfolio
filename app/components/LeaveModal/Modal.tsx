import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal = ({ isOpen, setIsOpen }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="
        fixed inset-0
        z-[9999]
        bg-black/40
        flex items-center justify-center
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white
          rounded-xl
          p-6
          m-4
          shadow-xl
          w-full
          max-w-lg
          border-2 
          border-red-500
        "
      >
        <div className="flex items-center justify-between mb-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold">Select an image</h3>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        Modal content
      </div>
    </div>
  );
};

export default Modal;

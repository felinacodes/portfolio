import { useState } from "react";
import { X } from "lucide-react";
import { stickers, StickerName } from "../../../lib/stickerMap";
import { createStickerUrl } from "../../../lib/createStickerUrl";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const stickerList = Object.keys(stickers) as StickerName[];

const Modal = ({ isOpen, setIsOpen }: ModalProps) => {
  const [activeSticker, setActiveSticker] = useState<StickerName>("tea");
  const [search, setSearch] = useState("");
  if (!isOpen) return null;

  const filteredStickers = stickerList.filter((sticker) =>
    sticker.toLowerCase().includes(search.toLowerCase()),
  );

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
          max-w-2xl
        "
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Select a sticker</h3>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stickers..."
            className="
      w-full
      rounded-lg
      border
      border-gray-300
      px-3
      py-2
      text-sm
      outline-none
      focus:border-blue-400
      focus:ring-2
      focus:ring-blue-100
    "
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-2 border-blue-200">
          <div
            className="grid grid-cols-4  border-2 border-yellow-200
           w-full  max-h-[400px] overflow-auto m-0 p-0"
          >
            {filteredStickers.map((sticker) => (
              <button
                key={sticker}
                onClick={() => {
                  // setSticker(sticker);
                  setActiveSticker(sticker);
                }}
                className="
                aspect-square           
                bg-gray-500
                hover:bg-gray-200
                transition
                border-2 border-blue-500
                m-0 p-0
                
              "
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={createStickerUrl(sticker)}
                  alt={sticker}
                  className="w-full h-full object-contain block"
                />
              </button>
            ))}
          </div>
          <div>
            {activeSticker && (
              <div className="flex flex-col gap-4 border-2 border-pink-200">
                <button
                  onClick={() => {
                    // setSticker(activeSticker);
                  }}
                  className="
                w-24 h-24
                rounded-xl
                bg-gray-100
                hover:bg-gray-200
                transition
              "
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={createStickerUrl(activeSticker)}
                    alt={activeSticker}
                    className="w-full h-full object-contain"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

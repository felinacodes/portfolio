import { useEffect, useMemo, useState, useRef } from "react";
import { X } from "lucide-react";
import { stickers, StickerName } from "../../../lib/stickerMap";
import { createStickerUrl } from "../../../lib/createStickerUrl";
import { LeaveMessage } from "@/lib/fakeFetchMessages";
import SignatureCanvas, { SignatureCanvasHandle } from "./SignatureCanvas";
import { blobToBase64 } from "@/lib/blobToBase64";
import Turnstile from "react-turnstile";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setMessages?: React.Dispatch<React.SetStateAction<LeaveMessage[]>>;
}

export const stickerList = Object.keys(stickers) as StickerName[];
const firstSticker = stickerList[0];

const Modal = ({ isOpen, setIsOpen, setMessages }: ModalProps) => {
  const [activeSticker, setActiveSticker] = useState<StickerName>(firstSticker);
  const [search, setSearch] = useState("");
  const [color1, setColor1] = useState<string>(
    stickers[activeSticker].defaults.color1,
  );
  const [color2, setColor2] = useState<string>(
    stickers[activeSticker].defaults.color2,
  );
  const [modalMessage, setModalMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [token, setToken] = useState("");

  const signatureRef = useRef<SignatureCanvasHandle>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor1(stickers[activeSticker].defaults.color1);
    setColor2(stickers[activeSticker].defaults.color2);
  }, [activeSticker]);

  const handleColor1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor1(e.target.value);
  };

  const handleColor2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor2(e.target.value);
  };

  const previewUrl = useMemo(
    () => createStickerUrl(activeSticker, color1, color2),
    [activeSticker, color1, color2],
  );

  if (!isOpen) return null;

  const filteredStickers = stickerList.filter((sticker) =>
    sticker.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddToNotebook = async () => {
    if (!signatureRef.current?.hasSignature()) {
      setModalMessage("Please add your signature.");
      setHasError(true);
      return;
    }

    const signatureBlob = await signatureRef.current.getBlob();

    if (!signatureBlob) return;
    setHasError(false);
    setModalMessage("");

    let signatureBase64: string;

    try {
      signatureBase64 = await blobToBase64(signatureBlob);
    } catch (error) {
      setHasError(true);
      setModalMessage("Could not process signature. Please try again.");
      return;
    }
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sticker: activeSticker,
        color1,
        color2,
        signature: signatureBase64,
        website: websiteRef.current?.value,
        turnstileToken: token,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessages?.((prev) => [...prev, data.message]);
      setHasError(false);
      setModalMessage("Thanks for your gift. Once reviewed, it will be added.");
      // setIsOpen(false);
    } else {
      setHasError(true);
      setModalMessage(data.error || "Something went wrong.");
    }
  };

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
          <div className="flex flex-col items-center justify-center gap-4 border-2 border-green-500 w-full h-full">
            <div>
              {activeSticker && (
                <div className="flex flex-col items-center justify-center gap-4 border-2 border-pink-200">
                  <button
                    onClick={() => {}}
                    className="
                w-32 h-32
              
                bg-gray-100
                
                transition
              "
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={activeSticker}
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>
              )}

              <div>
                <input type="color" value={color1} onChange={handleColor1} />

                <input type="color" value={color2} onChange={handleColor2} />
              </div>

              <div>
                <SignatureCanvas ref={signatureRef} />
              </div>

              <input
                ref={websiteRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="text-center mt-2">
                <button
                  className="
                  text-lg bg-gray-200 hover:bg-gray-300 cursor-pointer 
                  rounded-lg px-4 py-2
                  transition
                  duration-200
                  "
                  onClick={handleAddToNotebook}
                >
                  Add to notebook
                </button>
              </div>
              <p
                className={`text-sm text-center ${
                  hasError ? "text-red-500" : "text-green-500"
                }`}
              >
                {modalMessage}
              </p>
            </div>
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setToken}
              onExpire={() => setToken("")}
              onError={() => setToken("")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

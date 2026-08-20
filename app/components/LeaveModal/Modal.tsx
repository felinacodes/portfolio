import { useEffect, useMemo, useState, useRef } from "react";
import { X } from "lucide-react";
import { stickers, StickerName } from "../../../lib/stickerMap";
import { createStickerUrl } from "../../../lib/createStickerUrl";
import SignatureCanvas, { SignatureCanvasHandle } from "./SignatureCanvas";
import { blobToBase64 } from "@/lib/blobToBase64";
import Turnstile from "react-turnstile";
import { LeaveMessage } from "@/lib/fetchMessages";
import { motion } from "framer-motion";

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
  const color1InputRef = useRef<HTMLInputElement>(null);
  const color2InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor1(stickers[activeSticker].defaults.color1);
    setColor2(stickers[activeSticker].defaults.color2);
  }, [activeSticker]);

  useEffect(() => {
    if (isOpen) {
      setModalMessage("");
      setHasError(false);
    }
  }, [isOpen]);

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
        z-9999
        bg-black/40
        flex items-center justify-center
      "
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="      
          bg-background
          rounded-xl        
          shadow-xl
          w-[calc(100%-3rem)]
          max-w-3xl
          max-h-[90vh]               
        "
        initial={{
          opacity: 0,
          scaleY: 0,
        }}
        animate={{
          opacity: 1,
          scaleY: 1,
        }}
        exit={{
          opacity: 0,
          scaleY: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          className="
          flex flex-col gap-4  p-6
          m-4
          max-h-[calc(90vh-3rem)]
          overflow-y-auto
          md:overflow-x-hidden
          min-h-0
          "
        >
          <div className="mb-6 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-center">
                Select a sticker
              </h3>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 hover:bg-gray-200 transition-colors cursor-pointer"
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
            focus:border-myDarkPink
            focus:ring-2
            focus:ring-myPink
              "
            />
          </div>
          <div
            className="flex flex-col md:flex-row gap-4
           border-gray-300 rounded-md h-full"
          >
            <div
              className="
    grid
    grid-cols-[repeat(auto-fit,minmax(35px,90px))]
    auto-rows-[60px]
    gap-2
    w-full
    max-h-[400px]
    overflow-y-auto
    overflow-x-hidden
    p-2
    border-2
    rounded-md
    border-gray-300
    content-start
    justify-center
  "
            >
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker}
                  onClick={() => {
                    setActiveSticker(sticker);
                  }}
                  className="
        bg-gray-400
        hover:bg-gray-200
        dark:bg-gray-800
        dark:hover:bg-gray-700
        transition
        m-0
        p-0
        w-full
        h-full
      "
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={createStickerUrl(sticker)}
                    alt={sticker}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
            <div
              className="m-2 flex flex-col items-center justify-center 
          gap-4  w-full h-full min-w-0"
            >
              <div className="">
                {activeSticker && (
                  <div className="relative flex flex-row items-center justify-evenly gap-4 ">
                    <button
                      className="
                    p-2
                    w-32 h-32       
                    transition"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt={activeSticker}
                        className="w-full h-full object-contain"
                      />
                    </button>

                    <div
                      className="m-2 top-0 right-0 absolute flex flex-col items-center justify-center 
                  gap-4"
                    >
                      <motion.button
                        whileTap={{
                          scale: 0.92,
                        }}
                        onClick={() => color1InputRef.current?.click()}
                        className="z-1 relative cursor-pointer"
                        aria-label="Choose primary color"
                      >
                        <div
                          className="w-5 h-5 rounded-full border cursor-pointer"
                          style={{ backgroundColor: color1 }}
                        />
                      </motion.button>

                      <motion.input
                        ref={color1InputRef}
                        type="color"
                        value={color1}
                        onChange={handleColor1}
                        className="opacity-0 absolute pointer-events-none"
                      />

                      <motion.button
                        whileTap={{
                          scale: 0.92,
                        }}
                        onClick={() => color2InputRef.current?.click()}
                        className="z-1 relative cursor-pointer"
                        aria-label="Choose secondary color"
                      >
                        <div
                          className="w-5 h-5 rounded-full border cursor-pointer"
                          style={{ backgroundColor: color2 }}
                        />
                      </motion.button>

                      <motion.input
                        ref={color2InputRef}
                        type="color"
                        value={color2}
                        onChange={handleColor2}
                        className="opacity-0 absolute pointer-events-none"
                      />
                    </div>
                  </div>
                )}

                <div className="w-full min-w-0 flex justify-center">
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
                  <motion.button
                    whileTap={{
                      scale: 0.92,
                    }}
                    className="
                    text-lg bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-300 cursor-pointer 
                    rounded-lg px-4 py-2
                    border
                    transition-colors
                    duration-200
                  "
                    onClick={handleAddToNotebook}
                  >
                    Add to notebook
                  </motion.button>
                </div>
                <p
                  className={`m-2 text-sm text-center ${
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
                onError={(err) => {
                  console.error("Turnstile error:", err);
                  setToken("");
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;

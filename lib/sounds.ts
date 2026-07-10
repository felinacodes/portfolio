export const SOUND_FILES = {
  close: "/sounds/book_closing.mp3",
  open: "/sounds/book_opening.mp3",
  flip: "/sounds/book_page.mp3",
  flipAll: "/sounds/flipping_novel.mp3",
  click: "/sounds/click.mp3",
  error: "/sounds/error.mp3",
  pen: "/sounds/pen.mp3",
  pencil: "/sounds/pencil.mp3",
  highlighter: "/sounds/highlighter.mp3",
  eraser: "/sounds/eraser.mp3",
} as const;

export type SoundName = keyof typeof SOUND_FILES;

const audioCache = new Map<SoundName, HTMLAudioElement>();

export function getSound(name: SoundName) {
  if (!audioCache.has(name)) {
    const audio = new Audio(SOUND_FILES[name]);
    audio.preload = "auto";
    audioCache.set(name, audio);
  }

  return audioCache.get(name)!;
}

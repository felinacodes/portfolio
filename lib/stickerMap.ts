import {
  tea,
  coconutCoctail,
  breakingBad,
  koala,
  koala2,
  koala3,
  koala4,
  koala5,
  koala6,
  koala7,
  koala8,
  koala9,
  koala10,
} from "./svgStickers";

import {
  teaDefaults,
  coconutCoctailDefaults,
  breakingBadDefaults,
  koalaDefaults,
} from "./svgStickers";

export const stickers = {
  tea: {
    svg: tea,
    defaults: {
      color1: teaDefaults.color1,
      color2: teaDefaults.color2,
    },
  },

  coconutCoctail: {
    svg: coconutCoctail,
    defaults: {
      color1: coconutCoctailDefaults.color1,
      color2: coconutCoctailDefaults.color2,
    },
  },
  breakingBad: {
    svg: breakingBad,
    defaults: {
      color1: breakingBadDefaults.color1,
      color2: breakingBadDefaults.color2,
    },
  },
  koala: {
    svg: koala,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala2: {
    svg: koala2,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala3: {
    svg: koala3,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala4: {
    svg: koala4,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala5: {
    svg: koala5,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala6: {
    svg: koala6,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala7: {
    svg: koala7,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala8: {
    svg: koala8,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala9: {
    svg: koala9,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
  koala10: {
    svg: koala10,
    defaults: {
      color1: koalaDefaults.color1,
      color2: koalaDefaults.color2,
    },
  },
} as const;

export type StickerName = keyof typeof stickers;

import {
  tea,
  coconutCoctail,
  breakingBad,
  koala,
  avocado,
  coffee,
  icedCoffee,
  fish,
  strawberrySmoothie,
  burger,
  rabbit,
  shrimp,
  drink,
  donut,
  iceCream,
} from "./svgStickers";

import {
  teaDefaults,
  coconutCoctailDefaults,
  breakingBadDefaults,
  koalaDefaults,
  avocadoDefaults,
  coffeeDefaults,
  icedCoffeeDefaults,
  fishDefaults,
  strawberrySmoothieDefaults,
  burgerDefaults,
  rabbitDefaults,
  shrimpDefaults,
  drinkDefaults,
  donutDefaults,
  iceCreamDefaults,
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
  avocado: {
    svg: avocado,
    defaults: {
      color1: avocadoDefaults.color1,
      color2: avocadoDefaults.color2,
    },
  },
  coffee: {
    svg: coffee,
    defaults: {
      color1: coffeeDefaults.color1,
      color2: coffeeDefaults.color2,
    },
  },
  icedCoffee: {
    svg: icedCoffee,
    defaults: {
      color1: icedCoffeeDefaults.color1,
      color2: icedCoffeeDefaults.color2,
    },
  },
  fish: {
    svg: fish,
    defaults: {
      color1: fishDefaults.color1,
      color2: fishDefaults.color2,
    },
  },
  strawberrySmoothie: {
    svg: strawberrySmoothie,
    defaults: {
      color1: strawberrySmoothieDefaults.color1,
      color2: strawberrySmoothieDefaults.color2,
    },
  },
  burger: {
    svg: burger,
    defaults: {
      color1: burgerDefaults.color1,
      color2: burgerDefaults.color2,
    },
  },
  rabbit: {
    svg: rabbit,
    defaults: {
      color1: rabbitDefaults.color1,
      color2: rabbitDefaults.color2,
    },
  },
  shrimp: {
    svg: shrimp,
    defaults: {
      color1: shrimpDefaults.color1,
      color2: shrimpDefaults.color2,
    },
  },
  drink: {
    svg: drink,
    defaults: {
      color1: drinkDefaults.color1,
      color2: drinkDefaults.color2,
    },
  },

  donut: {
    svg: donut,
    defaults: {
      color1: donutDefaults.color1,
      color2: donutDefaults.color2,
    },
  },
  iceCream: {
    svg: iceCream,
    defaults: {
      color1: iceCreamDefaults.color1,
      color2: iceCreamDefaults.color2,
    },
  },
} as const;

export type StickerName = keyof typeof stickers;

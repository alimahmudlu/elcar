export interface NavigationItem {
  name: string;
  href: string;
  subItems?: NavigationItem[];
}

export interface HeroSliderItem {
  title: string;
  category: string;
  image: {
    src: string;
  };
  output: string;
  voltage: string;
  phase: string;
  rating: string;
  description: string;
}


export interface Characteristic {
  value: string | number | boolean | string[] | null;
  name?: string;
  battery?: string;
  image?: {
    src: string;
  };
  "max-speed"?: string;
  "max-horsepower"?: string;
  "output-power"?: string;
  "power-input"?: string;
  "phase-number"?: string;
  "fuel-type"?: string;
}

export interface CharacteristicGroup {
  title: string;
  description?: string;
  characteristics: Characteristic[];
  visible?: boolean;
  image?: { 
    src: string;
    multiple?: boolean;
  } | { 
    src: string;
    multiple?: boolean;
  }[];
  photo?: {
    multiple?: boolean;
  };
}

export type CharacteristicGroupType = CharacteristicGroup[];

export interface BasketProductType {
  _id: string;
  title: string;
  description: string;
  slug: string;
  section: string;
  count:number;
  category: {
    name: string;
    _id: string;
  };
  brand: {
    name: string;
  };
  model: {
    name: string;
  };
  image: {
    src: string;
  };
  price: number;
  oldPrice: number;
  discount: number | null;
  discountedPrice: number;
  top: boolean;
  characteristicGroups: CharacteristicGroupType ;
}
export interface ProductType {
  _id: string;
  title: string;
  description: string;
  slug: string;
  section: string;
  count?:number;
  category: {
    name: string;
    _id: string;
  };
  brand: {
    name: string;
  };
  model: {
    name: string;
  };
  image: {
    src: string;
  };
  price: number;
  discount: number | null;
  discountedPrice: number;
  oldPrice: number;
  top: boolean;
  characteristicGroups: CharacteristicGroupType ;
}

export interface CategoryType {
  _id: string;
  section: string;
  name: string;
}

type Image = {
  _id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  alternativeText?: string;
};

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: Image;
  sections: string[];
  top: boolean;
};

export interface CharacteristicOption {
  _id: string;
  name: string;
}

interface ArticleAlternativeSlugs {
  az: string;
  en: string;
  ru: string;
}

interface ArticleImage {
  _id: string;
  src: string;
  width: number;
  height: number;
}

export interface BlogType {
  title: string;
  slug: string;
  description: string;
  content: string;
  _id: string;
  alternatives: ArticleAlternativeSlugs;
  image: ArticleImage;
  top: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModelType {
  _id: string;
  name: string;
  slug: string;
  brand: {
    _id: string;
    name: string;
    logo: {
      _id: string;
      name: string;
      src: string;
      width: number;
      height: number;
      size: number;
      extension: string;
      type: string;
      folder: string;
    };
  };
  section: string;
}

export interface Logo {
  _id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  size: number;
  extension: string;
  type: string;
  folder: string;
}

export interface Manufacturer {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: Logo;
  sections: string[];
  top: boolean;
}



export type NavigationItems = NavigationItem[];

export type NavigationLocale = 'az' | 'en' | 'ru';


export interface ComponentAttrs {
  multiple: boolean;
  showOnFilter: boolean;
}

export interface ParentCharacteristic {
  _id: string;
  name: string;
  key: string;
  component: {
    name: string;
    attrs: ComponentAttrs;
  };
}

export interface Category {
  name: string;
  slug: string;
  _id: string;
  section: string;
}

export interface ChildCharacteristic {
  _id: string;
  name: string;
  section: string;
  group: {
    _id: string;
    name: string;
  };
  characteristic: {
    _id: string;
    name: string;
    categories: Category[];
  };
}

export interface GroupedCharacteristic extends ParentCharacteristic {
  children: ChildCharacteristic[];
}
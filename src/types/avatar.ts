export interface AvatarConfig {
  id: string;
  style: 'stylized3d' | '2d-illustrated' | 'abstract';
  appearance: {
    skinTone: string;
    hair: {
      style: string;
      color: string;
      texture: 'straight' | 'wavy' | 'curly' | 'coily';
    };
    eyes: {
      shape: string;
      color: string;
      size: number;
    };
    nose: {
      shape: string;
      size: number;
    };
    mouth: {
      shape: string;
      size: number;
    };
    eyebrows: {
      style: string;
      thickness: number;
    };
    bodyType?: {
      build: 'slim' | 'athletic' | 'average' | 'curvy' | 'broad';
    };
  };
  clothing: {
    top?: string;
    bottom?: string;
    outerwear?: string;
    footwear?: string;
    colors: string[];
  };
  accessories: {
    glasses?: string;
    hat?: string;
    jewelry?: string[];
    bag?: string;
    other?: string[];
  };
  background: {
    type: 'solid' | 'gradient' | 'pattern';
    colors: string[];
    pattern?: string;
  };
  props?: string[];
}

export interface AvatarAsset {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  preview_url: string;
  asset_url: string;
  tags: string[];
  style_compatibility: string[];
}
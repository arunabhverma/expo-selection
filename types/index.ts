export interface IMAGE_TYPE {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
}

export interface STATE_TYPE {
  imageData: IMAGE_TYPE[];
  refreshing: boolean;
  activeIndex: number[];
  canSelect: boolean;
}

export interface LIST_PROPS {
  item: IMAGE_TYPE;
  index: number;
  selectImage: (item: IMAGE_TYPE) => void;
  activeImageIndex: IMAGE_TYPE[];
}

export interface HEADER_PROPS {
  tintColor: string;
  canSelect: boolean;
  toggleCanSelect: () => void;
}

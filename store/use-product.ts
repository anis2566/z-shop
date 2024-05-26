import { create } from "zustand";

import { ProductWithFeature } from "@/@types";

interface ProductState {
  open: boolean;
  product?: ProductWithFeature;
  onOpen: (product: ProductWithFeature) => void;
  onClose: () => void;
}

export const useProduct = create<ProductState>()((set) => ({
  open: false,
  product: undefined,
  onOpen: (product) => set(() => ({ open: true, product })),
  onClose: () => set(() => ({ open: false, product: undefined })),
}));

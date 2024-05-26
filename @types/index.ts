import {
  Category,
  Product,
  Stock,
  Brand,
} from "@prisma/client";

export interface ProductWithFeature extends Product {
  stocks?: Stock[];
  category: Category;
  brand: Brand;
}



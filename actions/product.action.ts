"use server"

import { db } from "@/lib/db"
import { EditProductSchemaType, ProductSchema, ProductSchemaType, VariantProductSchema, VariantProductSchemaType } from "@/schema/product"
import { revalidatePath } from "next/cache"

export const CREATE_PRODUCT = async (values: ProductSchemaType) => {
    const parseBody = ProductSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const product = await db.product.create({
        data: {
            ...values
        }
    })

    revalidatePath("/dashboard/products")

    return {
        success: "Product created",
        productId: product.id
    }
}

export const CREATE_VARIANT_PRODUCT = async (values: VariantProductSchemaType) => {
    const parseBody = VariantProductSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const product = await db.product.create({
        data: {
            ...values
        }
    })

    revalidatePath("/dashboard/products")

    return {
        success: "Product created",
        productId: product.id
    }
}


export const EDIT_PRODUCT = async (values: EditProductSchemaType) => {
    const parseBody = VariantProductSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input value")
    }

    const product = await db.product.findUnique({
        where: {
            id: values.productId
        }
    })

    if (!product) {
        throw new Error('Product not found')
    }

    const {productId, ...rest} = values;

    await db.product.update({
        where: {
            id: product.id
        },
        data: {
            ...rest
        }
    })

    return {
        success: "Product updated"
    }
}


export const DELETE_PRODUCT = async (productId: string) => {
    const product = await db.product.findUnique({
        where: {
            id: productId
        }
    })

    if (!product) {
        throw new Error('Product not found')
    }

    await db.product.delete({
        where: {
            id: productId
        }
    })

    revalidatePath("/dashboard/products")

    return {
        success: "Product deleted"
    }
}


export const GET_PRODUCTS_FOR_SELLER = async () => {
    const products = await db.product.findMany()

    return {
        products
    }
}


export const GET_FEATURE_PRODUCTS = async () => {
    const products = await db.product.findMany()

    return {
        products
    }
}


export const GET_POPULAR_PRODUCTS = async () => {
    const products = await db.product.findMany({
        include: {
            stocks: true,
            brand: true,
            category: true
        }
    });

  return {
    products,
  };
};


export const GET_DAILY_BEST_DEAL_PRODUCTS = async () => {
  const products = await db.product.findMany({
    include: {
      stocks: true,
      brand: true,
      category: true,
    },
  });

  return {
    products,
  };
};



export const GET_DEAL_OF_THE_DAY_PRODUCTS = async () => {
  const products = await db.product.findMany({
    include: {
      stocks: true,
      brand: true,
      category: true,
    },
  });

  return {
    products,
  };
};



export const GET_TOP_SELLING_PRODUCTS = async () => {
    const products = await db.product.findMany()
    
    return {
    products,
    };
};



export const GET_RECENTLY_ADDID_PRODUCTS = async () => {
  const products = await db.product.findMany();

  return {
    products,
  };
};



export const GET_TOP_RATED_PRODUCTS = async () => {
  const products = await db.product.findMany();

  return {
    products,
  };
};
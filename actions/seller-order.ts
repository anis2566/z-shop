"use server"

import { db } from "@/lib/db"
import { SellerOrderSchema, SellerOrderSchemaType } from "@/schema/seller-order"
import { getSeller, getUser } from "@/service/user.service"
import { SellerOrderProduct } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const CREATE_SELLER_ORDER = async (values: SellerOrderSchemaType) => {
    const parseBody = SellerOrderSchema.safeParse(values)

    if (!parseBody.success) {
        throw new Error("Invalid input field")
    }

    const { userId } = await getUser()
    
    const seller = await db.seller.findUnique({
        where: {
            userId
        }
    })

    if (!seller) {
        throw new Error("Seller not found")
    }

    const { products, customerName, address, mobile, deliveryFee } = parseBody.data

    const productDetails = await Promise.all(products.map(async product => {
        const productData = await db.product.findUnique({
            where: { id: product.productId }
        });
        if (!productData) {
            throw new Error(`Product with ID ${product.productId} not found`);
        }
        if (!productData.sellerPrice || product.price < productData.sellerPrice) {
            throw new Error(`Invalid product price`);
        }
        return {
            ...product,
            originalPrice: productData.sellerPrice
        };
    }));    

    const total = products.reduce((acc, curr) => acc + (curr.price * curr.quantity),0)

    await db.sellerOrder.create({
        data: {
            sellerId: seller.id,
            customerName,
            address,
            mobile,
            total,
            deliveryFee,
            products: {
                createMany: {
                    data: productDetails.map(product => (
                        {
                            productId: product.productId,
                            price: product.originalPrice,
                            quantity: product.quantity,
                            size: product.size,
                            color: product.color,
                            sellPrice: product.price
                        }
                    ))
                }
            }
        }
    })

    revalidatePath("/seller/order/list");

    for (const product of productDetails) {
      if (!product.size) {
        await db.product.update({
          where: { id: product.productId },
          data: { totalStock: { decrement: product.quantity } },
        });

        await db.bank.update({
          where: {
            sellerId: seller.id
          },
          data: {
            pending: {increment: (product.price - product.originalPrice)}
          }
        })

        return {
          success: "Order placed",
        };
      } else {
        const stock = await db.stock.findFirst({
          where: {
            productId: product.productId
          }
        })

        if (!stock) {
          throw new Error("Stock not found")
        }

        await db.stock.update({
          where: {
            id: stock.id,
            size: product.size
          },
          data: {
            stock: {decrement: product.quantity}
          }
        })

        const stocks = await db.stock.findMany({
          where: {
            productId: product.productId
          }
        })

        const totalStock = stocks.reduce((acc, curr) => acc+curr.stock,0)

        await db.product.update({
          where: {
            id: product.productId
          },
          data: {
            totalStock
          }
        })

        return {
          success: "Order placed",
        };
      }
    }
}

type UpdateStatus = {
  orderId: string;
  products: SellerOrderProduct[];
  status: string;
  sellerId: string;
}

export const UPDATE_SELLER_ORDER_STATUS = async ({orderId, products, status, sellerId}:UpdateStatus) => {
  const order = await db.sellerOrder.findUnique({
    where: {
      id: orderId
    }
  })

  if (!order) {
    throw new Error("Order not found")
  }

  if (status === "returned") {
    for (const product of products) {
      if (!product.size) {
        await db.product.update({
          where: { id: product.productId },
          data: { totalStock: { increment: product.quantity } },
        });

        await db.sellerOrder.update({
          where: {
            id: orderId
          },
          data: {
            status
          }
        })

      await db.bank.update({
        where: {
          sellerId
        },
        data: {
          pending: {decrement: (product.sellPrice - product.price)},
        }
      })

        return {
          success: "Status updated",
          status
        };
      } else {
        const stock = await db.stock.findFirst({
          where: {
            productId: product.productId
          }
        })

        if (!stock) {
          throw new Error("Stock not found")
        }

        await db.stock.update({
          where: {
            id: stock.id,
            size: product.size
          },
          data: {
            stock: {increment: product.quantity}
          }
        })

        const stocks = await db.stock.findMany({
          where: {
            productId: product.productId
          }
        })

        const totalStock = stocks.reduce((acc, curr) => acc+curr.stock,0)

        await db.product.update({
          where: {
            id: product.productId
          },
          data: {
            totalStock
          }
        })

        await db.sellerOrder.update({
          where: {
            id: orderId
          },
          data: {
            status
          }
        })

      await db.bank.update({
        where: {
          sellerId
        },
        data: {
          pending: {decrement: (product.sellPrice - product.price)},
        }
      })

        return {
          success: "Status updated",
          status
        };
      }
    }
  }

  if (status === "delivered") {
    for (const product of products) {
      await db.bank.update({
        where: {
          sellerId
        },
        data: {
          current: {increment: (product.sellPrice - product.price)},
          total: {increment: (product.sellPrice - product.price)}
        }
      })
    }

    await db.sellerOrder.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    })

    return {
      success: "Status updated",
      status
    }
  }

  if (status === "shipping") {
    await db.sellerOrder.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    })

    return {
      success: "Status updated",
      status
    }
  }
}

type UpdateTracking = {
  orderId: string;
  trackingId: string;
}

export const UPDATE_TRACKING_ID = async ({orderId, trackingId}:UpdateTracking) => {
  const order = await db.sellerOrder.findUnique({
    where: {
      id: orderId
    }
  })

  if (!order) {
    throw new Error("Order not found")
  } 

  await db.sellerOrder.update({
    where: {
      id: orderId
    },
    data: {
      trackingId
    }
  })

  return {
    success: "Tracking Id added"
  }

}
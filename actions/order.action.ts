"use server";

import { Order } from "@prisma/client";

import { db } from "@/lib/db";
import { generateInvoiceId } from "@/lib/utils";
import {
  OrderProductSchemaType,
  OrderSchema,
  OrderSchemaType,
} from "@/schema/order";
import { sendNotification } from "@/service/notification.service";
import { getAdmin, getUser } from "@/service/user.service";
import { revalidatePath } from "next/cache";

type CreateOrder = {
  order: OrderSchemaType;
  products: OrderProductSchemaType[];
};

export const CREATE_ORDER = async ({ order, products }: CreateOrder) => {
  const parseOrder = OrderSchema.safeParse(order);

  if (!parseOrder.success) {
    throw new Error("Invalid input value");
  }

  const {
    addressId,
    deliveryFee,
    paymentMethod,
    recepient,
    division,
    address,
    phone,
  } = parseOrder.data;
  const { userId, clerkId, user } = await getUser();

  const total = products.reduce((acc, curr) => acc + curr.price, 0);

  let newOrder: Order;

  if (addressId) {
    newOrder = await db.order.create({
      data: {
        userId,
        invoiceId: generateInvoiceId(),
        total,
        deliveryFee,
        paymentMethod,
        products: {
          createMany: {
            data: products,
          },
        },
        addressId,
      },
    });
  } else {
    const newAddress = await db.address.create({
      data: {
        recepient,
        division,
        address,
        phone,
      },
    });

    newOrder = await db.order.create({
      data: {
        userId,
        invoiceId: generateInvoiceId(),
        total,
        deliveryFee,
        paymentMethod,
        products: {
          createMany: {
            data: products,
          },
        },
        addressId: newAddress.id,
      },
    });
  }

  for (const product of products) {
    if (product.size) {
      const stock = await db.stock.findFirst({
        where: {
          productId: product.productId,
        },
      });

      if (!stock) {
        throw new Error("Stock not found");
      }

      await db.stock.update({
        where: {
          id: stock.id,
        },
        data: {
          stock: { decrement: product.quantity },
        },
      });

      await db.product.update({
        where: {
          id: product.productId,
        },
        data: {
          totalStock: { decrement: product.quantity },
        },
      });
    } else {
      const test = await db.product.update({
        where: {
          id: product.productId,
        },
        data: {
          totalStock: { decrement: product.quantity },
        },
      });
    }
  }

  const { adminClerId } = await getAdmin();

  await sendNotification({
    trigger: "customer-order",
    recipients: [adminClerId],
    actor: {
      id: clerkId,
      name: user.name,
    },
    data: {
      redirectUrl: `/dashboard/orders/${newOrder.id}`,
      invoice: newOrder.invoiceId,
    },
  });

  return {
    success: "Order placed",
    order: newOrder
  };
};

type UpdateOrder = {
  orderId: string;
  products: OrderProductSchemaType[];
  status: string;
};

export const UPDATE_ORDER = async ({
  orderId,
  products,
  status,
}: UpdateOrder) => {
  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (status === "returned") {
    for (const product of products) {
      if (!product.size) {
        await db.product.update({
          where: {
            id: product.productId,
          },
          data: {
            totalStock: { increment: product.quantity },
          },
        });
      } else {
        const stock = await db.stock.findFirst({
          where: {
            productId: product.productId,
            size: product.size,
          },
        });

        await db.stock.update({
          where: {
            id: stock?.id,
          },
          data: {
            stock: { increment: product.quantity },
          },
        });

        await db.product.update({
          where: {
            id: product.productId,
          },
          data: {
            totalStock: { increment: product.quantity },
          },
        });
      }
    }
  }

  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: order.userId,
    },
  });
  const { adminClerId } = await getAdmin();

  await sendNotification({
    trigger: "customer-order-admin",
    actor: {
      id: adminClerId,
    },
    recipients: [user?.clerkId || ""],
    data: {
      status,
      redirectUrl: `/account/orders/${order.id}`,
      invoice: order.invoiceId,
    },
  });

  revalidatePath(`/dashboard/orders/${orderId}`);

  return {
    success: "Status updated",
  };
};


type UserOrders = {
  page: string | null
  perPage: string | null
  status: string;
}

export const GET_USER_ORDER = async (values: UserOrders) => {
  const {status} = values
  const itemsPerPage = parseInt(values.perPage || "5");  
  const currentPage = parseInt(values.page || "1");

  const {userId} = await getUser()

  const orders = await db.order.findMany({
        where: {
            userId,
            ...(status !== "all" && {status})
        },
        include: {
            products: {
                include: {
                    product: {
                        select: {
                            featureImageUrl: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    console.log(orders)

  return {
    orders
  }
}

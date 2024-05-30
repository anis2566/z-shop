"use server";

import { db } from "@/lib/db";
import { ReviewSchema, ReviewSchemaType } from "@/schema/review";
import { sendNotification } from "@/service/notification.service";
import { getAdmin, getUser } from "@/service/user.service";
import { revalidatePath } from "next/cache";

export const CREATE_REVIEW = async (values: ReviewSchemaType) => {
  const parseBody = ReviewSchema.safeParse(values);

  if (!parseBody.success) {
    throw new Error("Invalid field value");
  }

  const { userId, clerkId, user } = await getUser();

  const purchasedProduct = await db.orderProduct.findFirst({
    where: {
      AND: [
        {
          order: {
            userId: userId, 
          },
        },
        {
          productId: values.productId,
        },
      ],
    },
    include: {
      order: true,
    },
  });

  if(!purchasedProduct) {
    throw new Error("Purchase to leave your thought")
  }

  const isReviewd = await db.review.findFirst({
    where: {
        userId,
        productId: values.productId
    }
  })

  if(isReviewd) {
    throw new Error("You have already submitted a review")
  }

  await db.review.create({
    data: {
      userId,
      productId: values.productId,
      rating: values.rating,
      content: values.content,
    },
  });

  const reviews = await db.review.findMany({
    where: { productId: values.productId },
    select: { rating: true },
  });

  const ratingCount = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount;

  await db.product.update({
    where: { id: values.productId },
    data: {
      averageRating: averageRating,
      ratingCount: ratingCount,
    },
  });

  revalidatePath(`/shop/${values.productId}`);

  const {adminClerId} = await getAdmin()

  await sendNotification({
    trigger: "customer-review",
    actor: {
        id: clerkId,
        name: user.name
    },
    recipients: [adminClerId],
    data: {
        redirectUrl: `/shop/${values.productId}`
    }
  })

  return {
    success: "Review submitted",
  };
};


type ProducReviews = {
  id: string;
  page: number
}

export const GET_PRODUCT_REVIEWS = async ({id, page}:ProducReviews) => {
    const product = await db.product.findUnique({
        where: {
            id
        }
    })

    if(!product) {
        throw new Error("Product not found")
    }

    const offset = (page - 1) * 2;

    const reviews = await db.review.findMany({
        where: {
            productId: id
        },
        include: {
            user: {
                select: {
                    name: true,
                    imageUrl: true
                }
            }
        },
        take: 2,
        skip: offset,
    })

    const totalReviews = await db.review.count({
      where: {
        productId: id
      }
    })

    return {
        reviews,
        totalReviews
    }
}
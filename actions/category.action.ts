"use server"

import { db } from "@/lib/db";
import { CategorySchema, CategorySchemaType, EditCategorySchema, EditCategorySchemaType } from "@/schema/category";
import { revalidatePath } from "next/cache";


export const CREATE_CATEGORY = async (values: CategorySchemaType) => {
  const parseBody = CategorySchema.safeParse(values)

  if (!parseBody.success) {
      throw new Error("Invalid input value")
  }
  
  const category = await db.category.findFirst({
      where: {
          name: values.name,
      },
  });

  if (category) {
    throw new Error("Category exists")
  }

  await db.category.create({
    data: {
      ...values,
    },
  });

  revalidatePath("/dashboard/category");  

  return {
    success: "Category created",
  };
};

export const EDIT_CATEGORY = async (values: EditCategorySchemaType) => {
  const parseBody = EditCategorySchema.safeParse(values);

  if (!parseBody.success) {
    throw new Error("Invalid input value");
  }

  const category = await db.category.findUnique({
    where: {
      id:values.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await db.category.update({
    where: {
      id:values.categoryId,
    },
    data: {
      name: values.name,
      description: values.description,
      imageUrl: values.imageUrl,
      tags: values.tags
    },
  });

  revalidatePath(`/dashboard/category/edit/${values.categoryId}`);

  return {
    success: "Category updated",
  };
};


export const DELETE_CATEGORY = async (categoryId: string) => {
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await db.category.delete({
    where: {
      id: categoryId,
    },
  });

  revalidatePath("/dashboard/category");

  return {
    success: "Category deleted",
  };
};

export const GET_CATEGORIES = async () => {
  const categories = await db.category.findMany({
    orderBy: {
        createdAt: "desc"
      }
    });

    return {
        categories
    };
};
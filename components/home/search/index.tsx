"use client"

import { useQuery } from "@tanstack/react-query"
import qs from "query-string"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"

import { cn } from "@/lib/utils"
import { GET_CATEGORIES } from "@/actions/category.action"

const formSchema = z.object({
  category: z.string().optional(),
  searchValue: z.string().optional()
})

export function Search() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      searchValue: ""
    },
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  function onSubmit(values: z.infer<typeof formSchema>) {
    const url = qs.stringifyUrl({
        url: `/shop`,
        query: {
          search: values.searchValue,
          category: values.category || searchParams.get("category"),
        }
    }, { skipEmptyString: true, skipNull: true });
    router.push(url);
  }

  const { data: categories} = useQuery({
    queryKey: ["get-categories"],
    queryFn: async () => {
      const data = await GET_CATEGORIES()
      return data.categories
    },
    staleTime: 60 * 60 * 1000
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="hidden sm:flex flex-1 max-w-[800px] items-center gap-x-1 border border-primary p-1 relative">
        <FormField
          control={form.control}
          name="category"
          render={
            ({ field }) => (
              <FormItem>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px] border-none focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="All Category" />
                    </SelectTrigger>
                  <SelectContent>
                    {categories && categories.map(category => (
                      <SelectItem value={category.name} key={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )
          }
        />
        <Separator orientation="vertical" className="h-8 bg-gray-300" />
        <div className="w-full">
          <FormField
            control={form.control}
            name="searchValue"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className="focus-visible:ring-0 focus-visible:ring-offset-0 border-none w-full" placeholder="Search for anything" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          </div>
          <Button variant="ghost" size="icon" className="absolute right-0" type="submit">
              <SearchIcon className="h-5 w-5 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden absolute right-10", form.getValues("searchValue") && "flex")}
            onClick={() => {
                form.reset()
                router.push("/shop")
            }}
          >
            <X className="h-5 w-5" />
          </Button>
      </form>
    </Form>
  )
}
"use client"

import { useState } from "react"

import { WeeklySalesChart } from "@/components/dashboard/home/weekly-sale-chart"
import { WeeklyOrderChart } from "@/components/dashboard/home/weekly-order-chart"

import {cn} from "@/lib/utils"


export const WeeklyCharts = () => {
  const [activeTab, setActiveTab] = useState<string>("sales")

    return (
        <div className="flex flex-col space-y-4 w-full min-h-[300px] rounded-lg border bg-card text-card-foreground shadow-sm p-3">
          <p className="text-xl font-bold">Weekly Overview</p>
          <div className="flex items-center justify-center rounded-md bg-muted p-1">
              <div className={cn("rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all flex-1 cursor-pointer",activeTab === "sales" && "bg-background")} onClick={() => setActiveTab("sales")}>
                Sales
              </div>
              <div className={cn("rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all flex-1 cursor-pointer",activeTab === "orders" && "bg-background")} onClick={() => setActiveTab("orders")}>
                Orders
              </div>
          </div>
          {activeTab === "sales" && (
            <WeeklySalesChart />
          )}
          {activeTab === "orders" && (
            <WeeklyOrderChart />
          )}
        </div>
    )
}
import { Banner } from "@/components/home/banner"
import { DailyBestDeal } from "@/components/home/daily-best-deal"
import { DealOfTheDay } from "@/components/home/deal-of-the-day"
import { FeatureCategory } from "@/components/home/feature-category"
import { FeatureProducts } from "@/components/home/feature-products"
import { PopularProducts } from "@/components/home/popular-products"
import { ProductHouse } from "@/components/home/product-house"

const Home = () => {
  return (
    <div className="w-full px-4 space-y-[60px]">
      <Banner />
      <FeatureCategory />
      <FeatureProducts />
      <PopularProducts />
      <DailyBestDeal />
      <DealOfTheDay />
      <ProductHouse />
    </div>
  )
}

export default Home
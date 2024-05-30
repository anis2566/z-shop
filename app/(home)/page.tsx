import { DailyBestDeal } from "@/components/home/daily-best-deal/page"
import { FeatureProducts } from "@/components/home/feature-products"
import { Hero } from "@/components/home/hero"
import { NewsLetter } from "@/components/home/newsletter/page"
import { PopularProducts } from "@/components/home/popular-products"
import { ProductHouse } from "@/components/home/product-hourse"
import { TopCategory } from "@/components/home/top-category/page"

const Home = () => {
  return (
    <div className="w-full px-4 space-y-[30px]">
      <Hero />
      <TopCategory />
      <PopularProducts />
      <DailyBestDeal />
      <FeatureProducts />
      <ProductHouse />
      <NewsLetter />
    </div>
  )
}

export default Home
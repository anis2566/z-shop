import { Banner } from "@/components/home/banner"
import { FeatureCategory } from "@/components/home/feature-category"
import SkeletonWrapper from "@/components/skeleton-wrapper"

const Home = () => {
  return (
    <div className="w-full px-4 space-y-[60px]">
      <Banner />
      <FeatureCategory />
      <SkeletonWrapper isLoading={true}>
        lfalflaflaf
      </SkeletonWrapper>
    </div>
  )
}

export default Home
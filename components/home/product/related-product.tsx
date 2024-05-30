import { RelatedProductSlider } from "./related-product-slider"

export const RelatedProduct = () => {
    return (
        <div className="space-y-4 bg-white py-3 px-4">
            <h1 className="text-xl font-semibold text-slate-700">Related Product</h1>
            <RelatedProductSlider />
        </div>
    )
}
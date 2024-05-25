import { Account } from "./account";
import { Cart } from "./cart";
import { Wishlist } from "./wishlist";


export function NavMenu() {
  return (
    <div className="flex items-center gap-x-2">
      <Wishlist />
      <Cart />
      <Account />
    </div>
  )
}
import { Account } from "./account";
import { Wishlist } from "./wishlist";

export function NavMenu() {
  return (
    <div className="flex items-center gap-x-2">
      <Wishlist />
      <Account />
    </div>
  )
}
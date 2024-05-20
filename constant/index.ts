import {
  Layers3,
  LayoutDashboard,
  CirclePercent,
  Package,
  ShoppingCart,
  ShoppingBasket,
  MapPin,
  Users,
  Ribbon,
  TicketSlash,
  Feather,
  Popcorn,
  CalendarClock,
  ClipboardList,
  Store,
  UserCog,
  Radio
} from "lucide-react";

export const DASHBOARD_SIDEBAR = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Brand",
    href: "/dashboard/brand",
    icon: Ribbon,
  },
  {
    label: "Category",
    href: "/dashboard/category",
    icon: Layers3,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Coupon",
    href: "/dashboard/coupon",
    icon: CirclePercent,
  },
] as const;


export const DASHBOARD_SELLER_SIDEBAR = [
  {
    label: "Seller Requests",
    href: "/dashboard/sellers/request",
    icon: Radio,
  },
  {
    label: "Sellers",
    href: "/dashboard/sellers",
    icon: Users,
  },
  {
    label: "Orders",
    href: "/dashboard/sellers/orders",
    icon: ShoppingCart,
  },
] as const;

export const SELLER_DASHBOARD_SIDEBAR = [
    {
        label: "Dashboard",
        href: "/seller",
        icon: LayoutDashboard
    },
    {
        label: "Store",
        href: "/seller/store",
        icon: Store
    },
    {
        label: "Place Order",
        href: "/seller/order/create",
        icon: ShoppingCart
    },
    {
        label: "Orders",
        href: "/seller/order/list",
        icon: ClipboardList
    },
    {
        label: "Profile",
        href: "/seller/profile",
        icon: UserCog
    },
] as const;
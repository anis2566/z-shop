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
  UserCog
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
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar />
      <div className="flex flex-col flex-1 md:pl-[220px]">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import "remixicon/fonts/remixicon.css";

export default function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCurrent = (path: string) => pathname === path;
  const [sidebarOpen, setSidebarOpen] = useState(false);

 const navigation = [
{
    name: "Dashboard",
    href: "/admin",
    icon: "ri-dashboard-line",
    current: isCurrent("/admin"),
},
{
  name: "Markalar",
  href: "/admin/brands",
  icon: "ri-car-line",
  current: isCurrent("/admin/brands"),
},
  {
    name: "Modeller",
    href: "/admin/models",
    icon: "ri-layout-grid-line", // varyasyon / model yapısı
  },
  {
    name: "Ürünler",
    href: "/admin/blog",
    icon: "ri-shopping-bag-3-line", // ürün / satış
  },

];

  return (
    <div>
      {/* MOBILE SIDEBAR */}
      <div
        className={classNames(
          "fixed inset-0 z-50 lg:hidden transition",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/80"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="relative z-50 w-64 h-full bg-white  p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white font-bold text-xl">Admin</span>
            <button onClick={() => setSidebarOpen(false)}>
              <i className="ri-close-line text-2xl text-white" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const current = isCurrent(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    "flex items-center gap-3 p-2 rounded-md text-sm font-semibold",
                    current
                      ? "bg-[#FF3C00] text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <i className={classNames(item.icon, "text-xl")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:bg-white border-r border-r-slate-200 lg:pb-4">
        <div className="flex h-16 items-center justify-center">
         <Image src={"/images/logos/orange-black-logo.svg"} width={40} height={40} alt="logos"/>
        </div>

        <nav className="mt-8">
          <ul className="flex flex-col items-center space-y-1">
            {navigation.map((item) => {
              const current = isCurrent(item.href);
              return (
                <div className="relative group" key={item.name}>
                  {/* Tooltip */}
                  <span className="absolute left-14 opacity-0 group-hover:opacity-100 transition bg-[#FF3C00]  text-white text-xs px-2 py-1 rounded">
                    {item.name}
                  </span>

                  <Link href={item.href}>
                    <li
                      className={classNames(
                        "p-3 rounded-md",
                        current
                          ? "bg-[#FF3C00]/40  text-[#FF3C00]"
                          : "text-gray-400  hover:bg-white/10"
                      )}
                    >
                      <i className={classNames(item.icon, "text-xl")} />
                    </li>
                  </Link>
                </div>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* MAIN AREA */}
      <div className="lg:pl-20">
      

        <main className="px-4 py-10">{children}</main>
      </div>
    </div>
  );
}
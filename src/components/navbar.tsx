"use client"
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { TbLayersDifference } from "react-icons/tb";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { AlignRight } from "lucide-react";
import { useScrollTop } from "../hooks/use-scroll-top";
import { cn } from "@/lib/utils";

type Props = {};

const NavBar = (props: Props) => {
  const scrolled = useScrollTop();
  return (
    <>
      <nav className={cn(" sticky inset-x-0 top-0 bg-white dark:bg-gray-950 z-50 h-fit border-zinc-200", scrolled && "border-b shadow-sm")}>
        <div className="flex items-center h-full gap-2 px-8 mx-auto py-4 justify-between max-w-7xl">
          <Link href="/" className="items-center gap-2 sm:flex">
            <p
              className="flex gap-2 text-4xl font-extrabold text-black dark:text-white items-center"
              id="logo"
            >
              <TbLayersDifference className="text-orange-600 w-11 h-11" />{" "}
              Piclock.
            </p>
          </Link>
          <div className="items-center gap-2 hidden md:flex">
            <Link
              href="/"
              className="mr-3 font-semibold transform transition-transform duration-300 hover:translate-y-[-4px]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="mr-3 font-semibold transform transition-transform duration-300 hover:translate-y-[-4px]"
            >
              About
            </Link>
            <Link
              href="/privacypolicy"
              className="mr-3 font-semibold transform transition-transform duration-300 hover:translate-y-[-4px]"
            >
              Privacy Policy
            </Link>
            <Button className=" ml-3 bg-orange-600 rounded-lg">
              <span className="mr-2 font-semibold">Github Repo</span>{" "}
              <FaGithub color="white" fontSize="1.4em" className="mb-1" />
            </Button>
          </div>
          {/* Mobile NavBar */}
          <Drawer>
            <DrawerTrigger asChild className="md:hidden cursor-pointer">
              <AlignRight className="w-7 h-7" />
            </DrawerTrigger>
            <DrawerContent>
              <div>
                <div className="items-center gap-5 flex flex-row justify-center p-8 pt-10">
                  <Link href="/" className="mr-3 font-semibold">
                    Home
                  </Link>
                  <Link href="/about" className="mr-3 font-semibold">
                    About
                  </Link>
                  <Link href="/privacypolicy" className="mr-3 font-semibold">
                    Privacy Policy
                  </Link>
                </div>
                <div className="items-center flex justify-center pb-8">
                  <Button className="bg-orange-600">
                    <span className="mr-2 font-semibold">Github Repo</span>{" "}
                    <FaGithub color="white" fontSize="1.4em" />
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

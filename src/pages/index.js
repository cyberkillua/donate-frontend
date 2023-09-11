import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Body from "@/components/Body";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="">
      <Header />
      <Body />
    </main>
  );
}

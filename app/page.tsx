"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import PollMaker from "@/components/PollMaker";
import Balloon from "@/components/Balloon";
import { Poll } from "@/app/types";
import Input from "@/components/Input";
import { BaseRepository } from "./libraries/firebase";
import { formatDateTime } from "./libraries/Utilities";
import { Heebo } from '@next/font/google';

const heebo = Heebo({
  subsets: ['hebrew'],
  weight: ['700'],
});

const randomId = () => Math.random().toString(36).substring(2, 10);
const firebase = new BaseRepository("polls");

// Define your password
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD || "hamal1313";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [message,setmessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const password = Cookies.get("password");
    if (password === PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === PASSWORD) {
      Cookies.set("password", inputPassword);
      setIsAuthenticated(true);
    } else {
      setmessage("סיסמה לא נכונה");
    }
  };

  async function createPoll(formData: FormData) {
    const title = formData.get("title")?.toString() ?? "Anonymous poll";
    let date = new Date();
    date.setDate(date.getDate() + 1);
    const pollCloses = formData.get("pollCloses")?.toString() ?? formatDateTime(date);
    const options: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("option-") && value.toString().trim().length > 0) {
        options.push(value.toString());
      }
    }

    const id = randomId();
    const poll: Poll = {
      title,
      options,
      votes: options.map(() => 0),
      pollCloses
    };

    await firebase.create(id, { id, ...poll });
    router.push(`/${id}`);
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
                  <label className="">{message}</label>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <label>
            Password:
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="ml-2 border rounded p-1"
            />
          </label>

          <button type="submit" className="block w-full bg-blue-500 text-white py-2 rounded">
            Submit
          </button>
        </form>
      </div>
       
    );
  }

  return (
    <>
    <main className=""> 
      <form onSubmit={(e) => { e.preventDefault(); createPoll(new FormData(e.currentTarget)); }}>
        <div className="flex flex-col space-y-6 w-4/5 mx-auto">
          <PollMaker />
        </div>
      </form>
      {/* <Balloon /> */}
      </main>
    </>
  );
}

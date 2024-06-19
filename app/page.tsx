"use client";

import Button from "@/components/Button";
import PollMaker from "@/components/PollMaker";
import Balloon from "@/components/Balloon";
import { Poll } from "@/app/types";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "./env";
import Input from "@/components/Input";
import { BaseRepository } from "./libraries/firebase";
import { formatDateTime } from "./libraries/utilities";


const randomId = () => Math.random().toString(36).substring(2, 10);
console.log("t");
const firebase = new BaseRepository("polls");

export default function Home() {
  async function createPoll(formData: FormData) {
    const title = formData.get("title")?.toString() ?? "Anonymous poll";
    // Calculate tomorrow's date
    let date = new Date();
    date.setDate(date.getDate() + 1);
    const pollCloses =
      formData.get("pollCloses")?.toString() ?? formatDateTime(date);

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

    // await fetch(`${PARTYKIT_URL}/party/${id}`, {
    //   method: "POST",
    //   body: JSON.stringify(poll),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    await firebase.create(id, { id, ...poll });

    redirect(`/${id}`);
  }

  return (
    <>
      <form action={createPoll}>
        <div className="flex flex-col space-y-6 w-4/5	mx-auto">
          <PollMaker />
        </div>
      </form>
      <Balloon />
    </>
  );
}

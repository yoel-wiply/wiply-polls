"use client";

import { notFound } from "next/navigation";
import { PARTYKIT_URL } from "@/app/env";
import type { Poll } from "@/app/types";
import Image from "next/image";
import PollUI from "@/components/PollUI";
import Balloon from "@/components/Balloon";
import { BaseRepository } from "../libraries/firebase";
import { useEffect, useState } from "react";
import Button from './../../public/Button.png'

const firebase = new BaseRepository<Poll>("polls");

const initialPoll = {};

export default function PollPage({ params }: { params: { poll_id: string } }) {
  const pollId = params.poll_id;
  const [poll, setPoll] = useState<Poll>();

  // const req = await fetch(`${PARTYKIT_URL}/party/${pollId}`, {
  //   method: "GET",
  //   next: {
  //     revalidate: 0,
  //   },
  // });

  // if (!req.ok) {
  //   if (req.status === 404) {
  //     notFound();
  //   } else {
  //     throw new Error("Something went wrong.");
  //   }
  // }

  // const poll = (await req.json()) as Poll;

  useEffect(() => {
    // firebase.handleMultipleUpdates(pollId)
    firebase.subscribe(pollId, (poll: Poll | null) => {
      console.log("Poll", poll);
      if (poll !== null) setPoll(poll);
    });
  }, []);

  return (
    <>
      {!poll && <div className="text-center">טוען...</div>}
      {poll && (
        // <div className="flex flex-col space-y-4">
        <>
          <h1
            className="text-3xl text-center font-bold p-4"
            style={{ textShadow: "1px 5px 9px rgba(0,0,0,0.78)", color: '#ffffff', fontFamily: 'cursive' }}
          >
            {poll.title}
          </h1>
          <PollUI id={pollId} options={poll.options} votes={poll.votes} />
          <Image
              src={Button}
              alt="Button"
              style={{}}
            />
        </>
        // </div>
      )}

      <Balloon float={true} />
      {/* <div className="font-medium text-lg pt-8 text-center">
        <a className="underline" href="/">
          Create your own poll!
        </a>
      </div> */}
    </>
  );
}

// export async function generateMetadata({
//   params,
// }: {
//   params: { poll_id: string };
// }) {
//   const attrs = {
//     title: "A live poll created using PartyKit!",
//     cta: "Vote now!",
//   };

//   try {
//     const req = await fetch(`${PARTYKIT_URL}/party/${params.poll_id}`);
//     if (req.ok) {
//       const res = await req.json();
//       if (res.title) {
//         attrs.title = res.title;
//       }
//     }
//   } catch (e) {
//     console.error("Failed to generate metadata for poll page", e);
//   }

//   return {
//     openGraph: {
//       images: [`/api/og?${new URLSearchParams(attrs)}`],
//     },
//   };
// }

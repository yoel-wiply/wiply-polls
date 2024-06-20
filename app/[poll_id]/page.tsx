"use client";

import { notFound } from "next/navigation";
import { PARTYKIT_URL } from "@/app/env";
import type { Poll } from "@/app/types";
import Image from "next/image";
import PollUI from "@/components/PollUI";
import Balloon from "@/components/Balloon";
import { BaseRepository } from "../libraries/firebase";
import { useEffect, useState } from "react";
import Button from "./../../public/Button.png";
import UserForm from "@/components/Form";
import { formatDateTime } from "../libraries/Utilities";


const firebase = new BaseRepository<Poll>("polls");

const initialPoll = {};

export default function PollPage({ params }: { params: { poll_id: string } }) {
  const pollId = params.poll_id;
  const [poll, setPoll] = useState<Poll>();
  const [formView, setFormView] = useState(false);

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

  const isPollClosed =
    poll && poll.pollCloses
      ? formatDateTime(new Date()) >= poll?.pollCloses
      : undefined;

  return (
    <>
      {!poll && isPollClosed === undefined && (
        <div className="text-center text-white">טוען...</div>
      )}
      {
        poll && isPollClosed !== undefined && (
          // <div className="flex flex-col space-y-4">
          <>
            (
            {!formView ? (
              <>
                {isPollClosed && (
                  <h1
                    className="text-2xl text-center font-bold p-4 w-3/4 mx-auto"
                    style={{
                      textShadow: "1px 5px 9px rgba(0,0,0,0.78)",
                      color: "#ffffff",
                      fontFamily: "Heebo",
                    }}
                  >
                    הסקר הסתיים
                  </h1>
                )}
                <h1
                  className="text-2xl text-center font-bold p-4 w-3/4 mx-auto"
                  style={{
                    textShadow: "1px 5px 9px rgba(0,0,0,0.78)",
                    color: "#ffffff",
                    fontFamily: "Heebo",
                  }}
                >
                  {poll.title}
                </h1>
                <PollUI
                  id={pollId}
                  options={poll.options}
                  votes={poll.votes}
                  isPollClosed={isPollClosed}
                />
                {/* <Image
              src={Button}
              alt="Button"
              style={{}}
            /> */}
                {/* <UserForm/> */}
              </>
            ) : (
              <UserForm />
            )}
            )
            {/* <div className="flex justify-center">
              <button
                className=" mb-12 border rounded-md p-2 bg-slate-100		"
                style={{
                  fontFamily: "cursive",
                  backgroundImage: "linear-gradient(90deg, #72bef9, #1c62e3)",
                  color: "white",
                  borderRadius: 20,
                  borderWidth: 0,
                }}
                onClick={() => setFormView(!formView)}
              >
                נרשמים וזוכים!
              </button>

            </div> */}
          </>
        )
        // </div>
      }

      {/* <Balloon float={true} /> */}
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

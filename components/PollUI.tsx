"use client";

import { PARTYKIT_HOST } from "@/app/env";
import { Poll } from "@/app/types";
import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";
import PollOptions from "./PollOptions";
import { BaseRepository } from "@/app/libraries/firebase";

const firebase = new BaseRepository("polls");


export default function PollUI({
  id,
  options,
  votes,
}: {
  id: string;
  options: string[];
  votes: number[];
}) {
  // const [votes, setVotes] = useState<number[]>(initialVotes ?? []);
  const [vote, setVote] = useState<number | null>(null);

  // const socket = usePartySocket({
  //   host: PARTYKIT_HOST,
  //   room: id,
  //   onMessage(event) {
  //     const message = JSON.parse(event.data) as Poll;
  //     if (message.votes) {
  //       setVotes(message.votes);
  //     }
  //   },
  // });

  const sendVote =  async (option: number) => {
    console.log(option)
    if (vote === null) {
      await firebase.handleMultipleUpdates(id, option)
      setVote(option);
    }
  };

  // prevent double voting
  useEffect(() => {
    let saved = localStorage?.getItem("poll:" + id);
    if (vote === null && saved !== null) {
      setVote(+saved);
    } else if (vote !== null && saved === null) {
      localStorage?.setItem("poll:" + id, `${vote}`);
    }
  }, [id, vote]);

  return (
    <PollOptions
      options={options}
      votes={votes}
      vote={vote}
      setVote={sendVote}
    />
  );
}

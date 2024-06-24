"use client";


import { useEffect, useState } from "react";
import PollOptions from "./PollOptions";
import { BaseRepository } from "@/app/libraries/firebase";
import Cookies from 'js-cookie';

const firebase = new BaseRepository("polls");

export default function PollUI({
  id,
  options,
  votes,
  isPollClosed,
}: {
  id: string;
  options: string[];
  votes: number[];
  isPollClosed: boolean;
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

  const sendVote = async (option: number) => {
    console.log(option);
    document.cookie = ""
    if (vote === null) {
      await firebase.handleMultipleUpdates(id, option);
      setVote(option);
      Cookies.set('poll_voted_' + id, `${option}`, { expires: 7 }); // Expires in 7 days

    }
  };

  // prevent double voting
  useEffect(() => {
    const votedCookie = Cookies.get('poll_voted_' + id);
    if (votedCookie) {
      setVote(parseInt(votedCookie));
    }


    // let saved = localStorageAvailable()
    //   ? localStorage?.getItem("poll:" + id)
    //   : null;
    // if (vote === null && saved !== null) {
    //   setVote(+saved);
    // }
    // else if (vote !== null && saved === null) {
    //   if (localStorageAvailable()) {
    //     localStorage?.setItem("poll:" + id, `${vote}`);
    //   }
    // }
  }, [id, vote]);

  return (
    <PollOptions
      options={options}
      votes={votes}
      vote={vote}
      setVote={sendVote}
      isPollClosed={isPollClosed}
    />
  );
}

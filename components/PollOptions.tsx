"use client";

import { formatDateTime } from "@/app/libraries/Utilities";
import Image from "next/image";

const People = "https://pollswiply.fra1.cdn.digitaloceanspaces.com/public/People.png"
const Person = "https://pollswiply.fra1.cdn.digitaloceanspaces.com/public/Person.png"

export default function PollOptions({
  options,
  votes,
  vote,
  setVote,
  isPollClosed
}: {
  options: string[];
  votes: number[];
  vote: number | null;
  setVote: (option: number) => void;
  isPollClosed: boolean
}) {
  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const mostVotes = Math.max(...votes);

  console.log('formatDateTime(new Date())', formatDateTime(new Date()))

  return (
    <ul className="flex flex-col space-y-4 p-4">
      {options.map((option, i) => (
        <li key={i}>
          <div
            className="relative w-full min-h-[40px] rounded-mdflex text-white text-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          >
            <div
              className={`absolute top-0 left-0 bottom-0 w-full rounded-md transition-all duration-500 z-10 ${
                votes[i] === mostVotes
                  ? "vote-bg-winning"
                  : vote === i
                  ? "vote-bg-own"
                  : "vote-bg"
              }`}
              style={{
                width:
                  vote === null && !isPollClosed
                    ? 0
                    : `${((votes[i] ?? 0) / totalVotes) * 100}%`,
              }}
            >
            </div>

            <div className="select-none w-full flex items-center text-center justify-between px-4 z-20">
              <button
                onClick={() => setVote(i)}
                disabled={isPollClosed}
                className={`flex flex-1 justify-center py-2 ${
                  vote === null && !isPollClosed  ? "cursor-pointer" : "cursor-default"
                } ${
                  vote === null && !isPollClosed  ? "" : votes[i] === mostVotes ? "font-bold" : ""
                }`}
              >
                <span className="flex items-center z-10">
                  {vote === i && <span className="relative">  < img className=" ml-1" src={Person} alt="" width={20} height={20}></img> </span>}
                  {option}
                </span>
              </button>

              {vote === null && !isPollClosed ? null : <span style={{color: 'white', zIndex: 10, display: 'flex', alignItems: 'center'}}>              <img src={People}  className=" ml-1"  alt="" width={20} height={20}></img>
{votes[i] ?? 0}</span>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

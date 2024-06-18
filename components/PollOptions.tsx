"use client";
import People from "./../public/People.png";
import Person from "./../public/Person.png";

import Image from "next/image";

export default function PollOptions({
  options,
  votes,
  vote,
  setVote,
}: {
  options: string[];
  votes: number[];
  vote: number | null;
  setVote: (option: number) => void;
}) {
  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const mostVotes = Math.max(...votes);

  return (
    <ul className="flex flex-col space-y-4 p-4">
      {options.map((option, i) => (
        <li key={i}>
          <div
            className="relative w-full min-h-[40px] rounded-mdflex text-white text-center"
            style={{ backgroundColor: "rgba(0, 2, 43, 0.9)" }}
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
                  vote === null
                    ? 0
                    : `${((votes[i] ?? 0) / totalVotes) * 100}%`,
              }}
            >
            </div>

            <div className="select-none w-full flex items-center text-center justify-between px-4 z-20">
              <button
                onClick={() => setVote(i)}
                className={`flex flex-1 py-2 text-center justify-center ${
                  vote === null ? "cursor-pointer" : "cursor-default"
                } ${
                  vote === null ? "" : votes[i] === mostVotes ? "font-bold" : ""
                }`}
              >
                <span className="flex items-center z-10">
                  {vote === i && <span className="relative">  < Image className=" ml-1" src={Person} alt="" width={20}></Image> </span>}
                  {option}
                </span>
              </button>

              {vote === null ? null : <span style={{color: 'white', zIndex: 10, display: 'flex', alignItems: 'center'}}>              <Image src={People}  className=" ml-1"  alt="" width={20}></Image>
{votes[i] ?? 0}</span>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

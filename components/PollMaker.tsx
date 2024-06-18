"use client";

import { useRef, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { BaseRepository } from "@/app/libraries/firebase";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 8;

export default function PollMaker() {
  const [newOption, setNewOption] = useState<string>("");
  const [title, setTitle] = useState("");
  const [pollCloses, setPollCloses] = useState("");

  const [options, setOptions] = useState<string[]>([]);
  const newOptionRef = useRef<HTMLInputElement>(null);
  const addNewOption = () => {
    if (newOption?.trim().length !== 0) {
      setOptions((prevOptions) => [...prevOptions, newOption]);
      setNewOption("");
    }
  };

  const canAdd = options.length < MAX_OPTIONS;
  const canSubmit =
    title.length > 0 && pollCloses.length > 0 &&
    options.length >= MIN_OPTIONS &&
    options.filter((option) => option.trim().length === 0).length === 0;



  return (
    <>
      <Input
        placeholder="הכנס שאלה כאן..."
        type="text"
        name="title"
        className={"text-2xl font-bold"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            newOptionRef.current?.focus();
          }
        }}
      />
      <Input
        placeholder="Poll Closes dd/mm/yyyy, 00:00"
        type="text"
        name="pollCloses"
        className={"text-l font-bold"}
        value={pollCloses}
        onChange={(e) => setPollCloses(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            newOptionRef.current?.focus();
          }
        }}
      />
      <ul className="flex flex-col space-y-4">
        {options.map((value, i) => (
          <li className="flex" key={i}>
            <Input type="text" name={`option-${i}`} defaultValue={value} />
          </li>
        ))}
        {canAdd && (
          <li className="flex space-x-4">
            <Input
              ref={newOptionRef}
              type="text"
              name="option-new"
              placeholder="אפשרות חדשה"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newOption.length > 0) {
                    addNewOption();
                  }
                }
              }}
            />
            <Button theme="light" onClick={addNewOption}>
              הוספה
            </Button>
          </li>
        )}
      </ul>
      <Button type="submit" disabled={!canSubmit}>
        ליצירת הסקר{" "}
      </Button>
    </>
  );
}

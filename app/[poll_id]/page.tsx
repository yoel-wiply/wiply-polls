"use client";


import type { Poll } from "@/app/types";
import PollUI from "@/components/PollUI";
import { BaseRepository } from "../libraries/firebase";
import { useEffect, useRef, useState } from "react";
import UserForm from "@/components/Form";
import { formatDateTime } from "../libraries/Utilities";

const firebase = new BaseRepository<Poll>("polls");


export default function PollPage({ params }: { params: { poll_id: string } }) {
  const pollId = params.poll_id;
  const [poll, setPoll] = useState<Poll>();
  const [formView, setFormView] = useState(false);
  const [listenerActive, setListenerActive] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);

  const elementRef = useRef(null);

  useEffect(() => {

    // set up listener 
    let listener: (() => void) | null = null;

    // load inital data for user, don't create listener yet
    async function loadData() {
      const poll = (await firebase.fetch(pollId)) as Poll;
      if (poll !== undefined) setPoll(poll);
    }

    // if the user clicks on any part of the poll, we consider this active engagement so we create a listener
    // listener allows user/client to receive updates in real time
    if (listenerActive) {
      console.log("active connection set up");

      // function that creates active listener
      listener = firebase.subscribe(pollId, (poll: Poll | null) => {
        console.log("Poll", poll);
        if (poll !== null) setPoll(poll);
      });


      // Set up a timer to unsubscribe after 45 seconds
      // to reduce number of document reads at scale we limit each client to
      // open connection of up to 45 seconds
      const id = window.setTimeout(() => {
        if (listener) {
          console.log("Unsubscribing because 45 seconds passed");

          listener();
          setListenerActive(false);
        }
      }, 45000);

      setTimerId(id);
    } else {

      // one time document read to show user poll title and options
      // before we set up listener
      console.log("query before interaction");
      loadData();
    }

    // we create observer (in the case poll is it iframe), to close active connection
    // once user scrolls iframe out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is in view
            console.log("Element is visible");
            // Subscribe to your snapshot listener here
          } else {
            // Element is out of view
            console.log("Element is not visible");
            // Unsubscribe from your snapshot listener here
            if (listener) {
              console.log("Unsubscribing because iframe out of page");
              listener();
            }
          }
        });
      },
      {
        threshold: 0.1, // Adjust as needed
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // clean up function
    // remove listener and timeId and observing api before component uncmounts
    return () => {
      if (listener) {
        console.log("Unsubscribing");
        listener();
      }
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [listenerActive]);

  const isPollClosed =
    poll && poll.pollCloses
      ? formatDateTime(new Date()) >= poll?.pollCloses
      : undefined;

  const handleButtonClick = () => {
    setListenerActive(true);
  };

  return (
    <>
      {!poll && isPollClosed === undefined && (
        <div className="text-center text-white">טוען...</div>
      )}
      {poll && isPollClosed !== undefined && (
        <div ref={elementRef} onClick={handleButtonClick}>
          {!formView ? (
            <>
              {isPollClosed && (
                <h1
                  className="text-2xl text-center font-bold p-4 mx-auto"
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
                className="text-lg text-center font-bold p-4 mx-auto"
                style={{
                  textShadow: "1px 5px 9px rgba(0,0,0,1)",
                  color: "#ffffff",
                  fontFamily: "Heebo",
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Example background color with transparency
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
            </>
          ) : (
            <UserForm />
          )}
        </div>
      )}
    </>
  );
}

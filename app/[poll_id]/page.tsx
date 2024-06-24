// "use client";

import type { Poll as PollType } from "@/app/types";

import {
  initializeApp,
  applicationDefault,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";
import Poll from "./poll";


async function fetchAll() {
  const db = getFirestore();

  const res = await db.collection("polls").get();
  return res?.docs?.map((d) => d?.data()) || [];
}
// load inital data for user, don't create listener yet
export async function generateStaticParams() {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY
    ,    clientEmail:
      process.env.CLIENT_EMAIL,
  };
  initializeApp({
    credential: cert(serviceAccount),
  });

  // const posts = await fetch("https://.../posts").then((res) => res.json());
  const polls = (await fetchAll()) as PollType[];

  return polls.map((poll) => ({
    poll_id: poll.id,
  }));
}

export default function PollPage({ params }: { params: { poll_id: string } }) {
  const pollId = params.poll_id;
  console.log("pollId", pollId);
  return <Poll pollId={pollId} />;
}

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
    projectId: "wiply-nextjs13-dev",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDM4hmseAJ8OhnF\nV3Vc/XbcqzvXd1BjN+HKkljy4XOecm0Fr0azLSJGLT3ToJBdtslb37h96Iqkq9bC\n4h0zwHjVLcBrRUBnAE2FKWJrjPFevqUKxrtNUprkaMHye2xnzHSZGvZyyY/hA9BE\nHK/IQ5T0miZ29Zq9pHGjC8NVVxld4WtkZbmpJcFOUsHMZvJrbWKgnrrNJbfuDhNA\nH+ruYerAByvde1AKcmlC/x3gyQzbKV0IJLequo6doZ5qZzP9kV+eSktCoDP4+n6p\njYPlHGbSm7EhEER5AIHnLqhmoeA0dEjCmYDrwj1trM9O2bICqql1UlLEaWeOEBis\n+Pikex4tAgMBAAECggEAIH2EgRdg8YP3MpZyy/sn6R5AdaP7/AKlzE2BTIxDHQUx\nU8hJZ8BIYfo/sTqSWkIn1BQkz4Fb0c8Bq32sZYNoG1+k1tNbFK/KxfYGSl7wp0vd\nTq8C5I6tIHvvsb0v4kAH3NXBRPprgM1C2Yz2X/A+WWcZTXPCWmuPAm0ASMgbWN8j\nU2w6fOw/8ayEhCgwwkaMR/5tWAcDoqvfWD4QeMU48WruNaLPwlm0GNan/vS1APPG\n2tY45BSrqJFXO0lr2b5HfC5TtFtAY8/9kYCuTH4Wj20Xi0/XIlLnLwEbV9kHMhUd\nZzAdFSSTL9IGp6DTwzse/KUCfvHM/LyBl/D6U5s6IwKBgQDqwqDoLpVJdLUOXjST\n+lILvnSX1D+d/wxri8OM7L+MWObQCgIIq7ziCIb+1LNG+uKq6XP0Ob6Sxn5TWh5O\nKlNIseBuy993CDdhFtbH0IswAxNfAmujk3J32BCqeRN6uCYl+hWeqI1aCwrU47sw\n86LLbn2rtg+3M4D+H6C1h8unowKBgQDfa3pOvi641x7yQU2kovzrz0ZP0yYtqeZy\nwSOXsgFf5ubTodKWA1LvNXEsx/WSPRaMYmlBE0kQmHHF0vRihb3o0RnSN2ZILngb\n23JwKtd/RDMuBOz2dyjvgwJlJZkYEUQPxJC8OlsIEc36/DuhZ1cxzZGYgOmJCy98\nLwvWeA2/7wKBgHG6agMxFgdo75GPV79cZETmNkubelpLRbQQGGL8CmuuYdrlDkkv\nEaka4nMvjc5UGl0cDZ2CH+2xFV/B566MWJ599bEXOSHMLC/vxYs1X0iaJNdBL+4l\nry2Z0bEUSLiJ34lEVxbuptO5R70MuhGj5fjRhTYbVA+3dsUlg1COAb4rAoGABQnh\nekEjwJtpYUFDxQC//3lvNoGmjMUWI2RjrxoemdEVR5SQsT1l82sbIE1qJmAmUAgw\nI32R2kP13OZDCK3HeKaulGUXc21I3Cf4zrrInWAmX1VRGsXZMH2d4jYU28wX4tsm\nAHi4cNgl8xEZLyyrdL4UGIJfwe10prJQ7AdNGBUCgYEAnEJcdMBCFocUfUfoSumv\n9mgEMrxi6yymBqvKGidFpDLkNLU/rICUlmFBvpjnLWkTiY7XcweXCRwgQvXhk8bQ\nGSTztLEZK6i11HNsMLP2e0PDQUUykoR6WZXbn3KyTQYzZEnG3dud/7KBS5TdhC99\noBD3I4ddlqz/7n4ztADqNHA=\n-----END PRIVATE KEY-----\n",
    clientEmail:
      "firebase-adminsdk-lkaur@wiply-nextjs13-dev.iam.gserviceaccount.com",
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

// pages/api/updateEmails.js

import { BaseRepository } from "@/app/libraries/firebase";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

const environment = {
    production: false,
    development: true,
    firebaseConfig: {
      apiKey: "AIzaSyDeoPD2CpwyoF26Gau_TtqQEF6F-YdMs-U",
      authDomain: "wiply-nextjs13-dev.firebaseapp.com",
      projectId: "wiply-nextjs13-dev",
      storageBucket: "wiply-nextjs13-dev.appspot.com",
      messagingSenderId: "1054792633262",
      appId: "1:1054792633262:web:527d3ed468af581e9fd63f",
      measurementId: "G-930K75GKSQ",
    },
  };
  
  if (!firebase.apps.length) {
    const app = firebase.initializeApp(environment.firebaseConfig);
    //   console.log("app", app);
  }
  
  const db = firebase.firestore();
  const storage = firebase.storage();
  

export async function GET(req: NextRequest) {
  try {
    console.log(req.nextUrl.searchParams.get('pollId'))
    console.log(req.nextUrl.searchParams.get('winningTeam'))

    // if (!winningTeam) {
    //   return NextResponse.json({
    //     status: 400,
    //     error: "Missing winningTeam parameter",
    //   });
    // }

    // const pollCollection = collection(db, "polls");
    // const q = query(pollCollection, where("predictedTeam", "==", winningTeam));
    // const querySnapshot = await getDocs(q);

    // const batch = db.batch();
    // querySnapshot.forEach((doc) => {
    //   const docRef = doc.ref;
    //   batch.update(docRef, { email: "updated_email@example.com" });
    // });

    // await batch.commit();

    return NextResponse.json({
      status: 200,
      message: "Emails updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: error });
  }
}

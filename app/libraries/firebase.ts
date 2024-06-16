"use client";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { Base, Poll } from "../types";

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

if (process.env.NX_PUBLIC_USE_EMULATOR === "true") {
  db.useEmulator("localhost", 8080);
  storage.useEmulator("localhost", 9199);
}

export class BaseRepository<T extends Base> {
  private firestore: firebase.firestore.Firestore = db;
  public collectionRef: firebase.firestore.CollectionReference<T>;
  private storageRef = storage.ref();

  constructor(private collectionPath?: string) {
    if (collectionPath) {
      this.collectionRef = this.firestore
        .collection(collectionPath)
        .withConverter(
          this.baseConverter()
        ) as firebase.firestore.CollectionReference<T>;
    }
  }

  baseConverter = <T extends firebase.firestore.DocumentData>() => ({
    toFirestore: (data: T) => {
      // Assuming that 'data' is already compatible with 'DocumentData'.
      return data;
    },
    fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot<T>) => {
      return { id: snap.id, ...snap.data() };
    },
  });

  async create(id: string, entity: T) {
    try {
      const exist = await this.fetch(id);
      if (exist) id = `${id}-${this.getRandomString()}`;
      if (id) {
        this.collectionRef.doc(id).set(entity, { merge: true });
      } else {
        this.collectionRef.add(entity);
      }
      return id;
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, entity: Partial<T>) {
    try {
      const collection = this.collectionRef.doc(id);
      return collection.update(entity);
    } catch (e) {
      console.log(e);
    }
  }

  async handleMultipleUpdates(id: string, option: number) {
    try {
      const pollsRef = this.collectionRef.doc(id);

      console.log("pollsRef", pollsRef);

      db.runTransaction((transaction) => {
        // Get the current vote count
        return transaction
          .get(pollsRef)
          .then((optionDoc: firebase.firestore.DocumentSnapshot<Poll>) => {
            if (!optionDoc.exists) {
              throw new Error("Option document does not exist!");
            }

            const temp = [...optionDoc.data().votes];

            // Calculate new vote count
            const currentVotes = temp[option] || 0;

            console.log("Before", temp);
            const newVoteCount = currentVotes + 1;

            temp[option] = newVoteCount

            console.log("After", temp);

            // Update vote count in transaction
            transaction.update(pollsRef, { votes: temp });

            return newVoteCount; // Return new vote count for logging or further use
          });
      })
        .then((newVoteCount) => {
          console.log(
            `Vote successfully added. New vote count: ${newVoteCount}`
          );
        })
        .catch((error) => {
          console.error("Error adding vote: ", error);
        });
      //   return collection;
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: string) {
    return this.collectionRef.doc(id).delete();
  }

  async deleteExpirationDate(id: string) {
    const ref = this.collectionRef.doc(id);
    ref
      .update({ expirationDate: firebase.firestore.FieldValue.delete() })
      .then(() => {
        console.log("deleted");
      })
      .catch((e) => console.log(e));
  }

  async increment(id: string, field: any, n: number) {
    return this.update(id, {
      [field]: [field]
        ? (firebase.firestore.FieldValue.increment(n) as any)
        : 1,
    } as any);
  }

  async fetch(entityId: string) {
    try {
      const res = await this.collectionRef.doc(entityId).get();
      return res?.data();
    } catch (e) {
      console.log(e);
    }
  }

  subscribe(entityId: string, onChange: (entity: T | null) => void) {
    return this.collectionRef.doc(entityId).onSnapshot((e) => {
      const data = e.data();
      if (data) {
        onChange(data);
      } else {
        onChange(null);
      }
    });
  }

  async fetchAll(filter: Partial<T> = {}) {
    const res = await this.collectionRef.get();
    return res?.docs?.map((d) => d?.data()) || [];
  }

  async fetchAllRef(filter: { condition; value }) {
    const collection = this.collectionRef.where(
      filter.condition,
      "==",
      filter.value
    );
    const res = await collection.get();
    return res;
  }

  subscribeAll(
    onChange: (entity: T[]) => void,
    filter?: { condition: string; value: string }
  ) {
    const collection = filter
      ? this.collectionRef.where(filter.condition, "==", filter.value)
      : this.collectionRef;
    return collection.onSnapshot((res) =>
      onChange(res.docs.map((d) => d.data()))
    );
  }

  async uploadFile(file: File, path: string) {
    const randomId = Math.random().toString(36).substring(2);
    const { ref } = await this.storageRef
      .child(`${path}/images/${randomId}.${file.name.split(".").pop()}`)
      .put(file);
    const url: string = await ref.getDownloadURL();
    return url;
  }

  getRandomString() {
    return Math.floor(Math.random() * 16777215).toString(16);
  }
  get2RandomString() {
    return Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  get4RandomString() {
    return Math.floor(Math.random() * 65536)
      .toString(16)
      .padStart(4, "0");
  }
}

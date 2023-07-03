"use client";

import {
  useState,
  useEffect,
  useMemo,
  useDeferredValue,
} from "react";

const channels = ["channel1", "channel2", "channel3"];

async function loginToChannel() {
  await fetch("/api/loginToChannel?channel=channel1", {
    method: "GET",
    cache: "no-store",
  });
}

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const searchResult = useMemo(() => {
    const getData = async () => {
      await fetch(
        `/api/searchChannel?query=${
          encodeURIComponent(searchQuery) ?? ""
        }`
      );
    };

    getData();
  }, [deferredQuery]);

  useEffect(() => {
    async function authoriseChannel(channel, jwt) {
      const res = await fetch("/api/authoriseChannel", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setChannels(channel);
      }
    }

    if (typeof document !== "undefined") {
      const cookiesArray = document.cookie.split("; ");
      // Get cookies for the channels
      for (const cookie of cookiesArray) {
        const cookieKey = cookie.split("=")[0];
        const cookieValue = cookie.split("=")[1];

        if (cookieKey.includes("channel")) {
          // Request the server to see if the person still has access
          authoriseChannel(cookieKey, cookieValue);
        }
      }
    }
  }, []);

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <div>
      <button
        className="bg-red-400"
        onClick={loginToChannel}
      >
        login to channel 1
      </button>
      {channels ??
        channels.map((channel) => {
          return <div>{channel}</div>;
        })}
      <input
        type="text"
        onChange={handleChange}
        className="border-2 border-slate-500"
      />
      {/* {searchResult.map((result) => {
        <div>{result.name}</div>;
      })} */}
    </div>
  );
}

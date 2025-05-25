import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useParams } from "next/navigation";
import { off } from "node:process";
import React, { useEffect } from "react";

const page = () => {
  const { id } = useParams<{ id: string }>();

  return <div></div>;
};

export default page;

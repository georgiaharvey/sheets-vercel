// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import { parseAll } from "../lib/parseSheets";
import dynamic from "next/dynamic";

// Recharts components imported client-side only
const Charts = dynamic(() => import("../src/Charts"), { ssr: false });

export default function Home() {
  // ... your dashboard code continues here

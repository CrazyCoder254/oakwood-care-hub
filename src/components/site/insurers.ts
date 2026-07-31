import sha from "@/assets/insurers/sha.png";
import aar from "@/assets/insurers/aar.png";
import cic from "@/assets/insurers/cic.png";
import jubilee from "@/assets/insurers/jubilee.png";
import liaison from "@/assets/insurers/liaison.png";
import madison from "@/assets/insurers/madison.png";
import mua from "@/assets/insurers/mua.png";
import oldmutual from "@/assets/insurers/oldmutual.png";

export type Insurer = { name: string; full: string; logo?: string };

export const insurers: Insurer[] = [
  { name: "SHA", full: "Social Health Authority", logo: sha },
  { name: "Linda Mama", full: "Linda Mama Programme" },
  { name: "Britam", full: "Britam Insurance" },
  { name: "Jubilee", full: "Jubilee Health Insurance", logo: jubilee },
  { name: "AAR", full: "AAR Insurance", logo: aar },
  { name: "MUA", full: "MUA Insurance", logo: mua },
  { name: "Liaison", full: "Liaison Group", logo: liaison },
  { name: "M-TIBA", full: "M-TIBA" },
  { name: "Madison", full: "Madison Insurance", logo: madison },
  { name: "CIC", full: "CIC Insurance Group", logo: cic },
  { name: "Old Mutual", full: "Old Mutual", logo: oldmutual },
];

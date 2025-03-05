import React from "react";
import { LinkBoxProps } from "@/interfaces";
import "../App.css";

export default function LinkBox({ item }: LinkBoxProps) {
  return (
    <a
      href={item.link}
      className={"LinkBox"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={item.logo} alt={"Logo-" + item.name} />
      <span>{item.name}</span>
    </a>
  );
}

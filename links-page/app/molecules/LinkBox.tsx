import { LinkItem } from "../interfaces";
import "../styles/link-box.css";

interface LinkBoxProps {
  item: LinkItem;
}

/** Botón de un enlace: logo a la izquierda y nombre centrado. */
export default function LinkBox({ item }: LinkBoxProps) {
  return (
    <a className="link-box" href={item.link} target="_blank" rel="noopener noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="link-box__logo" src={`/${item.logo}`} alt="" aria-hidden="true" />
      <span className="link-box__name">{item.name}</span>
    </a>
  );
}

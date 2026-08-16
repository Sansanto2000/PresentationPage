import { LabeledLink } from "../interfaces";
import "../styles/certificates-link.css";

interface CertificatesLinkProps {
  certificates: LabeledLink;
}

/**
 * Acceso al repositorio de certificados. Va suelto sobre el fondo, alineado a
 * la derecha y apoyado en la barra inferior: está a mano sin sumarse a la lista
 * de enlaces principales.
 */
export default function CertificatesLink({ certificates }: CertificatesLinkProps) {
  return (
    <div className="certificates">
      <a
        className="certificates__link"
        href={certificates.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={certificates.label}
      >
        <svg className="certificates__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.2h7A1.5 1.5 0 0 1 19 9.7v7.8A1.5 1.5 0 0 1 17.5 19h-13A1.5 1.5 0 0 1 3 17.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        <span className="certificates__label">{certificates.label}</span>
      </a>
    </div>
  );
}

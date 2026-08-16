import { FooterConfig } from "../interfaces";
import "../styles/site-footer.css";

interface SiteFooterProps {
  config: FooterConfig;
}

/**
 * Barra inferior fija al final de la página. Los bloques de logo y dirección
 * quedan reservados: se activan desde `data/profile.json` cuando existan,
 * sin tocar este componente.
 */
export default function SiteFooter({ config }: SiteFooterProps) {
  // La página es estática: el año queda sellado en el build, no en cada visita.
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__slot site-footer__slot--start">
        {config.logo.enabled ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="site-footer__logo" src={`/${config.logo.src}`} alt={config.logo.alt} />
        ) : null}
      </div>

      <div className="site-footer__center">
        <span className="site-footer__copyright">
          © {year} {config.copyrightHolder}
        </span>
        <a
          className="site-footer__affiliation"
          href={config.affiliation.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {config.affiliation.label}
        </a>
      </div>

      <div className="site-footer__slot site-footer__slot--end">
        {config.address.enabled ? (
          <address className="site-footer__address">{config.address.text}</address>
        ) : null}
      </div>
    </footer>
  );
}

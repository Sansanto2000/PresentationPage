/** Tipos compartidos. Cada interfaz describe la forma de un archivo de `app/data`. */

/** Un enlace del listado principal (`data/links.json`). */
export interface LinkItem {
  name: string;
  logo: string;
  link: string;
}

/** Un título académico obtenido (`data/profile.json`). */
export interface Degree {
  /** Denominación del título, tal como se muestra. */
  name: string;
  /** Casa de estudios que lo otorgó. */
  institution: string;
  /** Año de obtención. */
  year: number;
}

/** Enlace con etiqueta legible, reutilizado en varios lugares. */
export interface LabeledLink {
  label: string;
  link: string;
}

/** Bloques opcionales del pie de página: se activan cuando el dato exista. */
export interface FooterConfig {
  copyrightHolder: string;
  affiliation: LabeledLink;
  logo: { enabled: boolean; src: string; alt: string };
  address: { enabled: boolean; text: string };
}

/** Contenido completo de `data/profile.json`. */
export interface Profile {
  name: string;
  photo: string;
  photoAlt: string;
  degrees: Degree[];
  certificates: LabeledLink;
  footer: FooterConfig;
}

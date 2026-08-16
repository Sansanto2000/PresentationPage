import links from "./data/links.json";
import profile from "./data/profile.json";
import { LinkItem, Profile } from "./interfaces";
import CertificatesLink from "./molecules/CertificatesLink";
import LinkBox from "./molecules/LinkBox";
import MazeBackground from "./molecules/MazeBackground";
import ProfileHeader from "./molecules/ProfileHeader";
import SiteFooter from "./molecules/SiteFooter";
import "./styles/page.css";

const currentProfile = profile as Profile;
const linkItems = links as LinkItem[];

export default function Home() {
  return (
    <>
      <MazeBackground />

      <div className="page">
        <main className="page__content">
          <section className="stack">
            <ProfileHeader profile={currentProfile} />

            <nav className="stack__links" aria-label="Perfiles y formas de contacto">
              {linkItems.map((item) => (
                <LinkBox key={item.name} item={item} />
              ))}
            </nav>
          </section>
        </main>

        <CertificatesLink certificates={currentProfile.certificates} />
        <SiteFooter config={currentProfile.footer} />
      </div>
    </>
  );
}

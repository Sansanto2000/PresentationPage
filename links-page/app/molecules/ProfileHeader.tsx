import { Profile } from "../interfaces";
import "../styles/profile-header.css";

interface ProfileHeaderProps {
  profile: Profile;
}

/** Encabezado de la página: foto, nombre y títulos obtenidos. */
export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="profile">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="profile__photo" src={`/${profile.photo}`} alt={profile.photoAlt} />

      <h1 className="profile__name">{profile.name}</h1>

      <ul className="profile__degrees">
        {profile.degrees.map((degree) => (
          <li
            key={degree.name}
            className="profile__degree"
            title={`${degree.institution}, ${degree.year}`}
          >
            {degree.name}
          </li>
        ))}
      </ul>
    </header>
  );
}

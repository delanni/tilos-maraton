import type React from "react";
import { Link, useLoaderData } from "react-router-dom";

import { BasePage } from "./BasePage";
import { getAllStages, getEventMeta } from "../services/dataService";
import { FacebookIcon, YoutubeIcon, InstagramIcon, SocialLink } from "../components/icons";
import { PWARefresh } from "../components/PWARefresh";
import type { FestivalInfo, Stage } from "../types";

export const loadFestivalInfo = () => {
  return { eventInfo: getEventMeta(), stages: getAllStages() };
};

function InfoPageHeroSection({ eventInfo }: { eventInfo: FestivalInfo }) {
  return (
    <div className="bg-gradient-to-r from-accent to-main rounded-lg p-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-main to-accent text-background p-2 rounded-lg">
        {eventInfo.eventName}
      </h1>
      <p className="text-2xl mt-2 rounded-lg bg-main text-background text-center">
        ,,{eventInfo.tagline}“
      </p>
      <p className="mt-4 text-lg text-background">📆 {eventInfo.dates}</p>
      <p className="mt-2 text-lg text-background">📍 {eventInfo.location}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={eventInfo.links.maraton.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-text px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors inline-flex items-center"
        >
          Maraton főoldal
        </a>
        <a
          href={eventInfo.links.facebook.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors inline-flex items-center"
        >
          <FacebookIcon />
          Facebook Esemény
        </a>
        <a
          href={eventInfo.links.tickets.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
        >
          Támogatói jegyek
        </a>
        <a
          href={eventInfo.links.program.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
        >
          Programfüzet
        </a>
      </div>
    </div>
  );
}

function InfoPageAboutSection({ eventInfo }: { eventInfo: FestivalInfo }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Mi az a Tilos Maraton?</h2>
      <div className="prose max-w-none">
        {eventInfo.description.map((item, index) => (
          <p key={index} className="text-lg">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function InfoPageDirectivesSection({ eventInfo }: { eventInfo: FestivalInfo }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Fontos!</h2>
      <div className="prose max-w-none">
        {eventInfo.generalDirectives.map((item, index) => (
          <p key={index} className="text-lg">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function InfoPageLocationSection({ eventInfo }: { eventInfo: FestivalInfo }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Helyszín</h2>
      <div className="space-y-4">
        <a
          href={eventInfo.links.googleMaps.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-blue-600 font-medium hover:underline flex items-center"
        >
          <div>
            <p>{eventInfo.location}</p>
            <p className="text-gray-600">{eventInfo.address}</p>
          </div>
        </a>
      </div>
    </div>
  );
}

function InfoPageStagesSection({ stages }: { stages: Stage[] }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Színpadok</h2>
      {stages
        .filter((e) => !e.hidden)
        .map((stage) => (
          <div key={stage.id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <Link to={`/stage/${stage.id}`} className="block">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{stage.icon}</span>
                  <h3 className="font-medium text-lg">{stage.name}</h3>
                </div>
                <p className="mt-2 md:mt-0 text-gray-600 flex-1">{stage.description}</p>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

function InfoPageContactSection({ eventInfo }: { eventInfo: FestivalInfo }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">Kapcsolat</h2>
      <div className="space-y-2">
        <p>
          Email:{" "}
          <a href={`mailto:${eventInfo.contact}`} className="text-blue-600 hover:underline">
            {eventInfo.contact}
          </a>
        </p>
        {eventInfo.contacts.map((contact) => (
          <p key={contact.role}>
            {contact.role}:{" "}
            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
              {contact.email}
            </a>
          </p>
        ))}
        <p>
          Adástelefon:{" "}
          <a href="tel:+3612153773" className="text-blue-600 hover:underline">
            +36 1 215 3773
          </a>
        </p>
        <div className="pt-4 mt-4 border-t">
          <h3 className="font-medium mb-2">Kövess!</h3>
          <div className="flex space-x-4">
            <SocialLink
              href={eventInfo.links.facebook.url}
              icon={<FacebookIcon />}
              label="Facebook"
            />
            <SocialLink
              href={eventInfo.links.instagram.url}
              icon={<InstagramIcon />}
              label="Instagram"
            />
            <SocialLink href={eventInfo.links.youtube.url} icon={<YoutubeIcon />} label="YouTube" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const InfoPage: React.FC = () => {
  const { eventInfo, stages } = useLoaderData<typeof loadFestivalInfo>();

  return (
    <BasePage>
      <div className="space-y-8 p-4">
        <InfoPageHeroSection eventInfo={eventInfo} />
        <InfoPageAboutSection eventInfo={eventInfo} />
        <InfoPageDirectivesSection eventInfo={eventInfo} />
        <InfoPageLocationSection eventInfo={eventInfo} />
        <InfoPageStagesSection stages={stages} />
        <div className="bg-white rounded-lg shadow-sm">
          <PWARefresh onRefresh={() => window.location.reload()} />
        </div>
        <InfoPageContactSection eventInfo={eventInfo} />
      </div>
    </BasePage>
  );
};

export default InfoPage;

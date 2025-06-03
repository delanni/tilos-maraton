import type React from 'react';
import { BasePage } from './BasePage';
import type { FestivalInfo } from '../types';
import { useLoaderData } from 'react-router-dom';
import { getEventMeta } from '../services/dataService';
import type { LoaderFunction } from 'react-router-dom';

export const loadFestivalInfo: LoaderFunction = () => {
  return getEventMeta();
};  

export const InfoPage: React.FC = () => {

  const eventInfo = useLoaderData() as FestivalInfo;

  return (
    <BasePage title="Festival Information">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold">{eventInfo.eventName}</h1>
          <p className="text-2xl mt-2">{eventInfo.tagline}</p>
          <p className="mt-4 text-lg">{eventInfo.dates} • {eventInfo.location}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a 
              href={eventInfo.facebookEvent} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Facebook Event
            </a>
            <a href={eventInfo.ticketsLink} target="_blank" rel="noopener noreferrer" className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
              Get Tickets
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">About the Festival</h2>
          <div className="prose max-w-none">
            <p className="text-lg">{eventInfo.description}</p>
          </div>
        </div>

        {/* Location Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Venue</h3>
                <p>{eventInfo.location}</p>
                <p className="text-gray-600">{eventInfo.address}</p>
              </div>
              <div>
                <h3 className="font-medium">Public Transport</h3>
                <p>Bus: 7, 7E, 8E, 108E, 110, 112, 133E</p>
                <p>Tram: 1, 1A, 19, 41, 56, 56A</p>
              </div>
              <a href="https://www.google.com/maps/place/D%C3%BCrer+Kert/@47.516667,19.066667,17z/data=!3m1!4b1!4m5!3m4!1s0x4741d4b3b3b3b3b3:0x4b4b4b4b4b4b4b4b!8m2!3d47.516667!4d19.066667" target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-600 font-medium hover:underline flex items-center">
                View on Map →
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {eventInfo.faq.map((item, index) => (
              <div key={`faq-${index}`} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-lg">{item.question}</h3>
                <p className="text-gray-700 mt-1">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <div className="space-y-2">
            <p>Email: <a href={`mailto:${eventInfo.contact}`} className="text-blue-600 hover:underline">{eventInfo.contact}</a></p>
            <p>Phone: +36 1 555 1234</p>
            <div className="pt-4 mt-4 border-t">
              <h3 className="font-medium mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default InfoPage;

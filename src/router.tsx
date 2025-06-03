import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Timetable from './components/TimetableNew';
import { InfoPage, loadFestivalInfo } from './pages/InfoPage';
import { ArtistPage, loadArtistPageData } from './pages/ArtistPage';
import { PerformancePage, loadPerformancePageData } from './pages/PerformancePage';
import { StagePage, loadStagePageData } from './pages/StagePage';
import { DayPage, loadDayPageData } from './pages/DayPage';
import type { Day } from './types';
import { getAllDays, getAllPerformances } from './services/dataService';

// Types for loader return values
interface TimetableLoaderData {
  performances: ReturnType<typeof getAllPerformances>;
  days: Day[];
}

// Loader functions for each route
const loadTimetableData = (): TimetableLoaderData => {
  const performances = getAllPerformances();
  const days = getAllDays();
  return { performances, days };
};

// Create the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Timetable />,
        loader: () => loadTimetableData(),
      },
      {
        path: 'info',
        element: <InfoPage />,
        loader: loadFestivalInfo,
      },
      {
        path: 'artist/:id',
        element: <ArtistPage />,
        loader: loadArtistPageData,
      },
      {
        path: 'performance/:id',
        element: <PerformancePage />,
        loader: loadPerformancePageData,
      },
      {
        path: 'stage/:id',
        element: <StagePage />,
        loader: loadStagePageData,
      },
      {
        path: 'day/:id',
        element: <DayPage />,
        loader: loadDayPageData,
      },
    ],
  },
]);

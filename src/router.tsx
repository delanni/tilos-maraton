import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import TimetablePage, { loadTimetableData } from "./pages/TimetablePage";
import { InfoPage, loadFestivalInfo } from "./pages/InfoPage";
import { ArtistPage, loadArtistPageData } from "./pages/ArtistPage";
import { PerformancePage, loadPerformancePageData } from "./pages/PerformancePage";
import { StagePage, loadStagePageData } from "./pages/StagePage";
import { DayPage, loadDayPageData } from "./pages/DayPage";
import { SearchPage, loadSearchPageData } from "./pages/SearchPage";
import MapPage, { loadMapPageData } from "./pages/MapPage";

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          index: true,
          element: <TimetablePage />,
          loader: loadTimetableData,
        },
        {
          path: "info",
          element: <InfoPage />,
          loader: loadFestivalInfo,
        },
        {
          path: "artist/:id",
          element: <ArtistPage />,
          loader: loadArtistPageData,
        },
        {
          path: "performance/:id",
          element: <PerformancePage />,
          loader: loadPerformancePageData,
        },
        {
          path: "stage/:id",
          element: <StagePage />,
          loader: loadStagePageData,
        },
        {
          path: "day/:id",
          element: <DayPage />,
          loader: loadDayPageData,
        },
        {
          path: "search",
          element: <SearchPage />,
          loader: loadSearchPageData,
        },
        {
          path: "map",
          element: <MapPage />,
          loader: loadMapPageData,
        },
      ],
    },
  ],
  {
    basename: process.env.BASE_NAME || "/",
  },
);

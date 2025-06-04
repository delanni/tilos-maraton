import { Link, useLoaderData } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { getAllStages } from "../services/dataService";
import { BasePage } from "./BasePage";

export const loadMapPageData = () => {
  return { stages: getAllStages() };
};

export default function MapPage() {
  const { stages } = useLoaderData<typeof loadMapPageData>();

  return (
    <BasePage>
      <h1 className="text-3xl font-bold mb-4">Térkép</h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        <MapComponent />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Színpadok</h2>
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="border rounded-lg p-4 mb-4 bg-white shadow-sm"
            >
              <Link to={`/stage/${stage.id}`} className="block">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{stage.icon}</span>
                    <h3 className="font-medium text-lg">{stage.name}</h3>
                  </div>
                  <p className="mt-2 md:mt-0 text-gray-600 flex-1">
                    {stage.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </BasePage>
  );
}

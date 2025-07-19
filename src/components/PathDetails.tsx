
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

type PathDetailsProps = {
  path: Location[] | null;
  totalCost: number | null;
};

const PathDetails: React.FC<PathDetailsProps> = ({ path, totalCost }) => {
  if (!path || !totalCost) {
    return (
      <Card className="w-full mt-4 bg-gray-800 text-gray-100 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium text-purple-300">Path Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-6">
            Select start and end points on the map and click "Find Path" to see the route details
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="w-full mt-4 bg-gray-800 text-gray-100 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-purple-300">Path Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="font-medium text-lg mb-2 flex items-center justify-between">
            <span>Route Stations</span>
            <span className="text-purple-300 font-semibold">
              {path.length} stops
            </span>
          </div>
          {path.map((location, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                {index < path.length - 1 && (
                  <div className="absolute top-6 bottom-0 left-1/2 w-0.5 h-full bg-purple-900 -translate-x-1/2" />
                )}
              </div>
              <div className="flex-1 bg-gray-900 rounded-md p-2">
                <div className="font-medium text-purple-200">{location.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="inline-block align-middle">📍</span>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Distance Cost:</span>
            <span className="text-xl font-bold text-purple-400">
              {(totalCost / 1000).toFixed(2)} KM
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Optimized using A* algorithm with geographical distance heuristics
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PathDetails;


import MapComponent from '@/components/MapComponent';
import PathDetails from '@/components/PathDetails';
import React, { useState } from 'react';

type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

type PathData = {
  path: Location[];
  totalCost: number;
};

const Index: React.FC = () => {
  const [pathData, setPathData] = useState<PathData | null>(null);

  const handlePathFound = (data: PathData) => {
    setPathData(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">Dynamic A* Pathfinding with Neo4j</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find the most efficient routes between destinations using advanced A* pathfinding algorithm
          </p>
        </header>
        <div className="space-y-6">
          <MapComponent onPathFound={handlePathFound} />
          <PathDetails
            path={pathData?.path || null}
            totalCost={pathData?.totalCost || null}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

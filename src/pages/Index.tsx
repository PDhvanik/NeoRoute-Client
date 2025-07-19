import MapComponent from '@/components/MapComponent';
import PathDetails from '@/components/PathDetails';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChevronDown } from "lucide-react";
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
  const h1Ref = React.useRef<HTMLHeadingElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(true);

  const handlePathFound = (data: PathData) => {
    setPathData(data);
  };

  const scrollToH1 = () => {
    if (h1Ref.current) {
      h1Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (!h1Ref.current) return;
      const h1Top = h1Ref.current.getBoundingClientRect().top;
      // Hide button if h1 is at or above the top of the viewport
      setShowScrollButton(h1Top > 60); // 60px buffer for nav/margin
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative">
      {/* Scroll Down Button */}
      {showScrollButton && (
        <button
          onClick={scrollToH1}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-purple-700 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg animate-bounce focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Scroll to title"
          style={{ transition: 'background 0.2s' }}
        >
          <ChevronDown className="h-7 w-7" />
        </button>
      )}
      <div className="max-w-5xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <div className='flex justify-center'><DotLottieReact
            src="/Location_finding.lottie"
            loop
            autoplay
            style={{ height: "740px", width: "740px" }}
          /></div>
          <h1 ref={h1Ref} className="text-3xl font-bold text-purple-400 mb-2">Dynamic A* Pathfinding with Neo4j</h1>
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

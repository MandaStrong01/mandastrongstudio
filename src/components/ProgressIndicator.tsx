import { Check, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentPage: number;
}

export default function ProgressIndicator({ currentPage }: ProgressIndicatorProps) {
  const workflows = [
    { phase: 'Pre-Production', pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], color: 'blue' },
    { phase: 'Production', pages: [11, 12, 13, 14, 15, 16], color: 'purple' },
    { phase: 'Post-Production', pages: [17, 18, 19, 20, 21], color: 'green' },
  ];

  const currentWorkflow = workflows.find(w => w.pages.includes(currentPage));
  if (!currentWorkflow) return null;

  const completedPhases = workflows.filter(w =>
    Math.max(...w.pages) < currentPage
  );

  const colorClasses = {
    blue: 'bg-blue-600 border-blue-500 text-blue-100',
    purple: 'bg-purple-600 border-purple-500 text-purple-100',
    green: 'bg-green-600 border-green-500 text-green-100',
  };

  const currentIndex = currentWorkflow.pages.indexOf(currentPage);
  const progress = ((currentIndex + 1) / currentWorkflow.pages.length) * 100;

  return (
    <div className="fixed bottom-4 left-4 z-30 bg-black/95 backdrop-blur border border-purple-500 rounded-md p-1.5 max-w-[150px]">
      <div className="flex items-center gap-1 mb-1">
        {workflows.map((workflow) => {
          const isCompleted = completedPhases.includes(workflow);
          const isCurrent = workflow === currentWorkflow;

          return (
            <div
              key={workflow.phase}
              className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[7px] font-semibold transition-all ${
                isCurrent
                  ? colorClasses[workflow.color as keyof typeof colorClasses]
                  : isCompleted
                  ? 'bg-green-800 border border-green-600 text-green-200'
                  : 'bg-gray-800 border border-gray-600 text-gray-400'
              }`}
            >
              {isCompleted ? (
                <Check className="w-1.5 h-1.5" />
              ) : (
                <Circle className="w-1.5 h-1.5" fill={isCurrent ? "currentColor" : "none"} />
              )}
              <span className="hidden sm:inline text-[6px]">{workflow.phase}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-0.5">
        <div className="flex justify-between items-center text-[8px]">
          <span className="text-white font-semibold">{currentWorkflow.phase}</span>
          <span className="text-gray-400 text-[7px]">
            {currentIndex + 1}/{currentWorkflow.pages.length}
          </span>
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              currentWorkflow.color === 'blue' ? 'bg-blue-500' :
              currentWorkflow.color === 'purple' ? 'bg-purple-500' :
              'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

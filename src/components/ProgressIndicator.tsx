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
    <div className="fixed top-4 left-4 z-30 bg-black/90 backdrop-blur border-2 border-purple-500 rounded-lg p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        {workflows.map((workflow) => {
          const isCompleted = completedPhases.includes(workflow);
          const isCurrent = workflow === currentWorkflow;

          return (
            <div
              key={workflow.phase}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                isCurrent
                  ? colorClasses[workflow.color as keyof typeof colorClasses]
                  : isCompleted
                  ? 'bg-green-800 border border-green-600 text-green-200'
                  : 'bg-gray-800 border border-gray-600 text-gray-400'
              }`}
            >
              {isCompleted ? (
                <Check className="w-3 h-3" />
              ) : (
                <Circle className="w-3 h-3" fill={isCurrent ? "currentColor" : "none"} />
              )}
              <span className="hidden sm:inline">{workflow.phase}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white font-semibold">{currentWorkflow.phase}</span>
          <span className="text-gray-400">
            Step {currentIndex + 1} of {currentWorkflow.pages.length}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
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

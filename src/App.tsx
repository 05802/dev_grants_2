import { useEffect } from 'react';
import { useApplicationStore } from './stores/applicationStore';
import { QuestionEditor } from './components/editor/QuestionEditor';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { application, setApplication } = useApplicationStore();

  // Initialize demo application on mount
  useEffect(() => {
    if (!application) {
      const demoApplication = {
        id: uuidv4(),
        title: 'Community Development Grant Application',
        questions: [
          {
            id: 'q1',
            title: 'Project Overview',
            promptText:
              'Provide a comprehensive overview of your proposed project, including its objectives, target beneficiaries, and expected outcomes.',
            maxWords: 500,
            currentVersionId: 'v1',
            versions: [
              {
                id: 'v1',
                content: '',
                wordCount: 0,
                createdAt: new Date(),
                source: 'user' as const,
              },
            ],
          },
          {
            id: 'q2',
            title: 'Need and Context',
            promptText:
              'Describe the community need or problem your project addresses. Include relevant data and evidence to support your case.',
            maxWords: 400,
            currentVersionId: 'v2',
            versions: [
              {
                id: 'v2',
                content: '',
                wordCount: 0,
                createdAt: new Date(),
                source: 'user' as const,
              },
            ],
          },
          {
            id: 'q3',
            title: 'Implementation Plan',
            promptText:
              'Outline your implementation strategy, including timeline, key activities, and resource allocation.',
            maxWords: 600,
            currentVersionId: 'v3',
            versions: [
              {
                id: 'v3',
                content: '',
                wordCount: 0,
                createdAt: new Date(),
                source: 'user' as const,
              },
            ],
          },
        ],
        logframe: {
          id: 'lf1',
          goal: '',
          outcomes: [],
          outputs: [],
          activities: [],
        },
        criteria: [
          {
            id: 'c1',
            name: 'Project Clarity',
            description: 'Clarity and coherence of project description',
            type: 'rubric' as const,
            weight: 25,
            items: [
              {
                id: 'c1i1',
                description: 'Clear statement of objectives',
                maxScore: 10,
              },
              {
                id: 'c1i2',
                description: 'Well-defined target beneficiaries',
                maxScore: 10,
              },
            ],
          },
          {
            id: 'c2',
            name: 'Evidence of Need',
            description: 'Quality of evidence supporting the identified need',
            type: 'rubric' as const,
            weight: 20,
            items: [
              {
                id: 'c2i1',
                description: 'Use of relevant data and statistics',
                maxScore: 10,
              },
            ],
          },
        ],
      };

      setApplication(demoApplication);
    }
  }, [application, setApplication]);

  if (!application) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-primary">
        <div className="text-text-muted">Loading application...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="h-14 border-b border-border-muted bg-bg-secondary flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">PEN</h1>
            <p className="text-xs text-text-muted">
              Grant Application Writing Platform
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <span className="text-sm text-text-secondary">
            {application.title}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Question List */}
        <aside className="w-64 border-r border-border-muted bg-bg-secondary overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Questions
            </h2>
            <nav className="space-y-1">
              {application.questions.map((question, index) => (
                <button
                  key={question.id}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-text-muted font-mono text-xs mt-0.5">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {question.title}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {question.versions.find(
                          (v) => v.id === question.currentVersionId
                        )?.wordCount || 0}{' '}
                        / {question.maxWords || '∞'} words
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 overflow-hidden">
          {application.questions.length > 0 && (
            <QuestionEditor questionId={application.questions[0].id} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import { formatDistanceToNow } from "date-fns";

interface RecentQuestion {
  id: number;
  question: string;
  timestamp: string;
}

interface RecentQuestionsProps {
  questions: RecentQuestion[];
}

export default function RecentQuestions({ questions }: RecentQuestionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary-500 text-white">
        <h3 className="font-semibold">Recent Questions</h3>
      </div>
      <div className="p-4">
        {questions.length === 0 ? (
          <p className="text-neutral-500 text-sm">No recent questions yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {questions.map((question) => (
              <li key={question.id} className="py-2">
                <a href="#" className="hover:text-primary-600">{question.question}</a>
                <p className="text-xs text-neutral-500 mt-1">
                  Asked {formatDistanceToNow(new Date(question.timestamp))} ago
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

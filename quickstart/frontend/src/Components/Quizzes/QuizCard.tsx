import React, { useState } from 'react';
import { financeQuizzes, Question } from '../../data/financeQuizzes';
import { useStreak } from '../../Context/StreakContext';
import './QuizCard.css';

export const QuizCard = () => {
  const { updateStreak, streak } = useStreak();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const startQuiz = (quizKey: string) => {
    setQuestions([...financeQuizzes[quizKey]].sort(() => 0.5 - Math.random()));
    setSelectedQuiz(quizKey);
    setCurrentIdx(0);
    setScore(0);
    setUserAnswer(null);
  };

  const handleAnswer = (option: string) => {
    if (userAnswer) return;
    setUserAnswer(option);
    if (option === questions[currentIdx].answer) setScore(s => s + 1);
  };

  const nextQuestion = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setUserAnswer(null);
    } else {
      await updateStreak();
      setSelectedQuiz(null);
      alert(`Well done! Score: ${score}/${questions.length}`);
    }
  };

  if (!selectedQuiz) {
    return (
      <div className="quiz-section-wrapper">
        <div className="quiz-header-row">
          <h2 className="section-title">Finance Quizzes</h2>
          <div className="scroll-hint">More Quizzes →</div>
        </div>
        <div className="horizontal-quiz-container">
          {Object.keys(financeQuizzes).map((name, index) => (
            <div key={name} className="quiz-glass-card" onClick={() => startQuiz(name)}>
              <div className="card-top">
                <span className="quiz-tag">Quiz 0{index + 1}</span>
                <div className="quiz-icon-circle">{index === 0 ? '💰' : index === 1 ? '📈' : '🏆'}</div>
              </div>
              <div className="card-content">
                <h3>{name}</h3>
                <p>{financeQuizzes[name].length} Questions</p>
              </div>
              <button className="premium-start-btn">Take Quiz</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  return (
    <div className="active-quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={() => setSelectedQuiz(null)}>✕ Exit</button>
        <div className="progress-wrapper">
          <div className="progress-bar" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="q-count">{currentIdx + 1}/{questions.length}</span>
      </div>
      <h2 className="question-text">{q.question}</h2>
      <div className="options-grid">
        {q.options.map(opt => (
          <button 
            key={opt} 
            className={`option-btn ${userAnswer ? (opt === q.answer ? 'correct' : (opt === userAnswer ? 'incorrect' : '')) : ''}`}
            onClick={() => handleAnswer(opt)}
            disabled={!!userAnswer}
          >
            {opt}
          </button>
        ))}
      </div>
      {userAnswer && (
        <div className="feedback-card">
          <p className="explanation"><strong>Explanation:</strong> {q.explanation}</p>
          <button className="next-btn" onClick={nextQuestion}>
            {currentIdx + 1 === questions.length ? "Finish & Update Streak" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
};
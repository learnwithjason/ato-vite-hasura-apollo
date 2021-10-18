import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import './App.css';

function App() {
  const { loading, error, data } = useQuery(gql`
    query LoadQuestions {
      questions {
        id
        question
        answers {
          id
          text
          count
        }
      }
    }
  `);

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <div className="App">
      {data.questions &&
        data.questions.map((question) => (
          <div key={`question-${question.id}`}>
            <h3>{question.question}</h3>
            {question.answers.map((answer) => (
              <button key={`answer-${answer.id}`}>
                {answer.text} ({answer.count})
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}

export default App;

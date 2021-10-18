import { useState, useEffect } from 'react';
import { useSubscription, useMutation, gql } from '@apollo/client';
import './App.css';

function App() {
  const [castVote] = useMutation(gql`
    mutation VoteForAnswer($id: Int!) {
      update_answers(where: { id: { _eq: $id } }, _inc: { count: 1 }) {
        returning {
          id
          count
          text
        }
      }
    }
  `);

  const { loading, error, data } = useSubscription(gql`
    subscription LoadQuestions {
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
              <button
                key={`answer-${answer.id}`}
                onClick={() => castVote({ variables: { id: answer.id } })}
              >
                {answer.text} ({answer.count})
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}

export default App;

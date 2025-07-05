import { useState } from 'react';


export const Chatbot = () => {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function askVet() {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${url}/ask-vet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse("Error : " + data.error);
      }
    } catch (error) {
      setResponse("Error de red : " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className="text-center">
          <h1 className="mt-5">Asistente veterinario</h1>
          <textarea
            rows={3}
            placeholder="Pregunta"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askVet();
              }
            }}
            className="form-control m-3"
          />
        </div>
        <br />
        <button onClick={askVet} className="btn btn-secondary m-3" disabled={loading}>
          {loading ? 'Cargando...' : 'Preguntar'}
        </button>
        <div >
          <p className="text-start p-5">{response}</p>
        </div>
      </div>
    </div>

  );
}
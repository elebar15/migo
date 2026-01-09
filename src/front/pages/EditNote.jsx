import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

const initialStateNote = {
  event_date: getTodayDate(),
  event_name: "",
  place: "",
  note: "",
  pet_id: "",
};

function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

const formatDateDDMMYYYY = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

export const EditNote = () => {
  const [note, setNote] = useState(initialStateNote);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { lang } = useLanguage();
  const t = translations[lang] || translations.es;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    async function fetchNote() {
      const url = import.meta.env.VITE_BACKEND_URL;

      try {
        const response = await fetch(`${url}/note/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setNote({
            ...data,
          });
        } else {
          setMessage({ type: "danger", text: t.load_note_err });
        }
      } catch {
        setMessage({ type: "danger", text: t.load_note_err });
      }
    }

    fetchNote();
  }, [navigate, id]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function handleChange({ target }) {
    const { name, value, type } = target;
    setNote((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value || "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const url = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${url}/note/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...note,
          event_date: note.event_date,
        }),
      });

      if (response.status === 200) {
        setMessage({ type: "success", text: t.note_updated });
        setTimeout(() => {
          if (note.pet_id) {
            navigate(`/pet-detail/${note.pet_id}`);
          } else {
            navigate("/home");
          }
        }, 1500);
      } else {
        setMessage({ type: "danger", text: t.note_update_err });
      }
    } catch {
      setMessage({ type: "danger", text: t.note_update_err });
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100">
        <h3 className="text-center mb-4">{t.note_update}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="event_nameInput"
              name="event_name"
              placeholder={t.event}
              onChange={handleChange}
              value={note.event_name}
            />
            <label htmlFor="event_nameInput">{t.event}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="placeInput"
              name="place"
              placeholder={t.place}
              onChange={handleChange}
              value={note.place}
            />
            <label htmlFor="placeInput">{t.place}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              id="event_dateInput"
              name="event_date"
              placeholder={t.date_format}
              onChange={handleChange}
              value={note.event_date}
            />
            <label htmlFor="event_dateInput">{t.date}</label>
          </div>

          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="noteInput"
              name="note"
              placeholder={t.notes}
              onChange={handleChange}
              value={note.note}
            />
            <label htmlFor="noteInput">{t.notes}</label>
          </div>
          <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
            {t.save_changes}
          </button>
        </form>

        <div className="d-flex justify-content-center my-3 justify-content-evenly">
          <button
            onClick={() => navigate(`/pet-detail/${note.pet_id}`)}
            className="btn btn-link text-dark text-decoration-none"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

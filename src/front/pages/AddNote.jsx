import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"

const initialStateNote = {
  event_date: "",
  event_name: "",
  place: "",
  note: "",
  pet_id: "",
};


export const AddNote = () => {
  const [note, setNote] = useState(initialStateNote);
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }

    async function fetchPets() {
        const url = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${url}/pets`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPets(data);
        } else {
          console.error("Error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchPets();
  }, [navigate]);

function handleChange({ target }) {
  const { name, value, type } = target;

  setNote((prev) => ({
    ...prev,
    [name]: type === "number" && value !== "" ? Number(value) : value,
  }));
}

async function handleSubmit(event) {
    event.preventDefault();

    const url = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token")

    try {

      const response = await fetch(`${url}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
        ...note,
        event_date: note.event_date,
      }),
    });

    if (response.status === 201) {
      setNote(initialStateNote);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    
    } else {
      alert("Error al registrar la nota");
    }
  } catch (error) {
    alert("Occurio un error al registrar la nota.");
  }
}

  function handleResize(event) {
    const textarea = event.target;
    textarea.style.height = "auto"; 
    // textarea.style.height = `${textarea.scrollHeight}px`; 
  }


return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-ms-6">
          <form className="border rounded m-2 p-4" onSubmit={handleSubmit}>
           <h3 className="text-center mt-3">Añadir una nota</h3><p className="text-center">para</p>
            {pets.length === 1 ? (
              <div className="mb-3">
                <label className="form-label">Mascota</label>
                <input
                  type="text"
                  className="form-control"
                  value={pets[0].name}
                  readOnly
                />
                <input
                  type="hidden"
                  name="pet_id"
                  value={pets[0].id}
                />
              </div>
            ) : pets.length > 1 ? (
              <div className="form-floating">
                <select
                  id="petSelect"
                  name="pet_id"
                  className="form-control"
                  onChange={handleChange}
                  value={note.pet_id}
                >
                  <option value="">quien ?</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="petSelect">Mascota</label>
              </div>
            ) : (
              <p className="text-center">ninguna mascota</p>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="event_nameInput"
                name="event_name"
                placeholder="Nombre del evento"
                onChange={handleChange}
                required
                value={note.event_name} 
              />
              <label htmlFor="event_nameInput">Nombre del evento</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="placeInput"
                name="place"
                placeholder="Lugar"
                onChange={handleChange}
                required
                value={note.place} 
              />
              <label htmlFor="placeInput">Lugar del evento</label>
            </div>

            <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="event_dateInput"
                  name="event_date"
                  placeholder="dd/mm/aaaa"
                  onChange={handleChange}
                  value={note.event_date}
                />
                <label htmlFor="event_dateInput">Fecha (dd/mm/aaaa)</label>
              </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                id="noteInput"
                name="note"
                placeholder="dd/mm/aaaa"
                onChange={handleChange}
                value={note.note}
                rows="10"
                style={{ resize: "none" }} 
                onInput={handleResize} 
                required
              />
              <label htmlFor="noteInput">Notas</label>
            </div>

            <button className="btn btn-outline-primary w-100">Añadir</button>
          </form>
          <div className="d-flex justify-content-center my-3 justify-content-evenly">
            <Link to="/">Regresar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


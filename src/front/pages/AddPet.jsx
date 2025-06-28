import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"

const initialStatePet = {
  name: "",
  species: "",
  breed: "",
  birthDate: "",
  wheight: "",
};

export const AddPet = () => {
  const [pet, setPet] = useState(initialStatePet);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }
}, []);

function handleChange({ target }) {
  const { name, value, type } = target;

  setPet((prev) => ({
    ...prev,
    [name]:
      type === "number" && value !== "" ? Number(value) :
      value,
  }));
}

const isValidDateFormat = (dateStr) => {
      const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
      return regex.test(dateStr);
      };

async function handleSubmit(event) {
      event.preventDefault();

      const url = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token")

      if (!isValidDateFormat(pet.birthDate)) {
        alert("El formato de la fecha debe ser dd/mm/aaaa");
        return;
      }

      try {

        const response = await fetch(`${url}/pet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
          ...pet,
          wheight: parseFloat(pet.wheight),
          birthDate: pet.birthDate,
        }),
      });

      if (response.status === 201) {
        setPet(initialStatePet);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status === 400) {
        alert("La mascota ya existe");
      } else {
        alert("Error al registrar la mascota");
      }
    } catch (error) {
      alert("Un error occurio. Intente de nuevo.");
    }
  }

  return (
      <div className="container">
        <div className="row justify-content-center">
          <h2 className="text-center my-3">Añadir una mascota</h2>
          <div className="col-12 col-md-6">
            <form className="border rounded m-2 p-4" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  name="name"
                  placeholder="Nombre"
                  onChange={handleChange}
                  required
                  value={pet.name} 
                />
                <label htmlFor="nameInput">Nombre</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="speciesInput"
                  name="species"
                  placeholder="Especie"
                  onChange={handleChange}
                  value={pet.species} 
                />
                <label htmlFor="speciesInput">Especie</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="breedInput"
                  name="breed"
                  placeholder="Raza"
                  onChange={handleChange}
                  value={pet.breed} 
                />
                <label htmlFor="breedInput">Raza</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="birthDateInput"
                  placeholder="dd/mm/aaaa"
                  name="birthDate"
                  onChange={handleChange}
                  value={pet.birthDate} 
                />
                <label htmlFor="birthDateInput">Fecha de nacimiento (dd/mm/aaaa)</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="wheightInput"
                  name="wheight"
                  placeholder="Peso"
                  onChange={handleChange}
                  value={pet.wheight}
                />
                <label htmlFor="wheightInput">Peso</label>
              </div>

              <button className="btn btn-outline-primary w-100">Añadir</button>
            </form>
            <div className="d-flex justify-content-center my-3 justify-content-evenly">
              <Link to="/home">Regresar</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


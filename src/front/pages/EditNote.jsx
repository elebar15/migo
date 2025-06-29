import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const EditNote = () => {
    const { id } = useParams()
    const [note, setNote] = useState({
        event_date: "",
        event_name: "",
        place: "",
        note: "",
        pet_id: "",
    })

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const url = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        fetch(`${url}/api/pet/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener los datos de la mascota")
            return res.json()
        })
        .then(data => setPet(data))
        .catch(error => {
            console.error(error)
            alert("No se pudo cargar la mascota")
        })
    }, [id])

    const handleChange = ({ target }) => {
        setPet({ ...pet, [target.name]: target.value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await fetch(`${url}/api/pet/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(pet)
            })

            if (response.ok) {
                alert("Mascota actualizada con éxito")
                navigate("/dashboard")
            } else {
                alert("Error al actualizar la mascota")
            }
        } catch (error) {
            console.error(error)
            alert("Hubo un problema con la solicitud")
        }
    }

    return (
        <div className="container">
            <h2 className="my-4">Editar Mascota</h2>
            <form className="border p-4" onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={pet.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Especie</label>
                    <input
                        type="text"
                        className="form-control"
                        name="species"
                        value={pet.species}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Raza</label>
                    <input
                        type="text"
                        className="form-control"
                        name="breed"
                        value={pet.breed}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Edad</label>
                    <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={pet.age || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Peso (kg)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="wheight"
                        step="0.1"
                        value={pet.wheight || ""}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Guardar Cambios
                </button>
            </form>
        </div>
    )
}

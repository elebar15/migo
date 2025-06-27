import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export function PetDetail() {
    const { store } = useGlobalReducer();
    const { theId } = useParams()

    const pet = store.pets.find(item => item.id === theId);

    if (!pet) {
        return <div className="container mt-5"><p>Mascota no encontrada.</p></div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <h2>{pet.name}</h2>
                    <img src="https://media.4-paws.org/d/2/5/f/d25ff020556e4b5eae747c55576f3b50886c0b90/cut%20cat%20serhio%2002-1813x1811-720x719.jpg" alt={pet.name} />
                </div>
                <div className="col-8">
                    <ul className="list-group list-group-flush mb-3 ">
                        <li className="list-group-item">Especie: {pet.species}</li>
                        <li className="list-group-item">Raza: {pet.breed}</li>
                        <li className="list-group-item">Edad: {pet.age}</li>
                        <li className="list-group-item">Peso: {pet.weight}</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
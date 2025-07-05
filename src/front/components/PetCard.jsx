import { Link } from "react-router-dom";

export function PetCard({ pet }) {
    const defaultImage = "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg";

    return (
        <div className="card my-card h-100 shadow">
            <Link to={`/pet-detail/${pet.id}`} className="text-decoration-none text-dark">
                <div className="position-relative img-container">
                    <img
                        src={pet.image || defaultImage}
                        alt={pet.name || "Mascota"}
                        className="rounded-top-4 card-image"
                    />
                </div>
                <div className="card-body text-center">
                    <h3 className="card-title">{pet.name}</h3>
                </div>
            </Link>
        </div>
    );
}

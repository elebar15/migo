import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { PetCard } from "../components/PetCard";

export const Home = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pets`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("No autorizado");

                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error("Error al obtener mascotas:", error);
                setPets([]);
            }
        };

        fetchPets();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center my-4">Mis Mascotas</h1>
            <div className="row">
                {pets.length > 0 ? (
                    pets.map(pet => (
                        <div key={pet.id} className="col-md-4 mb-3">
                            <PetCard pet={pet} />
                        </div>
                    ))
                ) : (
                    <p>No tienes mascotas registradas.</p>
                )}
            </div>
            <div className="d-flex justify-content-center">
                <Link to={'/add-pet'} className="btn btn-primary rounded-circle"><i className="fa-solid fa-plus"></i></Link>
            </div>
        </div>
    );
};

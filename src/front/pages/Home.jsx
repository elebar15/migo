import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { PetCard } from "../components/PetCard";
import { getAllPets } from "../services/api";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const location = useLocation();

    async function fetchPets() {
        const data = await getAllPets();
        if (data) {
            dispatch({ type: 'SET_PETS', payload: data });
        }
    }

    useEffect(() => {
        fetchPets();
    }, [location.key]);

    return (
        <div className="container">
            <h1 className="text-center my-4">Mis Mascotas</h1>


            <div className="d-flex flex-wrap justify-content-center gap-4">
                {store.pets.length > 0 ? (
                    store.pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))
                ) : (
                    <p>No tienes mascotas registradas.</p>
                )}
            </div>

            <div className="d-flex justify-content-center my-4">
                <Link to="/add-pet" className="btn btn-dark add-pet-btn">
                    <i className="fa-solid fa-plus"></i>
                </Link>
            </div>
        </div>
    );
};

import { useParams, useNavigate, Link } from "react-router-dom";
import { getPetById, deletePetById } from "../services/api";
import { useState, useEffect } from "react";
import { PetMedicalRecord } from "../components/PetMedicalRecord";

export function PetDetail() {
    const { theId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function fetchPet() {
            setIsLoading(true);
            const petFromApi = await getPetById(theId);
            if (petFromApi) {
                setPet(petFromApi);
            } else {
                setPet(null);
            }
            setIsLoading(false);
        }

        fetchPet();
    }, [theId]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                navigate("/home");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    function calculateAge(birthdateStr) {
        const birthdate = new Date(birthdateStr);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
        }


    const handleDelete = async () => {
        try {
            await deletePetById(theId);
            setShowModal(false);
            setMessage({ type: "success", text: "Mascota eliminada con éxito" });
        } catch (error) {
            setShowModal(false);
            setMessage({ type: "danger", text: "Error al eliminar la mascota" });
        }
    };

    if (isLoading) return null;
    if (!pet) return <p>Mascota no encontrada</p>;

    return (
        <div className="container padding-top-d">
            {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}

            <div className="row">
                <div className="col-md-4 mb-3 mr-3">
                    <Link to={`/edit-pet/${theId}`} >
                    <img
                        src={
                            pet.image?.trim()
                                ? pet.image
                                : "https://img.freepik.com/vector-gratis/concepto-mascotas-diferentes_52683-37549.jpg"
                        }
                        alt={pet.name}
                        className="img-fluid rounded-4 shadow object-fit-cover mb-3"
                        style={{ width: "100%", aspectRatio: "1 / 1" }}
                    />
                    </Link>

                    <div className="editable-wrapper position-relative">
                        <h2 className="mb-0 fs-1 fw-bold text-center">{pet.name}</h2>

                        <div className="hover-buttons position-absolute top-0 end-0">
                            <Link to={`/edit-pet/${theId}`} className="btn btn-sm btn-light">
                                <i className="fa-solid fa-pen me-1"></i>
                            </Link>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="fa-solid fa-trash me-1"></i>
                            </button>
                        </div>
                    


                    <div className="row align-items-center mb-3 hover-buttons position-absolute ">
                        <div>
                            <ul className="list-group list-group-flush mb-3 ">
                                <li className="list-group-item fs-5 bg-yellow"><strong>Edad</strong> {calculateAge(pet.birthdate)} {calculateAge(pet.birthdate) === 1 ? 'año' : 'años'}</li>
                                <li className="list-group-item fs-5 bg-yellow"><strong>Peso</strong> {pet.weight} kg</li>
                            </ul>
                        </div>
                    </div>
                </div>
                </div>
                <div className="col-md-8">

                    <PetMedicalRecord petId={theId} />
                </div>
            </div>

            {showModal && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">¿Estás segura/o?</h5>
                                <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>¿Deseas eliminar el perfil de {pet.name}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

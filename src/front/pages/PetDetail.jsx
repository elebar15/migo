import { useParams, useNavigate, Link } from "react-router-dom";
import { getPetById, deletePetById } from "../services/api";
import { useState, useEffect } from "react";
import { PetMedicalRecord } from "../components/PetMedicalRecord";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";
import petPlaceholder from "../assets/img/pet_placeholder.avif";

export function PetDetail() {
    const { theId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [message, setMessage] = useState(null);
    const { lang } = useLanguage();
    const t = translations[lang] || translations.es;

    // Fetch pet
    useEffect(() => {
        async function fetchPet() {
            setIsLoading(true);
            const petFromApi = await getPetById(theId);
            setPet(petFromApi || null);
            setIsLoading(false);
        }
        fetchPet();
    }, [theId]);

    // Automatically navigate after showing a message
    useEffect(() => {
        if (message?.autoNavigate) {
            const timer = setTimeout(() => {
                setMessage(null);
                navigate("/home");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message, navigate]);

    function calculateAge(pet) {
        if (!pet?.birthdate) return null;
        const birthdate = new Date(pet.birthdate);
        if (isNaN(birthdate.getTime())) return null;

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
            setMessage({ type: "success", key: t.pet_erased, autoNavigate: true });
        } catch (error) {
            setShowModal(false);
            setMessage({ type: "danger", key: t.pet_erase_error });
        }
    };

    if (isLoading) return null;
    if (!pet) return <p>{t.pet_not_found}</p>;

    const age = calculateAge(pet);

    return (
        <div className="container padding-top-d">
            {/* Alert */}
            {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {t[message.key]}
                </div>
            )}

            <div className="row">
                <div className="col-md-4 mb-3 mr-3">
                    <Link to={`/edit-pet/${theId}`}>
                        <img
                            src={pet.image?.trim() ? pet.image : petPlaceholder}
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

                        <div className="row align-items-center mb-3 hover-buttons position-absolute">
                            <div>
                                <ul className="list-group list-group-flush mb-3">
                                    <li className="list-group-item fs-5 bg-yellow">
                                        <strong>{t.age}</strong>{" "}
                                        {age !== null ? `${age} ${age === 1 ? t.yearo : t.yearso}` : ""}
                                    </li>
                                    <li className="list-group-item fs-5 bg-yellow">
                                        <strong>{t.weight}</strong> {pet.weight} kg
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <PetMedicalRecord petId={theId} />
                </div>
            </div>

            {/* Delete modal */}
            {showModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{t.sure}</h5>
                                <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{t.eliminate_} {pet.name}?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    {t.cancel}
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                    {t.eliminate}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

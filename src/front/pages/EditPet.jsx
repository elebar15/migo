import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";
import petPlaceholder from "../assets/img/pet_placeholder.avif"

export function EditPet() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const { lang } = useLanguage();
    const t = translations[lang] || translations.es;

    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [weight, setWeight] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [message, setMessage] = useState(null);

    const DEFAULT_IMAGE = petPlaceholder;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPet = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pet/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setPet(data);
                    setName(data.name || "");
                    setBreed(data.breed || "");
                    setBirthdate(formatDate(data.birthdate) || "");
                    setWeight(data.weight || "");
                    setCurrentImage(data.image || "");
                } else {
                    setMessage({ type: "danger", text: t.pet_load_err });
                }
            } catch {
                setMessage({ type: "danger", text: t.pet_load_err });
            }
        };

        fetchPet();
    }, [id]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        let imageUrl = currentImage;

        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", "ml_default");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dhhbxwsi2/image/upload", {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                imageUrl = data.secure_url;
            } catch {
                setMessage({ type: "danger", text: t.img_error });
                return;
            }
        }

        if (!imageUrl || imageUrl.trim() === "") {
            imageUrl = DEFAULT_IMAGE;
        }

        const updatedPet = {
            name,
            breed,
            birthdate,
            weight: parseFloat(weight),
            image: imageUrl
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pet/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedPet),
            });

            if (!response.ok) {
                const responseBody = await response.text();
                setMessage({ type: "danger", text: t.pet_update_err });
                return;
            }

            setMessage({ type: "success", text: t.pet_updated });
            setTimeout(() => navigate(`/pet-detail/${id}`), 1500);
        } catch {
            setMessage({ type: "danger", text: t.netw_err });
        }
    };

    const handleDeleteImage = () => {
        setCurrentImage("");
        setImageFile(null);
    };

    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="green-light rounded shadow p-4 back-login w-100">
                <h2 className="text-center mb-4">{t.edit_pet}</h2>

                {message && (
                    <div className={`alert alert-${message.type}`} role="alert">
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="nameEdit"
                            placeholder={t.name}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="nameEdit">{t.name}</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="breedEdit"
                            placeholder={t.breed}
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                        <label htmlFor="breedEdit">{t.breed}</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="date"
                            className="form-control"
                            id="birthdateEdit"
                            placeholder={t.birthdate}
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                        <label htmlFor="birthdateEdit">{t.birthdate}</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            id="weightEdit"
                            placeholder={t.weight}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <label htmlFor="weightEdit">{t.weight} (kg)</label>
                    </div>

                    {currentImage && (
                        <div className="mb-3 text-center">
                            <label className="form-label">{t.actual_pic}</label>
                            <div>
                                <img
                                    src={currentImage}
                                    alt={t.actual_pic}
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "150px" }}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-danger mt-2"
                                onClick={handleDeleteImage}
                            >
                                {t.elim_pic}
                            </button>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">{t.pic_change}</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={imageFile ? imageFile.name : t.pic}
                                readOnly
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => document.getElementById('hiddenFileInput').click()}
                            >
                                {t.add}
                            </button>
                            <input
                                type="file"
                                id="hiddenFileInput"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>
                    </div>


                    <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
                        {t.keep}
                    </button>
                </form>
            </div>
        </div>
    );
}

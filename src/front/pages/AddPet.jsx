import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";
import petPlaceholder from "../assets/img/pet_placeholder.avif"

const initialStatePet = {
  name: "",
  breed: "",
  birthdate: "",
  weight: "",
};

export const AddPet = () => {
  const [pet, setPet] = useState(initialStatePet);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang] || translations.es;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function handleChange({ target }) {
    const { name, value, type } = target;

    setPet((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const url = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    let imageUrl = petPlaceholder;

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

    try {
      const response = await fetch(`${url}/pet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pet,
          weight: parseFloat(pet.weight),
          image: imageUrl
        }),
      });

      if (response.status === 201) {
        setPet(initialStatePet);
        setImageFile(null);
        setMessage({ type: "success", text: t.pet_registred });
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else if (response.status === 400) {
        setMessage({ type: "danger", text: t.pet_exists });
      } else {
        setMessage({ type: "danger", text: t.pet_register_error });
      }
    } catch {
      setMessage({ type: "danger", text: t.pet_register_error });
    }
  }


  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="green-light rounded shadow p-4 back-login w-100">
        <h2 className="text-center mb-4">{t.add_pet}</h2>

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
              id="nameInput"
              name="name"
              placeholder={t.name}
              onChange={handleChange}
              required
              value={pet.name}
            />
            <label htmlFor="nameInput">{t.name}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="breedInput"
              name="breed"
              placeholder={t.breed}
              onChange={handleChange}
              value={pet.breed}
            />
            <label htmlFor="breedInput">{t.breed}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              id="birthdateInput"
              name="birthdate"
              placeholder={t.birthdate}
              onChange={handleChange}
              value={pet.birthdate}
            />
            <label htmlFor="birthdateInput">{t.birthdate}</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              step="0.1"
              className="form-control"
              id="weightInput"
              name="weight"
              placeholder={t.weight}
              onChange={handleChange}
              value={pet.weight}
            />
            <label htmlFor="weightInput">{t.weight} (kg)</label>
          </div>

          <div className="mb-3">
            <label className="form-label">{t.pic}</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn w-100 text-white fw-bold bg-secondary">
            {t.add}
          </button>
        </form>

        <div className="d-flex justify-content-center mt-3 small">
          <Link to="/home" className="text-dark text-decoration-none">
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );

};

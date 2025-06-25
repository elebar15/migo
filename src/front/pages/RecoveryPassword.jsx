import { useState } from "react";

export const RecoveryPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    if (!isValidEmail) {
      alert("Por favor ingrese un correo electrónico válido");
      return;
    }

    const url = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true);
      const response = await fetch(`${url}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Un link de restauración de la contraseña fue mandado correctamente a su correo.");
      } else {
        alert(`Hubo un error: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      alert("Error en la solicitud. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <h2 className="text-center my-3">Recuperar contraseña</h2>
        <div className="col-12 col-md-6">
          <form className="border m-2 p-3" onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="btnEmail">Correo electrónico: </label>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="form-control"
                id="btnEmail"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </div>

            <button
              className="btn btn-outline-primary w-100"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link de recuperación"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

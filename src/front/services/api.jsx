async function getAllPets() {
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
        return data;

    } catch (error) {
        console.error("Error al obtener mascotas:", error);
        return null;
    }
};


async function getPetById(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pets/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) throw new Error("No autorizado");
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtener la mascota:", error);
        return null;
    }
}

async function getMedicalRecords(pet_id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pets/${pet_id}/clin-history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('No autorizado');
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtener registros medicos:", error)
        return null;
    }
}

async function deleteMedicalRecord(noteId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clin-history/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Error al eliminar el registro");
    return true;

  } catch (error) {
    console.error("Error eliminando registro:", error);
    return false;
  }
}

export {
    getAllPets,
    getPetById,
    getMedicalRecords,
    deleteMedicalRecord
}
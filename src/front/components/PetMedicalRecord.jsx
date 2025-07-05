import { Link } from "react-router-dom";
import { SingleRecord } from "../components/SingleRecord";
import { useEffect, useState } from "react";
import { getMedicalRecords } from "../services/api";

export function PetMedicalRecord({ petId }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    async function fetchRecords() {
        const data = await getMedicalRecords(petId);
        setRecords(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchRecords();
    }, [petId]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="container border border-success-subtle p-3 rounded">
            <div className="row d-flex justify-content-between pb-3">
                <div className="col-4">
                    <h3 className="text-success">Historial médico</h3>
                </div>
                <div className="col-1">
                    <Link to={'/add-note'} className="btn btn-success rounded-circle"><i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}

            {loading ? (
                <p>Cargando registros médicos...</p>
            ) : records.length === 0 ? (
                <p>No hay registros clínicos aún.</p>
            ) : (
                <ul className="list-group">
                    {records.map(record => (
                        <SingleRecord
                            key={record.id}
                            record={record}
                            onDeleteSuccess={() => {
                                setMessage({ type: "success", text: "Nota eliminada correctamente" });
                                fetchRecords();
                            }}
                            onDeleteError={() => {
                                setMessage({ type: "danger", text: "Error al eliminar la nota" });
                            }}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

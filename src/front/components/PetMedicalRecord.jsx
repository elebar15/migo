import { Link } from "react-router-dom";
import { SingleRecord } from "../components/SingleRecord";
import { useEffect, useState } from "react";
import { getMedicalRecords } from "../services/api";
import { translations } from "../services/translations";
import { useLanguage } from "../context/LanguageContext";

export function PetMedicalRecord({ petId }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const { lang } = useLanguage();
    const t = translations[lang] || translations.es;

    async function fetchRecords() {
        const data = await getMedicalRecords(petId);
        setRecords(data);
        setLoading(false);
    }

    const sortedRecords = [...records].sort((a, b) => {
        return new Date(b.event_date) - new Date(a.event_date);
    });

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
        <div className="container p-3 pr-3 border rounded mb-4">
            <div className="row d-flex justify-content-between align-items-center pb-3">
                <div className="col">
                    <h3 className="fw-bold green fs-3 text-center">
                        {t.history}
                    </h3>
                </div>
                <div className="col-auto">
                    <Link
                        to={`/add-note/${petId}`}
                        className="btn my-btn"
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: " #00A39B",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1rem",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            border: "none",
                        }}
                    >
                        <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}

            {loading ? (
                <p>{t.load_hist}</p>
            ) : records.length === 0 ? (
                <p>{t.no_hist}</p>
            ) : (
                <ul className="list-group">
                    {sortedRecords.map((record, index) => (
                        <SingleRecord
                            key={record.id}
                            record={record}
                            index={index}
                            onDeleteSuccess={() => {
                                setMessage({ type: "success", text: t.note_erased });
                                fetchRecords();
                            }}
                            onDeleteError={() => {
                                setMessage({ type: "danger", text: t.note_erase_error });
                            }}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

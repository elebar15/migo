import { Link } from "react-router-dom";

export function SingleRecord({record}) {
    return (
        <li className="list-group-item border-0">
            <div className="card shadow-sm">
                <div className="card-body">

                    <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title mb-0">{record.event_name}</h5>
                        <div className="d-flex gap-2">
                            <Link to={`/edit-note/${record.id}`}><i className="fas fa-pen" role="button" title="Editar"></i></Link>
                            <Link ><i className="fas fa-trash-alt" role="button" title="Borrar"></i></Link>
                        </div>
                    </div>

                    <p className="card-text mb-1"><strong>Lugar</strong> {record.place}</p>
                    <p className="card-text mb-1"><strong>Fecha</strong> {new Date(record.event_date).toLocaleDateString()}</p>
                    <p className="card-text mb-1"><strong>Nota</strong> {record.note}</p>
                </div>
            </div>
        </li>
    );
}

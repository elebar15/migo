export function SingleRecord({record}) {
    return (
        <li className="list-group-item list-group-item-info">
            <div className="card mb-3 shadow-sm">
                <div className="card-body">

                    <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title mb-0">{record.event_name}</h5>
                        <div className="d-flex gap-2">
                            <i className="fas fa-pen" role="button" title="Editar"></i>
                            <i className="fas fa-trash-alt" role="button" title="Borrar"></i>
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

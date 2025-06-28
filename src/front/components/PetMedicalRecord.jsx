import { Link } from "react-router-dom"
import { SingleRecord } from "./SingleRecord"

export function PetMedicalRecord(){
    return (
        <div className="container border border-success-subtle p-3 rounded">
            <div className="row d-flex justify-content-between">
                <div className="col-4">
                    <h3 className="text-success">Historial medico</h3>
                </div>
                <div className="col-1">
                    <Link to={''} className="btn btn-success rounded-circle"><i className="fa-solid fa-plus"></i></Link>
                </div>
                
            </div>
            
        </div>
    )
}
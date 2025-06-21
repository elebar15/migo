import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export function Register() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center my-3">Registrate</h2>
                <div className="col-12 col-md-6">
                    <form className="border rounded m-2 p-4" >
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                name="name"
                                placeholder="name"
                                required
                            />
                            <label for="floatingInput">Name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                name="lastName"
                                placeholder="last name"
                                required
                            />
                            <label for="floatingInput">Last name</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                name="email"
                                placeholder="name@example.com"
                                required
                            />
                            <label for="floatingInput">Email</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingInput"
                                name="password"
                                placeholder="password"
                                required
                            />
                            <label for="floatingInput">Contraseña</label>
                        </div>
                        <button className="btn btn-outline-primary w-100">Registrarme</button>
                    </form>
                    <div className="d-flex justify-content-center my-3 ">
                        <Link to="/login">Ya tengo una cuenta</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
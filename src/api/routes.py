"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, send_email
from flask_cors import CORS
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

api = Blueprint('api', __name__)



expires_in_minutes = 10
expires_delta = timedelta(minutes=expires_in_minutes)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/reset-password", methods=["POST"])
def reset_password():
    if request.method == 'OPTIONS':  
        return '', 200 
    body = request.json 
 
    user = User.query.filter_by(email=body).one_or_none()
    
    if user is None:
        return jsonify("user not found"), 404

    access_token = create_access_token(
        identity=body, expires_delta=expires_delta)

    message = f"""
        <p>Hola,</p>

        <p>Con este link, podrás <a href="{os.getenv("FRONTEND_URL")}/password-update?token={access_token}">recuperar tu contraseña</a>.</p>

        <p>Un saludo</p>

        <p>El equipo Migo</p>
        <p><a href="{os.getenv("FRONTEND_URL")}">Migo.com</a></p>
    """

    data = {
        "subject": "Recuperación de contraseña",
        "to": body,
        "message": message
    }

    sended_email = send_email(
        data.get("subject"), data.get("to"), data.get("message"))

    if sended_email:
        return jsonify("Mensaje correctamente enviado"), 200
    else:
        return jsonify("Error"), 200
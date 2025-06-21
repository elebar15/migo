"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, RoleEnum
from api.utils import generate_sitemap, APIException, send_email
from flask_cors import CORS
from api.utils import set_password, check_password
from base64 import b64encode
import os
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

api = Blueprint('api', __name__)



expires_in_minutes = 10
expires_delta = timedelta(minutes=expires_in_minutes)

# Allow CORS requests to this API
CORS(api)

@api.route('/healt-check', methods=['GET'])
def handle_hello():
    return jsonify("ok"), 200


@api.route('/register', methods=['POST'])
def add_user():
    data = request.json
    email = data.get('email', None)
    name = data.get('name', None)
    lastname = data.get('lastname', None)
    password = data.get('password', None)
    salt = b64encode(os.urandom(32)).decode('utf-8')
    role = RoleEnum.general

    if email == 'valen2004vega@gmail.com':
        role = RoleEnum.admin

    if email is None or name is None or lastname is None or password is None:
        return jsonify('You need an email, a name, a lastname and a password'), 400

    stmt = select(User).where(User.email == email)
    existing_email = db.session.execute(stmt).scalar_one_or_none()

    if existing_email:
        return jsonify({"message": "Email already registered"}), 409

    user = User(email=email, name=name, lastname=lastname,
                password=set_password(password, salt), salt=salt, role=role)

    db.session.add(user)

    try:
        db.session.commit()
        return jsonify('User created'), 201
    except Exception as error:
        db.session.rollback()
        return jsonify(f'Error: {error.args}'), 500

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
import os
from flask import Flask, request, jsonify, url_for, send_from_directory, g, session, redirect, url_for
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_babel import Babel, gettext as _

# Determine environment (development or production)
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for API endpoints
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Configure Flask app URL mapping
app.url_map.strict_slashes = False

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Add the admin interface
setup_admin(app)

# Add the custom commands
setup_commands(app)

# Register API routes
app.register_blueprint(api, url_prefix='/api')

# Handle API errors globally
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generate sitemap for all endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Serve static files (e.g., frontend files)
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Avoid cache memory
    return response

# Add localization
app.config['BABEL_DEFAULT_LOCALE'] = 'es'  # Default language is Spanish
def get_locale():
    if 'lang' in session:
        return session['lang']
    user = getattr(g, 'user', None)
    if user is not None:
        return user.locale
    return request.accept_languages.best_match(['es', 'fr', 'en'])

babel = Babel(app)
babel.init_app(app, locale_selector=get_locale)

@app.route('/change_language/<language>')
def change_language(language):
    supported_languages = ['en', 'fr', 'es']

    if language in supported_languages:
        session['lang'] = language
    else:
        session['lang'] = 'en'

    referrer = request.referrer
    if referrer:
        # Add a small fragment to force a page reload on the client side
        return redirect(referrer + "#reload")  # Or just append any fragment
    else:
        return redirect(url_for('login'))

# This will only run if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

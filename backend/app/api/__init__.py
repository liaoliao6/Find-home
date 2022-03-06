from flask import Blueprint
from flask_cors import CORS

bp = Blueprint('api', __name__, url_prefix='/api')

CORS(bp)

from app.api import users, auth, properties, applications
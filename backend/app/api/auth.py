from flask import jsonify, session
from flask_login import current_user
from functools import wraps

def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        print('logged_in' in session)
        if 'logged_in' in session and session['logged_in']:
            return f(*args, **kwargs)
        else:
            return jsonify(success=False,
                data={'login_required': True},
                message='user not logged in'), 403
    return wrap


def roles_required(roles):
    def func_wrap(f):
        @wraps(f)
        def wrap(*args, **kwargs):

            if current_user.role != 'Admin' and current_user.role not in roles:
                return jsonify(success=False, message='permission denied'), 401
            
            return f(*args, **kwargs)
    
        return wrap

    return func_wrap
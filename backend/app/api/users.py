from flask import jsonify, request, session
from flask_login import login_user, logout_user, current_user
from flask_mail import Message
from .auth import login_required, roles_required
from app.api import bp
from app.models import User
from app import db, mail
import json

@bp.route('/user/signup', methods=['POST'])
def signup():
    payload = request.get_json(force=True)

    new_user = User()
    new_user.from_dict(payload, True)
    db.session.add(new_user)
    db.session.commit() 
  
    return jsonify(new_user.to_dict()), 201


@bp.route('/user/login', methods=['POST'])
def login():
    payload = request.get_json()
    email = payload['email']
    
    user = User.query.filter_by(email=email).first()

    if not user:
        return 'user not found', 404
    
    if not user.check_password(payload['password']):
        return 'invalid credentials', 401
    
    
    session['logged_in'] = True
    login_user(user)

    return jsonify(user.to_dict()), 200


@bp.route('/user/logout', methods=['GET'])
# @login_required
def logout():
    logout_user()
    return 'user logged out', 200


@bp.route('/user/<user_id>/addFavSearch', methods=['PUT'])
# @login_required
def addFavSearch(user_id):
    payload = request.get_json()
    user_to_update = User.query.filter_by(id=user_id).first()
    userObj = user_to_update.to_dict()
    favSearchList = userObj['favorite_search']
    if favSearchList == None:
        favSearchList = []
    else:
        favSearchList = json.loads(favSearchList)
    favSearchList.append(payload)
    
    user_to_update.favorite_search = json.dumps(favSearchList)
    db.session.commit() 
    return jsonify(favSearchList[:-1]), 200


@bp.route('/user/<user_id>/removeFavoriteSearch', methods=['PUT'])
def removeFavSearch(user_id):
    payload = request.get_json()
    user_to_update = User.query.filter_by(id=user_id).first()
    userObj = user_to_update.to_dict()
    favSearchList = userObj['favorite_search']
    favSearchList = json.loads(favSearchList)
    toDelete = {}
    for search in favSearchList:
        if search["queryStr"] == payload["queryStr"]:
            toDelete = search
            favSearchList.remove(search)
            break
    user_to_update.favorite_search = json.dumps(favSearchList)
    db.session.commit()
    return jsonify({"deleted": json.dumps(toDelete)}), 201


@bp.route('/user/<user_id>/favSearches', methods=['GET'])
def getFavoriteSearches(user_id):
    user = User.query.filter_by(id=user_id).first()
    userObj = user.to_dict()
    favSearches = userObj['favorite_search']
    if favSearches == None:
        favSearches = []
    else:
        favSearches = json.loads(favSearches)
    return jsonify({"favSearches": json.dumps(favSearches) }), 200

@bp.route('/user/<user_id>/update', methods=['PUT'])
# @login_required
def update(user_id):

    # if current_user.role != 'admin' and user_id != current_user.id:
    #     return "permission denied", 403

    payload = request.get_json()

    user_to_update = User.query.filter_by(id=user_id).first()

    if 'email' in payload:
        user_to_update.email = payload['email']
    
    if 'password' in payload:
        user_to_update.set_password(payload['password'])
    
    if 'role' in payload:
        user_to_update.role = payload['role']

    if 'favorite_houses' in payload:
        user_to_update.favorite_houses = payload['favorite_houses']
    
    if 'favorite_search' in payload:
        user_to_update.favorite_search = payload['favorite_search']
        
    db.session.commit()

    return jsonify(user_to_update.to_dict()), 201


@bp.route('/user/<user_id>/delete', methods= ['DELETE'])
# @login_required
def delete(user_id):
    
    deleted_user = User.query.filter_by(id=user_id).first()

    # if current_user.role != 'admin' and current_user.id != deleted_user.id:
    #     return 'unauthorized', 401

    db.session.delete(deleted_user)
    db.session.commit()

    return jsonify(deleted_user.to_dict()), 201


@bp.route('/users', methods=['GET'])
# @login_required
# @roles_required(roles=['Admin'])
def get_users():

    user_id = request.args.get('user_id')

    # if current_user.id != user_id and current_user.role != 'Admin':
    #     return 'unauthorized', 401

    if not user_id:
        users = User.query.all()

        if not users or len(users) == 0:
            return [], 201
        
        user_result = []

        for user in users:
            user_result.append(user.to_dict())

        return jsonify(user_result), 200
    
    user = User.query.filter_by(id=user_id).first()

    if not user:

        return 'user not found', 404
    
    return jsonify(user.to_dict()), 200


@bp.route('/user/<user_id>/approve', methods=['GET'])
# @login_required
# @roles_required(roles=['admin'])
def approve_user(user_id):

    user = User.query.filter_by(id=user_id).first()

    if not user:

        return 'user not found', 401

    user.status = 'APPROVED'
    # user_email = user.email
    # msg = Message("You have been approved to use homefinder!", recipients=[user_email])
    # mail.send(msg)
    db.session.commit()

    return jsonify(user.to_dict()), 200


@bp.route('/updateUsers', methods=['POST'])
# @login_required
# @roles_required(roles=['admin'])
def updateUsers():
    payload = request.get_json()
    users = payload['users']
    status = payload['status']
    updatedUser = []
    for user in users:
        userQueried = User.query.filter_by(id=user['id']).first()
        userQueried.status = status
        
        db.session.commit()
        statusTermMap = {'APPROVED': 'approved',
                         'PENDING' : 'disqualified',}
        # user_email = userQueried.email
        # msg = Message("You have been " + statusTermMap[status] +" to use homefinder!", recipients=[user_email])
        # mail.send(msg)

        updatedUser.append({'id': user['id'], 'email': user['email'], 'status': userQueried.to_dict()['status']})

    return jsonify({"updatedUsers": json.dumps(updatedUser)}), 200


@bp.route('/deleteUsers', methods=['POST'])
# @login_required
# @roles_required(roles=['admin'])
def deleteUsers():
    payload = request.get_json()
    usersToDelete = payload['users']
    result = []
    for user in usersToDelete:
        userQueried = User.query.filter_by(id=user['id']).first()
        db.session.delete(userQueried)
        db.session.commit()
        result.append({'id': user['id'], 'email': user['email']})
    return jsonify({'deletedUsers': json.dumps(result)}), 200
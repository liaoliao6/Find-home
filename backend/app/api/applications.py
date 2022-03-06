from flask import jsonify, request, session
from flask_login import current_user
from flask_mail import Message
from .auth import login_required, roles_required
from app.api import bp
from app.models import Application, User
from app import db, mail


@bp.route('/application/apply', methods=['POST'])
# @login_required
def apply():

    payload = request.get_json(force=True)

    new_application = Application()
    new_application.from_dict(payload)

    db.session.add(new_application)
    db.session.commit() 
  
    return jsonify(new_application.to_dict()), 201


@bp.route('/applications/<property_id>', methods=['GET'])
# @login_required
# @roles_required(roles=['seller', 'realtor', 'landlord', 'admin'])
def get_applications_by_property_id(property_id):

    application_results = []
    applications = []

    applications = Application.query.filter_by(property_id=property_id).all()

    if len(applications) == 0:
        return 'no applications found', 404

    for application in applications:
        application_results.append(application.to_dict())
        
    # return jsonify(application_results.to_dict()), 200
    # AttributeError: 'list' object has no attribute 'to_dict'
    return jsonify(application_results), 200


# yuxin GET applications by approver id
@bp.route('/applications/approver/<approverId>', methods=['GET'])
# @login_required
# @roles_required(roles=['seller', 'realtor', 'landlord', 'admin'])
def get_applications_by_approver_id(approverId):

    application_results = []
    applications = db.session.query(User, Application).filter(Application.applicant_id == User.id).all()
    # Application.query.filter_by(approver_id=approverId).all()
    if len(applications) == 0:
        return jsonify([]), 200
  
    for user, application in applications:
        appliDict = application.to_dict()
        userDict = user.to_dict()

        appliDict["first_name"] = userDict["first_name"]
        appliDict["last_name"] = userDict["last_name"]
        

        application_results.append(appliDict)
    # return jsonify(application_results.to_dict()), 200
    return jsonify(application_results), 200




@bp.route('/applications/<user_id>', methods=['GET'])
# @login_required
def get_my_applications(user_id):
    application_results = []
    applications = []

    # if current_user.role != 'admin' and current_user.id != user_id:
    #     return 'unauthorized', 401

    applications = Application.query.filter_by(applicant_id=user_id).all()

    if len(applications) == 0:
        return 'no applications found', 404

    for application in applications:
        application_results.append(application.to_dict())
        
    return jsonify(application_results), 200


@bp.route('/applications/applied', methods=['GET'])
# @login_required
# @roles_required(roles=['seller', 'realtor', 'landlord'])
def get_applications():
    application_results = []
    applications = []

    applications = Application.query.filter_by(approver_id=current_user.id).all()

    if len(applications) == 0:
        return 'no applications found', 404

    for application in applications:
        application_results.append(application.to_dict())
        
    return jsonify(application_results), 200


@bp.route('/application/<application_id>/approve', methods=['GET'])
# @login_required
# @roles_required(roles=['seller', 'realtor', 'landlord', 'admin'])
def approve_application(application_id):

    #application = Application.query.fitler(id=application_id, approver_id=current_user.id).first()
    application = Application.query.filter_by(id=application_id).first()

    if not application:
        return 'no application found', 404
    
    application.status = 'APPROVED'

    # user = User.query.filter(id=application.applicant_id).first()
    user = User.query.filter_by(id=application.applicant_id).first()

    if not user:
        return 'cannot find applicant', 404

    # user_email = user.email
    # msg = Message("Your application have been approved to use homefinder!", recipients=[user_email])
    # mail.send(msg)
    db.session.commit()

    return 'application is approved', 200


@bp.route('/application/<application_id>/reject', methods=['GET'])
# @login_required
# @roles_required(['seller', 'realtor', 'landlord', 'admin'])
def reject_application(application_id):

    # application = Application.query.fitler(id=application_id, approver_id=current_user.id).first()
    application = Application.query.filter_by(id=application_id).first()
    
    if not application:
        return 'no application found', 404
    
    application.status = 'REJECTED'

    # user = User.query.filter(id=application.applicant_id).first()
    user = User.query.filter_by(id=application.applicant_id).first()

    if not user:
        return 'cannot find applicant', 404

    # user_email = user.email
    # msg = Message("Your application have been rejected to use homefinder!", recipients=[user_email])
    # mail.send(msg)
    db.session.commit()

    return 'application is rejected', 200


@bp.route('/application/<application_id>/delete', methods=['DELETE'])
# @login_required
def delete_application(applicantion_id):

    application = Application.query.filter(id=applicantion_id).first()

    # if current_user.id != application.applicant_id and current_user.role != 'admin':
    #     return 'unauthorized', 401
    
    db.session.delete(application)
    db.session.commit()

    return jsonify(application.to_dict()), 200


@bp.route('/application/<application_id>/update', methods=['PUT'])
# @login_required
def update_application(application_id):

    application = Application.query.filter(id=application_id, applicant_id=current_user.id).first()

    payload = request.get_json(force=True)

    if not application:
        return 'cannot find application', 404
    
    application.from_dict(payload)
    db.session.commit()

    return jsonify(application.to_dict()), 200
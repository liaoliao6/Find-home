import json
import uuid
from flask import jsonify, request, session
from flask_login import current_user
from werkzeug.datastructures import ImmutableMultiDict
from .auth import login_required, roles_required
from app.api import bp
from app.models import Property
from app import db, flickr
import jsonlogic_rs

import xmltodict

                    

@bp.route('/property/create', methods=['POST'])
# @login_required
# @roles_required(['realtor', 'seller', 'landlord', 'admin'])
def list_property():

    payload = request.form.to_dict()

    property_info = json.loads(payload["property"])
 
    property_images = request.files.getlist('imgs')
    
    new_property = Property()
    new_property.from_dict(property_info)

    imgs = []

    for idx, property_image in enumerate(property_images):
        resp = flickr.upload(filename=str(uuid.uuid4()) + "-" + property_image.filename, fileobj=property_image, format='rest')
        resp_dict = xmltodict.parse(resp)
        resp_stats = resp_dict["rsp"]

        if(resp_stats["@stat"] != "ok"):
            continue
        
        imgs.append(resp_stats["photoid"])
    
    new_property.from_dict({"imgs": imgs})
    db.session.add(new_property)
    db.session.commit()
        
  
    return jsonify(new_property.to_dict()), 201

@bp.route('/property/query', methods=['POST'])
def query_properties():
    payload = request.get_json(force=True)
    properties = Property.query.all()
    result = filter(lambda x: jsonlogic_rs.apply(payload, x.to_dict()) == True, properties)	
    listResult = [prop.to_dict() for prop in result]
    return jsonify(listResult), 200

@bp.route('/properties', methods=['GET'])
# @login_required
def get_properties():

    property_id = request.args.get('propertyID')

    if not property_id:

        properties = Property.query.all()

        if (len(properties) == 0):
            return 'no properites found', 404

        properties_results = []

        for prop in properties:
            properties_results.append(prop.to_dict())
        
        print(properties_results)
        return jsonify(properties_results), 200
    
    else:

        prop = Property.query.filter_by(id=property_id).first()

        
        if not prop:
            return 'cannot find property', 404
        
        return jsonify(prop.to_dict()), 200


@bp.route('/property/<property_id>/update', methods=['PUT'])
# @login_required
# @roles_required(roles=['seller', 'realtor', 'landlord', 'admin'])
def update_properity(property_id):

    prop = Property.query.filter(id=property_id).first()

    if not prop:
        return 'cannot find the property', 404
    
    # if current_user.role != 'admin' and current_user.id != prop.manager_id:
    #     return 'unauthrized', 401
    
    payload = request.get_json(force=True)

    prop.from_dict(payload)

    db.session.commit()

    return jsonify(prop.to_dict()), 200


@bp.route('/property/<property_id>/delete', methods=['DELETE'])
# @login_required
# @roles_required(roles=['seller', 'realtor', 'landlord', 'admin'])
def delete_property(property_id):

    prop = Property.query.filter(id=property_id).first()

    if not prop:
        return 'cannot find the property', 404
    
    # if current_user.role != 'admin' and current_user.id != prop.manager_id:
    #     return 'unauthrized', 401

    db.session.delete(prop)
    db.session.commit()

    return jsonify(prop.to_dict()), 200




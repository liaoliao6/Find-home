from flask import current_app as app
from datetime import datetime
from flask_user import UserMixin
from app import db, flask_bcrypt

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(255, collation='NOCASE'), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False, default='')

    first_name = db.Column(db.String(100, collation='NOCASE'), nullable=False, default='')
    last_name = db.Column(db.String(100, collation='NOCASE'), nullable=False, default='')

    role = db.Column(db.String(255, collation='NOCASE'), nullable=False, default='renter')

    favorite_search = db.Column(db.PickleType, default=None)
    favorite_houses = db.Column(db.PickleType, default=None)

    status = db.Column(db.String(45,collation='NOCASE'), nullable=False, default='PENDING')

    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    time_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    def set_password(self, password):
        self.password = flask_bcrypt.generate_password_hash(password).decode('utf-8')


    def check_password(self, password):
        return flask_bcrypt.check_password_hash(self.password, password)


    def from_dict(self, data, new_user=False):
        for field in ['first_name', 'last_name', 'email', 'role', 'favorite_search', 'favorite_houses', 'status']:
            if field in data and data[field]:
                setattr(self, field, data[field])
        if new_user and 'password' in data:
            self.set_password(data['password'])


    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role,
            "password": self.password,
            "favorite_search": self.favorite_search,
            "favorite_houses": self.favorite_houses,
            "status": self.status,
            "time_created": self.time_created,
            "time_modified": self.time_modified
        }


class Property(db.Model):
    __tablename__ = 'property'
    id = db.Column(db.Integer, primary_key=True)

    status = db.Column(db.String(45, collation='NOCASE'), nullable=False, default='active')

    zip_code = db.Column(db.String(45, collation='NOCASE'), nullable=False)
    street = db.Column(db.String(255, collation='NOCASE'), nullable=False)
    country = db.Column(db.String(45, collation='NOCASE'), nullable=False)
    state = db.Column(db.String(45, collation='NOCASE'), nullable=False)
    city = db.Column(db.String(45, collation='NOCASE'), nullable=False)

    manager_id = db.Column(db.Integer, nullable=False)

    amenities = db.Column(db.PickleType, nullable=True)
    features = db.Column(db.PickleType, nullable=False)
    property_type = db.Column(db.String(45, collation='NOCASE'), nullable=False)

    for_rent = db.Column(db.Boolean, nullable=False, default=False)
    lease = db.Column(db.PickleType, nullable=True)

    listed_price = db.Column(db.PickleType, nullable=True)
    
    imgs = db.Column(db.PickleType, nullable=True)

    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    time_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def from_dict(self, data):
        for field in ['status', 'zip_code', 'street', 'country', 'state', 'city', 'manager_id', 'amenities', 'features', 'property_type', 'for_rent', 'lease', 'listed_price', 'imgs']:
            if field in data and data[field]:
                setattr(self, field, data[field])
    

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "zip_code": self.zip_code,
            "street": self.street,
            "country": self.country,
            "state": self.state,
            "city": self.city,
            "manager_id": self.manager_id,
            "amenities": self.amenities,
            "features": self.features,
            "property_type": self.property_type,
            "for_rent": self.for_rent,
            "lease": self.lease,
            "listed_price": self.listed_price,
            "imgs": self.imgs,
            "time_created": self.time_created.strftime("%m/%d/%Y, %H:%M:%S"),
            "time_modified": self.time_modified.strftime("%m/%d/%Y, %H:%M:%S")
        }


class Application(db.Model):
    __tablename__ = 'application'
    id = db.Column(db.Integer, primary_key=True)

    applicant_id = db.Column(db.Integer, nullable=False)
    approver_id = db.Column(db.Integer, nullable=False)

    status = db.Column(db.String(45, collation='NOCASE'), nullable=False, default='PENDING')

    property_id = db.Column(db.Integer, nullable=False)
    for_rent = db.Column(db.Boolean, nullable=False, default=False)

    application_info = db.Column(db.PickleType, nullable=False)

    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    time_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def from_dict(self, data):
        for field in ["applicant_id", "approver_id", "property_id", "for_rent", "application_info", "status"]:
            if field in data and data[field]:
                setattr(self, field, data[field])
    
    def to_dict(self):
        return {
            "id": self.id,
            "applicant_id": self.applicant_id,
            "approver_id": self.approver_id,
            "property_id": self.property_id,
            "status": self.status,
            "for_rent": self.for_rent,
            "application_info": self.application_info,
            "time_created": self.time_created,
            "time_modified": self.time_modified
        }
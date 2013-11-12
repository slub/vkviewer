""" This module contains the models which are interconnected with the authentification """
import os
from hashlib import sha1
from ..models import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime, BINARY, Sequence, Unicode
from sqlalchemy import func, desc, ForeignKey
from sqlalchemy.orm import relationship, backref

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, Sequence('user_id_seq', optional=True), primary_key=True)
    login = Column(String(80))
    password = Column(Unicode(80))
    email = Column(String(80))
    vorname = Column(String(80))
    nachname = Column(String(80)) 
    groups = Column(String(80))
    
    def __init__(self, login, password, email, vorname, nachname):
        self.login = login
        self._set_password(password)
        self.email = email
        self.vorname = vorname
        self.nachname = nachname
        self.groups = 'default'
    
    @classmethod
    def by_id(cls, userid, dbsession):
        return dbsession.query(Users).filter(Users.id == userid).first()
    
    @classmethod
    def by_username(cls, login, dbsession):
        return dbsession.query(Users).filter(Users.login == login).first()
    
    def _set_password(self, password):
        hashed_password = password
        
        if isinstance(password, unicode):
            password_8bit = password.encode('UTF-8')
        else:
            password_8bit = password
            
        salt = sha1()
        salt.update(os.urandom(60))
        hash = sha1()
        hash.update(password_8bit + salt.hexdigest())
        hashed_password = salt.hexdigest() + hash.hexdigest()
        
        if not isinstance(hashed_password, unicode):
            hashed_password = hashed_password.decode('UTF-8')
            
        self.password = hashed_password
        
    def validate_password(self, password):
        hashed_pass = sha1()
        hashed_pass.update(password + self.password[:40])
        return self.password[40:] == hashed_pass.hexdigest()


class Fehlermeldung(Base):
    __tablename__ = 'fehlermeldungen'
    id = Column(Integer, primary_key=True)
    fehlerbeschreibung = Column(String(255))
    objektid = Column(Integer)
    timestamp = Column(DateTime(timezone=False))
    referenz = Column(String(255))
    nutzerid = Column(String(255))  
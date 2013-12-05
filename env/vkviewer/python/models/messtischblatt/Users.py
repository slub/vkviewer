import os
import sqlalchemy as sa
from hashlib import sha1
from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, String, Sequence, Unicode
from webhelpers.paginate import PageURL_WebOb, Page


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, Sequence('user_id_seq', optional=True), primary_key=True)
    login = Column(String(80))
    password = Column(Unicode(80))
    email = Column(String(80))
    vorname = Column(String(80))
    nachname = Column(String(80)) 
    groups = Column(String(80))
    bonuspunkte = Column(Integer)
    
    def __init__(self, login, password, email, vorname, nachname):
        self.login = login
        self._set_password(password)
        self.email = email
        self.vorname = vorname
        self.nachname = nachname
        self.groups = 'default'
        self.bonuspunkte = 0
    
    @classmethod
    def by_id(cls, userid, dbsession):
        return dbsession.query(Users).filter(Users.id == userid).first()
    
    @classmethod
    def all(cls, dbsession):
        return dbsession.query(Users).order_by(sa.desc(Users.bonuspunkte))
    
    @classmethod
    def by_username(cls, login, dbsession):
        return dbsession.query(Users).filter(Users.login == login).first()
    
    @classmethod
    def get_paginator(cls, request, dbsession, page=1):
        page_url = PageURL_WebOb(request)
        return Page(Users.all(dbsession), page, url = page_url, items_per_page=5)
    
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
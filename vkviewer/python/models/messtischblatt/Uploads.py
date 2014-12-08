import sqlalchemy as sa
from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, DateTime, String, desc
from webhelpers.paginate import PageURL_WebOb, Page

class Uploads(Base):
    __tablename__ = 'uploads'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    time = Column(DateTime(timezone=False))
    userid = Column(String(255)) 
    mapid = Column(String(255)) 
 
    @classmethod
    def all(cls, session):
        return session.query(Uploads).order_by(sa.desc(Uploads.created))
    # This method will return query object that can return whole dataset to us when needed.
    
    @classmethod
    def by_id(cls, session, id):
        return session.query(Uploads).filter(Uploads.id == id).first()
    # This method will return a single Upload by id, or None object if nothing is found.
    
    @classmethod
    def by_userid(cls, session, userid):
        return session.query(Uploads).filter(Uploads.userid == userid)
    
    @classmethod
    def get_paginator(cls, request, dbsession, page=1):
        page_url = PageURL_WebOb(request)
        return Page(Uploads.all(dbsession), page, url = page_url, items_per_page=5)
    # this method is able to return only the entries from specific 'page' of database resulteset. 
    # It will add LIMIT/OFFSET to our query based on items_per_page and current page number

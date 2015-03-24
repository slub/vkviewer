import sqlalchemy as sa
from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, DateTime, String, desc
from webhelpers.paginate import PageURL_WebOb, Page

class Uploads(Base):
    __tablename__ = 'uploads'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    time = Column(DateTime(timezone=False))
    userid = Column(Integer) 
    mapid = Column(Integer) 
    params = Column(String(255))
 
    @classmethod
    def all(cls, session):
        """This method will return query object that can return whole dataset to us when needed."""
        return session.query(Uploads).order_by(sa.desc(Uploads.created))
        
    @classmethod
    def by_id(cls, session, id):
        """This method will return a single Upload by id, or None object if nothing is found."""
        return session.query(Uploads).filter(Uploads.id == id).first()
        
    @classmethod
    def by_userid(cls, session, userid):
        """This method will return all Uploads from a special user-id."""
        return session.query(Uploads).filter(Uploads.userid == userid)
    
    @classmethod
    def get_paginator(cls, request, dbsession, page=1):
        """This method is able to return only the entries from specific 'page' of database resulteset.
        
        It will add LIMIT/OFFSET to our query based on items_per_page and current page number.
        """
        page_url = PageURL_WebOb(request)
        return Page(Uploads.all(dbsession), page, url = page_url, items_per_page=5)


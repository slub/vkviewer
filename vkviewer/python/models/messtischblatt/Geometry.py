from sqlalchemy.types import UserDefinedType
from sqlalchemy import func

class Geometry(UserDefinedType):   
    def get_col_spec(self):
        return "GEOMETRY"
    
    def bind_expression(self, bindvalue, srid=4314):
        return func.ST_GeomFromText(bindvalue,  srid, type_=self)
    
    def column_expression(self, col):
        return func.ST_AsText(col, type_=self)
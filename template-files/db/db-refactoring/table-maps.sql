CREATE TABLE maps
(
  id serial NOT NULL,
  apsobjectid serial NOT NULL,
  apsdateiname character varying, 
  originalimage character varying,
  georefimage character varying,
  istaktiv boolean,
  isttransformiert boolean, 
  maptype character varying,
  hasgeorefparams integer DEFAULT 0,
  boundingbox geometry,
  CONSTRAINT maps_pkey PRIMARY KEY (id),
  CONSTRAINT enforce_dims_boundingbox CHECK (st_ndims(boundingbox) = 2),
  CONSTRAINT enforce_geotype_boundingbox CHECK (geometrytype(boundingbox) = 'POLYGON'::text OR boundingbox IS NULL),
  CONSTRAINT enforce_srid_boundingbox CHECK (st_srid(boundingbox) = 4314)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE maps
  OWNER TO postgres;
GRANT SELECT, UPDATE ON TABLE maps TO vkviewer;


-- Index: idx_maps_id

-- DROP INDEX idx_maps_id;

CREATE UNIQUE INDEX idx_maps_id
  ON maps
  USING btree
  (id);

-- Index: idx_maps_apsobjectid

-- DROP INDEX idx_maps_apsobjectid;

CREATE UNIQUE INDEX idx_maps_apsobjectid
  ON maps
  USING btree
  (apsobjectid);

-- Index: maps_boundingbox_gist

-- DROP INDEX maps_boundingbox_gist;

CREATE INDEX maps_boundingbox_gist
  ON maps
  USING gist
  (boundingbox);
ALTER TABLE maps CLUSTER ON maps_boundingbox_gist;

ALTER SEQUENCE maps_id_seq RESTART WITH 10000000;

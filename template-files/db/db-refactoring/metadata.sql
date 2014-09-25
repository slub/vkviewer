CREATE TABLE metadata
(
	mapid integer NOT NULL,
	title character varying, --md_core.titel
	titleshort character varying, --md_core.titel_short
	serientitle character varying, --md_core.serientitel
	description character varying, --md_core.beschreibung
	measures character varying, --md_core.masse
	scale character varying, --md_core.massstab
	type character varying, --md_core.gattung
	technic character varying, --md_core.technik
	ppn character varying, --md_core.ppn
	apspermalink character varying, --md_datensatz.permalink
	imagelicence character varying, --md_datensatz.bildrechte
	imageowner character varying, --md_bildmedium.eigentuemer
	imagejpg character varying, --md_bildmedium.dateiname
	imagezoomify character varying, --md_bildmedium.zoomify
	timepublish timestamp without time zone, --md_time.time typ = a5064
  	CONSTRAINT metadata_pkey PRIMARY KEY (mapid),
  	CONSTRAINT metadata_maps_fkey FOREIGN KEY (mapid)
      		REFERENCES maps (id) MATCH SIMPLE
      		ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE metadata
  OWNER TO postgres;

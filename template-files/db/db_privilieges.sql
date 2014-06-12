-- User privileges vkviewer
GRANT SELECT ON TABLE spatial_ref_sys TO vkviewer;
GRANT SELECT ON TABLE webmappingservice TO vkviewer;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE users TO vkviewer;
GRANT SELECT ON TABLE refmtbwms TO vkviewer;
GRANT SELECT ON TABLE spatial_ref_sys TO vkviewer;
GRANT SELECT, UPDATE ON TABLE messtischblatt TO vkviewer;
GRANT SELECT ON TABLE md_zeit TO vkviewer;
GRANT SELECT ON TABLE md_core TO vkviewer;
GRANT SELECT ON TABLE md_datensatz TO vkviewer;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE georeferenzierungsprozess TO vkviewer;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE passpoint TO vkviewer;
GRANT ALL ON TABLE passpoint_id_seq TO vkviewer;
GRANT SELECT, INSERT ON TABLE fehlermeldungen TO vkviewer;
GRANT ALL ON TABLE users_id_seq TO vkviewer;
GRANT ALL ON TABLE georeferenzierungsprozess_id_seq TO vkviewer;
GRANT ALL ON TABLE fehlermeldungen_id_seq TO vkviewer;
GRANT SELECT, DELETE ON TABLE refmtblayer TO vkviewer;
﻿-- User privileges user_georef
GRANT SELECT, UPDATE ON TABLE md_bildmedium TO user_georef;
GRANT SELECT, UPDATE ON TABLE messtischblatt TO user_georef;
GRANT UPDATE, SELECT ON users TO user_georef;
GRANT DELETE ON georeferenzierungsprozess TO user_georef;

# VK2.0 Scripts

## `UpdateDataSourc.py`

The task of this scripts is to look into the messtischblattdb for newly registered or updated georeference processes and pushs them to the different data stores of the VK2.0. Mainly it processes a persistent georeference result, updates the database (this also includes reset a already georeferenced map to an unreferenced map), push a metadata record to the catalog, calculates the TMS cache and updates the VRT datasets.

For running the script in **production** the following command could be used.

	bin/python vkviewer/python/scripts/UpdateDataSource.py --host 'localhost' --user 'user' --password 'password' --db 'messtischblattdb' --tmp_dir '/tmp' --georef_dir '/srv/vk/data_archiv/mtb_data_ref' --vrt_dir '/srv/vk/data_archiv/mapfiles/referenced_wms/historisch_messtischblaetter/vrt_data' --mode 'production' --cache_dir '/srv/vk/data_archiv/tms_cache'


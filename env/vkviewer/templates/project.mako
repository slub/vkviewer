# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
        <!-- vk2 librarys -->
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/project.css')}" />
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
    </head>
    
    <script>
   	
    </script>  
	<body>
	    <div class="vk2PartnerPageContainer">
	    	<h2 class="slubcolor">${_('project_name_short')}</h2><br>
	    	<p>${_('project_name_long')}</p>
	    	<h3>${_('footer_project_summary')}</h3>
	    	<p>
	    		<b>${_('footer_project_description')}</b><br>
		    	<p>${_('footer_project_description_content_start')}</p><br>
		    	<ul class="list">
		    		<li>${_('footer_project_description_content_li1')}</li>
		    		<li>${_('footer_project_description_content_li2')}</li>
		    	</ul><br>
		    	<p>${_('footer_project_description_content_end')}</p><br>
		    </p><br>
	    	<p>
	    		<b>${_('footer_project_duration')}</b>
	    		<p>2013 - 2014</p>
	    	</p><br>
	    	<p>
	    		<b>${_('footer_project_patron')}</b>
	    		<br>
	    		<a href="http://www.dfg.de/" title="${_('dfg')}">
	    			<img height="34" src="${request.static_url('vkviewer:static/images/RTEmagicC_dfg_logo_schriftzug_grau_01.jpg')}" width="264" alt>
	    		</a>
	    	</p>
	    	
	    	<br>
	    	<h3>${_('footer_projectpartners')}</h3>
	    	<p>
	    		<a href="http://www.slub-dresden.de" titel="SLUB" target="_top">
	    			<span>${_('slubname')}</span>
	    		</a><br>
	    		<a href="http://www.auf-gg.uni-rostock.de/en/" titel="Uni Rostock" target="_top">
	    			<span>${_('rostockname')}</span>
	    		</a>
	    	</p>
	    </div>    
	</body>
</html>

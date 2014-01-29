<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />	     	
</%block>

<%block name="body_content">
	<div class="project">
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
	</div>
</%block>


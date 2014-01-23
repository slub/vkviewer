# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
        <!-- js/css -->
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/fancyapps-fancyBox/source/jquery.fancybox.css')}" media="screen" />    
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/basicFooterLayout.css')}" />       
	    <script src="${request.static_url('vkviewer:static/lib/min/jquery.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/min/jquery-ui-1.10.4.custom.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/min/jquery.fancybox.min.js')}"></script> 
      	<script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/base.js')}"></script>
      	<!-- javascript internationalization --> 
      	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
      	  
      	<%block name="headerJsCss" />
      	  	
    </head>
	<body>	       
		
		<%block name="bodyBlock" />
		<!-- Footer --> 
        <div id="vk2Footer" class="vk2Footer">
        	<div class="footerContainer">
        		<div class="leftside">
        			<ul class="footerList">
        				<li class="listelement thick leftborder">${_('footer_project_name')}</li>
        				<li class="listelement">${_('footer_project_desc_long')}</li>
        			</ul>
        		</div>
        		<div class="rightside">
        		   	<ul class="footerList">
        		   	
        		   		% if faq_url:
         				<li class="listelement leftborder">
        					<a href="${faq_url}" class="vk2FooterLinks fancybox-open">FAQ</a>        				
        				</li>       		   		
        		   		% else:
        				<li class="listelement leftborder">
        					<a href="${request.route_url('faq')}" class="vk2FooterLinks fancybox-open">FAQ</a>        				
        				</li>
        				% endif
        				<li class="listelement leftborder">
         					<a href="${request.route_url('contact')}" class="vk2FooterLinks fancybox-open">${_('footer_contact')}</a>		
        				</li>        				
        				<li class="listelement leftborder">
        					<a href="${request.route_url('project')}" class="vk2FooterLinks fancybox-open">${_('footer_project')}</a>    				
        				</li>
        				<li class="listelement">
        					<a href="${request.route_url('impressum')}" class="vk2FooterLinks fancybox-open">${_('footer_editorial')}</a>
        				</li>
        			</ul>
        		</div>
        	</div>
        </div>
        
        <!-- sidebar -->
        <%block name="sidebar" />
        
        <!-- appendix -->
        <%block name="appendix" /> 
        
        ${next.body()}
    </body>
</html>
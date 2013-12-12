# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/contact.css')}" /> 
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
    </head>
    
    <script>
   	
    </script>  
	<body>
	    <div class="vk2ContactPageContainer">
	    	<h3 class="slubcolor">${_('footer_contact')}</h3>
	    	<p>${_('slubname_start')}<br>
	    		${_('slubname_end')}</p>
	    	<h4>${_('post_adress')}</h4>
	    	<p>01054 Dresden</p>
	    	<h4>${_('paket_adress')}/ ${_('visitor_adress')}</h4>
	    	<p>Zellescher Weg 18 <br>
	    		01069 Dresden</p>
	    	<h4>Information</h4>
	    	<p>Tel.: +49 351 4677-390</p>
	    	<h4>${_('contact_person')} Virtuelles Kartenforum 2.0</h4>
	    	<p>
	    			Jacob Mendt
					<br>
					E-Mail: <a href="mailto:Jacob.Mendt@slub-dresden.de">Jacob.Mendt(at)slub-dresden.de</a>
			</p>
			<p>
					Kai Walter
					<br>
					E-Mail: <a href="mailto:kai.walter@uni-rostock.de">kai.walter(at)uni-rostock.de</a>
			</p>
	    </div>
    </body>
</html>

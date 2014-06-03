# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">	 
	<style>
		html, body {
			overflow-y: auto;
		}
	</style>
</%block>

<%block name="body_content">
	<div class="impressum page-container">
		<div class="vk2ImpressumPageContainer">
	    	<h2 class="slubcolor">${_('footer_editorial')}</h2>
	    	<div class="text">
	    		<p>${_('editorial_introduction')}</p>
	    		<h4 class="slubcolor">${_('provider')}</h4>
	    		<p>
	    			${_('slubname_start')}
	    			<br />  
	    			${_('slubname_end')}
	    			<br /> 
	    			${_('post_adress')}: 01054 Dresden
	    			<br />  
	    			${_('visitor_adress')}: Zellescher Weg 18
	    			<br />
	    			01069 Dresden
				</p>
				<p>
					${_('represented_by')}
					<b>Prof. Dr. Thomas Bürger</b>
					<br />
					${_('agency')}
					<br /> 
					Tel.: +49 351 4677-123
					<br />  
					E-Mail: <a href="mailto:Generaldirektion@slub-dresden.de">Generaldirektion@slub-dresden.de</a> 
				</p>
				<h4 class="slubcolor">${_('representative')}</h4>
				<p>
					${_('representative_first')}
					<br /> 
					${_('representative_second')}
					<br /> 
					${_('representative_third')}
				</p>
				<h4 class="slubcolor">${_('editorial_team')}</h4>
				<p>
					Prof. Dr. Ralf Bill
					<br>
					E-Mail: <a href="mailto:ralf.bill@uni-rostock.de">ralf.bill(at)uni-rostock.de</a>
				</p>
				<p>
					Sebastian Meyer
					<br>
					E-Mail: <a href="mailto:Sebastian.Meyer@slub-dresden.de">Sebastian.Meyer(at)slub-dresden.de</a>
				</p>
				<h4 class="slubcolor">${_('technical_realisation')}</h4>
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
				<p>
					Thomas Jung
					<br>
					E-Mail: <a href="mailto:Thomas.Jung@slub-dresden.de">Thomas.Jung(at)slub-dresden.de</a>
				</p>
				<h4 class="slubcolor">${_('information_law')}</h4>
				<p>
					${_('information_law_content')}
				</p>
				<h4 class="slubcolor">${_('information_copyright')}</h4>
				<p>
					${_('information_copyright_content')}
				</p>
				<h4 class="slubcolor">${_('privacy_policy')}</h4>
				<p>
					Comming Soon!
				</p>    	
			</div>
	    </div>	    
	</div>
</%block>


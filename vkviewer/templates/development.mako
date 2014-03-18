<%inherit file="basic_page.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/ol.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
	<style>
		.contact-formular{
			width: 600px;
		}
		
		.form-group.right{
			float: right
		}
	</style>
</%block>

<%block name="body_content">

</%block>

<%block name="js_content">
    <script>
    	var validateForm = function(){
    		var email = goog.dom.getElement('input-email').value;
			var message = goog.dom.getElement('input-message').value;
			
			// check email adress
			var isValide = true;
			isValide = isValide && VK2.Validation.checkEmailAdress('input-email', 'contant-message', 'ui-state-error');
			if (!isValide) return isValide;
			
			// build request
			var url = '${request.route_url('report', action='contact')}' + '?message=' + message + '&email=' + email + '&reference=contact';
			var success_callback = function(xhrio){alert(VK2.Utils.get_I18n_String('send_con_message_suc'));};
			var error_callback = function(xhrio){alert(VK2.Utils.get_I18n_String('send_con_message_err'));};
			VK2.Utils.sendReport(url, success_callback, error_callback);
			
			return false;
    	}
    </script> 
</%block>

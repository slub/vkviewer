<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
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
		console.log('Development page');
    </script> 
</%block>

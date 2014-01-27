'''
Created on Jan 27, 2014

@author: mendt
'''
import smtplib
from email.mime.text import MIMEText
from vkviewer.settings import admin_addr, mail_server

def sendMail(addr_to, subject, msg):
    try:
        # construct the email
        msg = MIMEText(msg)
        msg['To'] = addr_to
        msg['From'] = admin_addr
        msg['Subject'] = subject
        
        # send the message via an smp
        s = smtplib.SMTP(mail_server)
        s.sendmail(admin_addr, addr_to, msg.as_string())
        s.quit()
        
        return True
    except:
        raise

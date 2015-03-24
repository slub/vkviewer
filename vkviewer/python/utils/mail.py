'''
Created on Jan 27, 2014

@author: mendt
'''
import smtplib, os
from email.mime.text import MIMEText
from vkviewer.settings import admin_addr, mail_server,sendmail_location

def sendMailSMTP(addr_to, subject, msg):
    """This function contruct the email and send the message via our own mail server
    
    :param addr_to: the recipent's email address
    :type addr_to: String
    :type subject: String
    :type msg: String
    """
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

def sendMailCommandLine(addr_to, subject, msg):
    """This function contruct the email an send the message via command line.
    
    :param addr_to: the recipent's email address
    :type addr_to: String
    :type subject: String
    :type msg: String
    """
    try:
        # construct the email
        mail = os.popen('%s -t' % sendmail_location, 'w')
        mail.write('From: %s\n' % admin_addr)
        mail.write('To: %s\n' % addr_to)
        mail.write('Subject: %s\n' % subject)
        mail.write("\n") # blank line separating headers from body
        mail.write(msg)
        status = mail.close()

        
        # send the message via command line sendmail
        if status != 0:
            print "Sendmail exit status", status
        
        return True
    except:
        raise
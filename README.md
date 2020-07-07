# static-mailer. An API to send emails from static websites

A heroku app for sending emails from static websites throught an API. Developed for a project I was working on. Currently abandoned.

You can list a domain in hosts_templates.json, declare the email content, the sender email, an a reply-to email where user replies will go to. The app also tries to find out if the IP of the requester is blacklisted to prevent abuse.

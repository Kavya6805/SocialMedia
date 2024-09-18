from django.core.mail import EmailMessage
import os

class Util:
    @staticmethod
    def send_email(data):
        email=EmailMessage(
            subject=data['email_subject'],
            body=data['body'],
            from_email=os.environ.get('EMAIL_USER'),
            to=[data['to_email']],
        )
        email.content_subtype = 'html'
        email.send(fail_silently=True)

# from django.core.mail import send_mail

# @staticmethod
# def send_email(data):
#     send_mail(
#         data['email_subject'],
#         data['body'],
#         os.environ.get('EMAIL_FROM'),
#         [data['to_email']],
#         fail_silently=False,
#     )
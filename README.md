# Todo
=> Rework le système de capture d'image sur le front et sur le back pour qu'il capture l'image sans la déformer, et en respectant la position du curseur. Il faut que cela fonction sur chrome ET sur firefox
==> Ajouter une croix au survol sur la partie edit pour donner la possibilité de supprimer les images.
==> Pagination home

# Dependencies
- Docker
- Docker-compose

# ENV
- Create a .env file, this must contains:
## To enable mail system
SMTP_SERVER="[your.smtp.com]:port"
SMTP_ACCESS="your_mail@email.com:yourPassword"

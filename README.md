# proto-trauma-tetris
Simple prototype visant à illustrer le concept et peut-être fournir une première solution déployée

### Development

Des containers Docker sont utilises pour simplifier la mise en place d'un environnement de developpement.
La procedure d'installation est decrite [ici](https://docs.docker.com/get-docker/).

Pour lancer les services, il suffit de taper la commande suivante dans un terminal:

`make start`

* Autres commandes:
- `make restart` & `make restart_force`: pour relancr les containers (la 2eme commande force la reconstruction)
- `make run`: lance l'application directement (utlise dans les container)
- `make clean`: pour nettoyer les fichiers generes par l'install et le build
- `make install`: installation des dependances
- `make build`: build de l'app Tetris

* Fichier d'environnement: 
Un fichier pour configurer certaines variables d'environnement devra etre cree manuellement, il devra se nommer `.env` (utiliser le modele de fichier `.env.dist`)

### Production (Heroku)
yarn start
```

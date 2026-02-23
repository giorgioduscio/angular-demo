FROM node:20-alpine
WORKDIR /usr/src/app

# Copia solo package.json e package-lock.json
COPY package*.json ./

# Installa dipendenze (senza @angular/cli globale)
RUN npm install

# Copia il resto del progetto
COPY . .

EXPOSE 4200
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

#!/bin/bash

echo "[1/3] Creazione container..."
docker-compose up -d

echo "[2/3] Accesso al container... (http://localhost:4200)"
docker-compose exec angular-demo sh

echo "[3/3] Ferma container..."
docker-compose stop
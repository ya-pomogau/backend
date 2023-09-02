
Бриф [https://narrow-mountain-bc1.notion.site/3-13-1880e7396a9c4bbda3d1f33103fd01af](https://narrow-mountain-bc1.notion.site/3-13-1880e7396a9c4bbda3d1f33103fd01af)

Backend  [https://api.kraev.nomoredomains.xyz](https://api.kraev.nomoredomains.xyz)

IP адрес [84.201.139.237](84.201.139.237)

API [https://api.kraev.nomoredomains.xyz/api](https://api.kraev.nomoredomains.xyz/api)

Коллекция postman - collection.json

## Описание
Проект для волонтерской организации ЯПомогаю. Цель, создать удобное веб-приложение поиска волонтёров для помощи реципиентам. От выгула собак, до помощи людям с ограниченными возможностями.


## Установка и запуск в режиме разработки

Должнен быть установлен NodeJS v16 ^

1. Клонировать репозиторий



2. Установить docker

   для windows: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)



3. Для Ubuntu

   Установите пакеты, необходимые для использования репозитория через HTTPS:
   ```shell
   sudo apt-get update
   sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
   ```
   Добавьте официальный ключ GPG Docker:
   ```shell
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```

   Добавьте репозиторий Docker к источникам APT:
   ```shell
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   ```

   Установите Docker:
   ```shell
   sudo apt-get update
   sudo apt-get install docker-ce
   ```


4. Собрать и запустить docker-контейнер

   ```shell
   docker compose build
   docker compose up -d
   ```
   сервер будет доступен на 3001 порту


## Ограничения реализации

не реализована функциональность учетных записей пользователей, чата, редактирования заявок, пользователей.
не реализована функциональность регистрации, общих страниц и страниц пользователей

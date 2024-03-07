
Бриф [https://narrow-mountain-bc1.notion.site/3-13-1880e7396a9c4bbda3d1f33103fd01af](https://narrow-mountain-bc1.notion.site/3-13-1880e7396a9c4bbda3d1f33103fd01af)

Backend  [https://api.kraev.nomoredomains.xyz](https://api.kraev.nomoredomains.xyz)

IP адрес [84.201.139.237](84.201.139.237)

API [https://api.kraev.nomoredomains.xyz/api](https://api.kraev.nomoredomains.xyz/api)

Коллекция postman - (https://www.postman.com/phizick/workspace/ihelp)

**Коллекция postman для обновленного api в корне проекта: postman_collection.json**

На текущий момент можно протестировать:
- создание админа, авторизацию;
- создание, удаление, редактирование постов.

Чтобы зарегистрировать админа необходимо в `AdminApiController` закомментировать `@UseGuards(JwtAuthGuard), @UseGuards(AccessControlGuard)`, в `@Post('create')` закомментировать `@AccessControlList({ role: UserRole.ADMIN, isRoot: true })` и добавить декоратор `@Public()`.

Чтобы запустить тесты, необходимо нажать 3 точки у имени коллекции, выбрать Run collection, затем Run yaPomogau.

Для админа автоматически создаются уникальные имя, логин, vkId, с которыми он будет зарегистрирован и авторизован.

После создания поста - id поста сохраняется в переменной и далее отправляется запрос на редактирование данного поста, а потом его удаление.


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

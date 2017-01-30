/*
 * Gulp-plugin
 * @author: rg team && nanomen
 * Смотрит файл и по его ресурсу пдставляет хеш
 */

/**
 * Объявляем модули,
 * с которыми будем работать
 *
 */

const

    // Для работы с файлами, путями
    fs = require('fs'),
    crypto = require('crypto'),

    // Инструмент для создания плагина
    es = require('event-stream'),

    // Подключаем для обработки sass файла во время сборки
    gulp = require('gulp');

/*
 * Helpers
 *
 */

/**
 * Получить путь до ресурса на уровень выше
 * @param  {String} path исходный путь
 * @return {String} путь на уровень выше
 *
 */
var parentDir = function(path) {

    return path.split('/').slice(0, -1).join('/');

};

/*
 * Модуль плагина
 * Получает кастомные опции
 *
 */

module.exports = function(userOptions) {

    'use strict';

    /**
     *
     * Функция плагина, которая принимает файловый поток в pipe
     * @param  {Buffer} file файл, который передается в gulp потоке
     * @param  {Function} callback функция обратного вызова
     * @return {Buffer} отправляем преобразованный файл дальше в потоке
     *
     */
    var resToHashPlugin = function(file, callback) {

        let

            // Содержимое файла
            fileContents = file.contents,

            // Путь до файла
            filePath = file.path,

            // Контент файла в строке
            fileContentsAsString = null;

        /**
         * МЕТОДЫ
         *
         */

        /**
         * Находим ресурсы и подставляем хеш ресурсов в найденную строку
         * @param  {Srting} str строка, где ищем ресурсы
         * @return {Srting} возвращаем измененную строку
         */
        function checkResForHash(str) {

            return str.replace(/([src|href]+="\/res\/([A-Za-z0-9\/-_.]+))"/gi, function(match, strForReplace, pathToRes) {

                let

                    // Хеш файла
                    fileHash = createFileHash(pathToRes),

                    // Обновленная строка
                    replasedMatch = null;

                replasedMatch = `${strForReplace}?${fileHash}"`;

                return replasedMatch;

            });

        }

        /**
         * Получаем хеш файла
         * @param  {Srting} pathToRes путь до ресурса
         * @return {Srting} возвращаем хеш файла
         *
         */
        function createFileHash(pathToRes) {

            let hash = '',
                contentFile = '';

            // Составляем путь до ресурса
            pathToRes = parentDir(parentDir(filePath)) + '/public/' + pathToRes;

            // console.log('to hash ' + pathToRes);

            // Получаем тело файла
            contentFile = fs.readFileSync(pathToRes).toString();

            // Получаем хеш
            hash = crypto
                    .createHash('md5')
                    .update(contentFile)
                    .digest('hex')
                    .substring(10, 0);

            return hash;

        }

        // Обрабатываем
        try {

            // console.log('process ' + filePath);

            // Получаем строку из контента
            fileContentsAsString = String(fileContents);

            // Обабатываем подключаемые ресурсы
            fileContentsAsString = checkResForHash(fileContentsAsString);

            // Сохраняем обновленное тело файла
            file.contents = new Buffer(fileContentsAsString);

            // Отправляем данные
            callback(null, file);

        } catch (err) {

            // Отправляем ошибку
            callback(err);
        }

    };

    // Возвращаем данные
    return es.map(resToHashPlugin);

};
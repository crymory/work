// ==UserScript==
// @name         USB ID Mapper (Добавление маппинга)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Добавляет значение из маппинга в скобках рядом с номером порта USB.
// @author       Gemini
// @match        https://panel.binotel.com/?module=*
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/crymory/work/main/HUB-ID-mapper.js
// @downloadURL  https://raw.githubusercontent.com/crymory/work/main/HUB-ID-mapper.js
// ==/UserScript==


(function() {
    'use strict';

    // Ваш маппинг. Ключи должны быть в формате "Y.Z".
    const MAPPING = {
        "7.1": 1, "7.2": 2, "7.3": 3, "7.4": 4, "4.1": 5,
        "4.2": 6, "4.3": 7, "4.4": 8, "1.3": 9, "1.4": 10,
        "6.1": 11, "6.2": 12, "6.3": 13, "6.4": 14, "5.1": 15,
        "5.2": 16, "5.3": 17, "5.4": 18, "1.1": 19, "1.2": 20
    };

    /**
     * Основная функция для поиска и обновления элементов.
     */
    function applyMapping() {
        // Ищем все элементы <span>, у которых есть атрибут data-original-title, содержащий "Usb ID:".
        // Это соответствует структуре, где хранится полная информация о USB ID.
        const usbIdSpans = document.querySelectorAll('span[data-original-title*="Usb ID:"]');

        usbIdSpans.forEach(span => {
            const fullTitle = span.getAttribute('data-original-title');

            // 1. Извлекаем полную строку USB ID (например, "12-1.2.7." или "12-1.2.7")
            const idMatch = fullTitle.match(/Usb ID:\s*(\S+)/);

            if (idMatch && idMatch[1]) {
                const fullUsbId = idMatch[1].replace(/\.$/, ''); // Удаляем точку в конце, если она есть

                // 2. Извлекаем последние два сегмента (Y.Z), например, "2.7" из "12-1.2.7"
                // Регулярное выражение ищет N.M в конце строки.
                const keyMatch = fullUsbId.match(/(\d+\.\d+)$/);

                if (keyMatch && keyMatch[1]) {
                    const keyToMap = keyMatch[1]; // Это будет "2.7"

                    // 3. Ищем значение в маппинге
                    const mappedValue = MAPPING[keyToMap];

                    if (mappedValue !== undefined) {
                        // 4. Создаем стилизованный элемент с цветным фоном
                        const badgeSpan = document.createElement('span');
                        badgeSpan.textContent = mappedValue;
                        badgeSpan.style.cssText = `
                            display: inline-block;
                            margin-left: 8px;
                            padding: 4px 10px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border-radius: 12px;
                            font-weight: bold;
                            font-size: 0.9em;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        `;
                        span.appendChild(badgeSpan);
                    }
                    // Если mappedValue === undefined, то, согласно требованию, ничего не выводим.
                }
            }
        });
    }

    // Запускаем скрипт
    applyMapping();
})();

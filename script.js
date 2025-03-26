// ==UserScript==
// @name         authorization Extractor(β)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Extract Discord Token and display it in a draggable and resizable box without popups
// @author       AARR
// @match        https://discord.com/*
// @grant        none
// @license      You can modify as long as you credit me
// ==/UserScript==

(function() {
    'use strict';

    function makeElementDraggable(el) {
        el.onmousedown = function(event) {
            event.preventDefault();

            let shiftX = event.clientX - el.getBoundingClientRect().left;
            let shiftY = event.clientY - el.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                el.style.left = Math.min(Math.max(0, pageX - shiftX), window.innerWidth - el.offsetWidth) + 'px';
                el.style.top = Math.min(Math.max(0, pageY - shiftY), window.innerHeight - el.offsetHeight) + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mouseup', onMouseUp);
        };

        el.ondragstart = function() {
            return false;
        };
    }

    function addResizeButtons(el) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '10px';
        buttonContainer.style.top = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        el.appendChild(buttonContainer);
    }

    function createUI() {
        const initialWidth = '300px';
        const initialHeight = '200px';

        const container = document.createElement('div');
        container.id = 'tokenContainer';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.backgroundColor = '#2f3136';
        container.style.color = '#ffffff';
        container.style.padding = '20px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '1000';
        container.style.width = initialWidth;
        container.style.height = initialHeight;
        container.style.overflowY = 'auto';
        container.style.display = 'none';
        document.body.appendChild(container);

        makeElementDraggable(container);
        addResizeButtons(container);

        const title = document.createElement('h2');
        title.textContent = 'authorization Extractor β';
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '16px';
        container.appendChild(title);

        const tokenDisplay = document.createElement('code');
        tokenDisplay.style.whiteSpace = 'pre-wrap';
        tokenDisplay.style.wordBreak = 'break-word';
        tokenDisplay.style.display = 'block';
        tokenDisplay.style.marginBottom = '10px';
        tokenDisplay.style.backgroundColor = '#000000';
        tokenDisplay.style.color = '#00FF00';
        tokenDisplay.textContent = 'Failed acquisition Wait for a while and press the “Retry” button';
        container.appendChild(tokenDisplay);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.padding = '10px';
        copyButton.style.backgroundColor = '#7289da';
        copyButton.style.color = '#ffffff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';
        container.appendChild(copyButton);

        copyButton.addEventListener('click', function() {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = tokenDisplay.getAttribute('data-token');
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert("copied your authorization to clipboard.");
        });

        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.style.padding = '10px';
        retryButton.style.backgroundColor = '#ff9800';
        retryButton.style.color = '#ffffff';
        retryButton.style.border = 'none';
        retryButton.style.borderRadius = '3px';
        retryButton.style.cursor = 'pointer';
        container.appendChild(retryButton);

        retryButton.addEventListener('click', () => {
            location.reload();
        });

        return { container, tokenDisplay };
    }

    function createToggleImage(container) {
        const toggleImage = document.createElement('img');
        toggleImage.src = 'https://i.imgur.com/fv0qOVS.png';
        toggleImage.style.position = 'fixed';
        toggleImage.style.width = '30px';
        toggleImage.style.height = '30px';
        toggleImage.style.cursor = 'pointer';
        toggleImage.style.zIndex = '1001';
        toggleImage.style.left = '75px';
        toggleImage.style.bottom = '189px';
        document.body.appendChild(toggleImage);

        toggleImage.addEventListener('click', () => {
            const isHidden = container.style.display === 'none';
            container.style.display = isHidden ? 'block' : 'none';
        });

        console.log('Toggle image created and event listener added');
    }

    function getToken(tokenDisplay) {
        console.log('Attempting to retrieve token');
        let token = localStorage.getItem('token');
        if (token) {
            token = token.slice(1, -1);
            tokenDisplay.textContent = token;
            tokenDisplay.setAttribute('data-token', token);
            console.log('Token successfully retrieved:', token);
        } else {
            console.log('Token not found in localStorage');
        }

        console.log('Token retrieval completed');
    }

    const { container, tokenDisplay } = createUI();

    createToggleImage(container);
    getToken(tokenDisplay);
})();

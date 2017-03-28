(function () {
    'use strict';
    var listCount = 0;
    var data = {}


    // var db;
    // var request = window.indexedDB.open("newDatabase", 1);

    // request.onerror = function (event) {
    //     console.log("error: ");
    // };

    // request.onsuccess = function (event) {
    //     db = request.result;
    //     console.log("success: " + db);
    // };

    $(function () {
        data = readFromLocalStorage("data") || {};
        listCount = readFromLocalStorage("listCount") || 0;
        render();
    });

    function createList(name) {
        var newList = {
            name: name,
            cards: {},
            cardCounter: 0
        };
        data[++listCount] = newList;
        return listCount;
    }

    function createCard(listId, desc, user, tags) {
        var list = data[listId];
        var newCard = {
            desc: desc,
            user: user,
            tags: tags
        };
        list.cards[++list.cardCounter] = newCard;
        return list.cardCounter;
    }

    function deleteList(id) {
        delete data[id];
    }

    function editCard(listId, newData) {
        data[listId] = newData;
    }

    function deleteCard(listId, cardId) {
        delete data[listId].cards[cardId];
    }

    function moveCard(sourceList, targetListId, cardId) {
        var card = data[sourceList].cards[cardId];
        var newId = ++data[targetListId].cardCounter;
        data[targetListId].cards[newId] = card;
        delete data[sourceList].cards[cardId];
        render();
    }

    function render() {
        writeToLocalStorage();
        var taskContainer = $('#taskContainer');
        taskContainer.html("");
        var x = "test";
        var listTemplate;
        for (var listId in data) {
            var list = data[listId];
            listTemplate =
                `
                <div class="col-lg-3" id="list_${listId}">
                <div class="panel panel-default">
                    <div class="panel-heading">${list.name}
                    <button onclick="onDeleteList(${listId})">Del</button>
                    </div>
                    <div class="panel-body" ondrop="drop(event,${listId})" ondragover="allowDrop(event)">
                        <input type="text" placeholder="description" class="cardName">
                        <input type="text" class="user" placeholder="UserName" >
                        <input type="text" placeholder="Tags"  class="tags">
                        <button onclick="onClickAddNewCard(${listId})">Add Card</button>
                    </div>
                
                </div>
            </div>`;
            taskContainer.append(listTemplate);
            renderCard(listId);
        }
    }

    function renderCard(listId) {
        var list = data[listId];
        var card, cardTemplate, tags;
        var $list = $("#list_" + listId);
        for (var cardId in list.cards) {
            card = list.cards[cardId];
            tags = card.tags && card.tags.join(",");
            cardTemplate = `
                <div class="card" draggable="true" ondragstart="drag(event,${listId},${cardId})">
                    <div class="description">
                        ${card.desc}
                    </div>
                    <span class="pull-right tags">${tags}</span>
                    <span class="username">${card.user}</span>
                </div>
                `;
            $list.find('.panel-body').append(cardTemplate);
        }
    }

    function writeToLocalStorage() {
        window.localStorage.setItem("data", JSON.stringify(data));
        window.localStorage.setItem("listCount", JSON.stringify(listCount));
    }

    function readFromLocalStorage(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }


    // function add() {
    //     var request = db.transaction(["task"], "readwrite")
    //         .objectStore("task")
    //         .add({
    //             id: "00",
    //             data: data
    //         });

    //     request.onsuccess = function (event) {
    //         db = request.result;
    //         console.log("Data saved successfully");
    //     };

    //     request.onerror = function (event) {
    //         console.log("failed to save data");
    //     }
    // }

    // function read() {
    //     var transaction = db.transaction(["task"]);
    //     var objectStore = transaction.objectStore("task");
    //     var request = objectStore.get("00");

    //     request.onerror = function (event) {
    //         console.log("Unable to retrieve data from database!");
    //     };

    //     request.onsuccess = function (event) {
    //         // Do something with the request.result!
    //         if (request.result) {
    //             data = request.result.data;
    //         } else {
    //             console.log("Kenny couldn't be found in your database!");
    //         }
    //         render();
    //     };
    // }

    window.addNewList = function () {
        console.log(arguments)
        var name = $('#listName').val();
        createList(name);
        render();
        $('#listName').val("");
    };
    window.onDeleteList = function (id) {
        deleteList(id);
        render();
    };

    window.onClickAddNewCard = function (listId) {
        var list = $("#list_" + listId);
        var desc = list.find('.cardName').val()
        var name = list.find('.user').val()
        var tags = list.find('.tags').val().split(",");
        createCard(listId, desc, name, tags);
        render();
    };

    window.drag = function (ev, listId, cardId) {
        ev.dataTransfer.setData("listId", listId);
        ev.dataTransfer.setData("cardId", cardId);
    };

    window.allowDrop = function allowDrop(ev) {
        ev.preventDefault();
    }

    window.drop = function drop(ev, targetListId) {
        ev.preventDefault();
        var sourceList = ev.dataTransfer.getData("listId");
        var cardId = ev.dataTransfer.getData("cardId");
        moveCard(sourceList, targetListId, cardId);
    };



}(window));
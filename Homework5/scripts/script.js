var counterID = 0,
    countChecked = 0;
var enterTask = document.getElementById("enterTask");
enterTask.focus();
var counter = document.getElementById("counter");

var storage = window.localStorage || null;

function updateTaskSelected() {
    var checkID = this.id.replace("check_", "");
    var task = document.getElementById("text_" + checkID);
    if(this.checked) {
        countChecked++;
        task.className = "checked";
    }
    else {
        countChecked--;
        task.className = "";
    }
    counter.innerText = "You selected " + countChecked + " items.";
    saveToLS();
}

function editedItem() {
    document.getElementById("parent_popup").style.display = "block";
    document.getElementById("popup").style.display = "block";
    document.getElementById("editTask").focus();
    var editID = this.id.replace("edit_", "");
    var oldTask = document.getElementById("text_" + editID).innerHTML;
    document.getElementById("editTask").value = oldTask;

    saveButton = document.getElementById("save");
    cancelButton = document.getElementById("cancel");
    saveButton.addEventListener("click", function() {
        var editedTask = document.getElementById("editTask").value;

        if(editedTask == "" || editedTask == " ") {
            return false;
        }
        document.getElementById("text_" + editID).innerText = editedTask;
        document.getElementById("popup").style.display = "none";
        document.getElementById("parent_popup").style.display = "none";
        saveToLS();
    }, false);

    cancelButton.addEventListener("click", function(){

        document.getElementById("text_" + editID).innerText = oldTask;
        document.getElementById("popup").style.display = "none";
        document.getElementById("parent_popup").style.display = "none";
    }, false);
}

function removeItem() {
    var itemID = this.id.replace("remove_", "");
    if(document.getElementById("text_" + itemID).className == "checked") {
        countChecked--;
    }
    counter.innerText = "You selected " + countChecked + " items.";
    document.getElementById("li_" + itemID).remove();
    //document.getElementById("li_" + itemID).style.display = "none";
    saveToLS();
}

function addNewTask(todoList, item, checked) {
    counterID++;
    var task = document.createElement("li");
    task.setAttribute("draggable", true);

    task.id = "li_" + counterID;

    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "check_" + counterID;
    checkBox.checked = checked;
    checkBox.addEventListener("click", updateTaskSelected, false);

    var p = document.createElement("p");
    p.id = "text_" + counterID;
    p.innerText = item;
    if(checked) {
         p.className = "checked";
    }

    var removeButton = document.createElement("button");
    removeButton.id = "remove_" + counterID;
    removeButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    var editButton = document.createElement("button");
    editButton.id = "edit_" + counterID;
    editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

    
    editButton.addEventListener("click", editedItem, false);

    removeButton.addEventListener("click", removeItem, false);

    task.appendChild(checkBox);
    task.appendChild(p);
    task.appendChild(removeButton);
    task.appendChild(editButton);

    todoList.appendChild(task);
    saveToLS();
}

enterTask.onkeyup = function(event) {

    if(event.which == 13) {
        var taskItem = enterTask.value;

        if(taskItem == "" || taskItem == " ") {
            return false;
        }

        addNewTask(document.getElementById("todo-list"), taskItem, false);
        document.getElementById("enterTask").value = "";
    }
};

document.getElementById("add").addEventListener("click", function(event) {

        var taskItem = enterTask.value;

        if(taskItem == "" || taskItem == " ") {
            return false;
        }

        addNewTask(document.getElementById("todo-list"), taskItem, false);
        document.getElementById("enterTask").value = "";
}, false);


function saveToLS() {
    var children = document.getElementById("todo-list").children;
    var toSave = [];
    for(var i = 0; i < children.length; i++) {
        var checked = children[i].querySelector("input[type='checkbox']").checked;
        var text = children[i].querySelector("p").innerText;

        toSave.push({ text: text, checked: checked });
    }

    storage.setItem('todo', JSON.stringify(toSave));
    storage.setItem('todo-checked', countChecked);

    console.log("Saved to LS.");
}

function loadFromLS() {
    document.getElementById("todo-list").innerHTML = "";
    counterID = 0;
    var amountChecked = 0;

    var got = JSON.parse(storage.getItem('todo'));
    for(var i = 0; i < got.length; i++) {
        var item = got[i];
        if(got[i].checked) { amountChecked++; }
        addNewTask(document.getElementById("todo-list"), item.text, item.checked);
    }

    countChecked = amountChecked;
    counter.innerText = "You selected " + countChecked + " items.";

    console.log("Loaded from LS.");
}

function sortable(rootEl, onUpdate){
    var dragEl, nextEl;
    
    [].slice.call(rootEl.children).forEach(function (itemEl){
        itemEl.draggable = true;
    });
    
    function _onDragOver(evt){
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
       
        var target = evt.target;
        if( target && target !== dragEl && target.nodeName == 'LI' ){
            var rect = target.getBoundingClientRect();
            var next = (evt.clientY - rect.top)/(rect.bottom - rect.top) > .5;
            rootEl.insertBefore(dragEl, next && target.nextSibling || target);

        }
        if(target.nextSibling == null) {
            rootEl.insertBefore(dragEl, null);
        }
    }
    
    function _onDragEnd(evt){
        evt.preventDefault();
       
        dragEl.classList.remove('ghost');
        rootEl.removeEventListener('dragover', _onDragOver, false);
        rootEl.removeEventListener('dragend', _onDragEnd, false);

        if( nextEl !== dragEl.nextSibling ){
            onUpdate(dragEl);
        }
    }
    
    rootEl.addEventListener('dragstart', function (evt){
        dragEl = evt.target;
        nextEl = dragEl.nextSibling;
        
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('Text', dragEl.textContent);

        rootEl.addEventListener('dragover', _onDragOver, false);
        rootEl.addEventListener('dragend', _onDragEnd, false);

        setTimeout(function (){
            dragEl.classList.add('ghost');
        }, 0)
    }, false);
}


if(storage == null) { alert("Local Storage is not supported."); }
if(JSON.parse(storage.getItem('todo')).length != 0) {
    loadFromLS();
}

sortable( document.getElementById('todo-list'), function (item){
    saveToLS();
});
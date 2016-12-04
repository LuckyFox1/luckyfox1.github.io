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
}

function editedItem() {
    document.getElementById("popup").style.display = "block";
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
    }, false);

    cancelButton.addEventListener("click", function(){

        document.getElementById("text_" + editID).innerText = oldTask;
        document.getElementById("popup").style.display = "none";
    }, false);
}

function removeItem() {
    var itemID = this.id.replace("remove_", "");
    if(document.getElementById("text_" + itemID).className == "checked") {
        countChecked--;
    }
    counter.innerText = "You selected " + countChecked + " items.";
    document.getElementById("li_" + itemID).style.display = "none";

}

function addNewTask(todoList, item) {
    counterID++;
    var task = document.createElement("li");
    task.id = "li_" + counterID;

    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "check_" + counterID;
    checkBox.addEventListener("click", updateTaskSelected, false);

    var p = document.createElement("p");
    p.id = "text_" + counterID;
    p.innerText = item;

    var editButton = document.createElement("button");
    editButton.id = "edit_" + counterID;
    editButton.innerText = "Edit";

    var removeButton = document.createElement("button");
    removeButton.id = "remove_" + counterID;
    removeButton.innerText = "Remove";

    editButton.addEventListener("click", editedItem, false);
    removeButton.addEventListener("click", removeItem, false);

    task.appendChild(checkBox);
    task.appendChild(p);
    task.appendChild(editButton);
    task.appendChild(removeButton);
    todoList.appendChild(task);

}

var counterID = 0,
    countChecked = 0;
var enterTask = document.getElementById("enterTask");
enterTask.focus();
var counter = document.getElementById("counter");

enterTask.onkeyup = function(event) {

    if(event.which == 13) {
        var taskItem = enterTask.value;

        if(taskItem == "" || taskItem == " ") {
            return false;
        }

        addNewTask(document.getElementById("todo-list"), taskItem);
        document.getElementById("enterTask").value = "";
    }
};


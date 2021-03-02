var kanban = {
    todoList:JSON.parse(localStorage.getItem('todoList'))||[],
    doingList:JSON.parse(localStorage.getItem('doingList'))||[],
    doneList:JSON.parse(localStorage.getItem('doneList'))||[],

    todoColumn: document.getElementById('todoColumn'),
    doingColumn: document.getElementById('doingColumn'),
    doneColumn: document.getElementById('doneColumn'),
    render: kanbanRender,
    config: kanbanConfig
}

var typeColumn = {
    todo: 'Nhiệm vụ',
    doing: 'Đang làm',
    done: 'Hoàn thành'
}

kanban.render();

function kanbanRender(){
    ColumnRender('todo');
    ColumnRender('doing');
    ColumnRender('done');

    var addButtons = document.getElementsByClassName('addBtn');
       
    //todoButton
    addButtons[0].addEventListener('click',addNewTask);    
    //doingButton
    addButtons[1].addEventListener('click',addNewTask);
    //doneButton
    addButtons[2].addEventListener('click',addNewTask);

}


//hiển thị các thẻ trong mỗi cột
function ColumnRender(type){
    var  abc = 'aa';
    //var titleTodoColumn = kanban.todoColumn.children[0];
    var countTodo = kanban[`${type}List`].length;
    kanban[`${type}Column`].children[0].innerHTML = `${typeColumn[type]}<span class="kanban__count">${countTodo}</span>`;
    //khi cho this vào trong saveTask nghĩa là chuyền chính button vào
    var tasks = kanban[`${type}List`].map(function(item,idx) {
           return `
           <div key = "${idx}" class="wrap-item">
                    <textarea 
                     draggable="true" 
                     key="${idx}" 
                     type="${type}"  
                     class="kanban__item 
                     ${type}-border-color"
                     ondragstart="onDrag(event)"
                     >
                    ${item.title}
                    </textarea>
                    <button class="saveBtn" onClick="saveTask(this)"><i class="fas fa-check"></i></button>
                    <button class="removeBtn" onCLick="removeTask(this)"><i class="fas fa-times"></i></button>
           </div>
           `;
    })
     


    kanban[`${type}Column`].children[1].innerHTML = tasks.join('');
}
//draggable="true" : có thể di chuyển và kéo thả
//dragstart="function()": khi thực hiện kéo thả sẽ chạy function này
//dragover : khi kéo thả 1 vào sẽ chạy function
//drop=
//dataTransfer (set,get)
//
function kanbanConfig(){
    var kanbanColumn = Array.from(document.getElementsByClassName('kanban__col')) ;
    for(var i = 0;i < kanbanColumn.length;i++){
        kanbanColumn[i].addEventListener('dragover',onDragOver);
        kanbanColumn[i].addEventListener('drop',onDrop);
    }
}

function onDragOver(event){
    event.preventDefault();
    var currentColumn = event.currentTarget;
    
}

//khi keo task ra và thả sẽ gọi function này
function onDrop(event){
    var index = event.dataTransfer.getData('index');
    var type = event.dataTransfer.getData('type');
    //lấy ra thông tin ô mà nó nhả ra
    var nextType = event.currentTarget.getAttribute('name');

    var task = kanban[`${type}List`][index];
    
    kanban[`${nextType}List`].push(task);
    kanban[`${type}List`].splice(index,1);
    localStorage.setItem(`${type}List`,JSON.stringify(kanban[`${type}List`]));
    localStorage.setItem(`${nextType}List`,JSON.stringify(kanban[`${nextType}List`]));
    kanban.render();
    
}


//keo task lên
function onDrag(event){
    var currentTarget = event.currentTarget;
    var index = currentTarget.getAttribute('key');
    var type = currentTarget.getAttribute('type');
    event.dataTransfer.setData('type',type);
    event.dataTransfer.setData('index',index);
    
}

kanban.config();



//thêm thẻ
function addNewTask(e){
    //getAttribute('name): lấy giá trị của thuộc tính name trong thẻ
    var type = e.currentTarget.getAttribute('name');
    
    var newTask = {
        id: Math.trunc(Math.random() * 10000 + Math.random() * 1000),
        title: ''
    }
    kanban[`${type}List`].push(newTask);
    kanban.render();

}

function saveTask(currentTarget){

    //lấy ra phần tử phía trên liền kề nó
    var task = currentTarget.previousElementSibling;
    
    var newContent = task.value;
    var index = task.getAttribute('key');
    var type = task.getAttribute('type');
    

    kanban[`${type}List`][index].title = newContent.trim();

    
    localStorage.setItem(`${type}List`,JSON.stringify(kanban[`${type}List`]));
    alert('Đã lưu thành công !');
}

function removeTask(currentTarget){
    //tiếp tục chấm thêm 1 lần nữa để truy cập đến thẻ tiếp theo
    var task = currentTarget.previousElementSibling.previousElementSibling;
    var key = task.getAttribute('key');
    var type = task.getAttribute('type');
    kanban[`${type}List`].splice(key,1);
    localStorage.setItem(`${type}List`,JSON.stringify(kanban[`${type}List`]));
    alert('Xoá thành công');
    kanban.render();
}



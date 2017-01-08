// get initilization file
$.getScript("js/init.js");
$.getScript("js/bootbox.min.js");

var allTasks = [
    [
      
    ]
]
var inProgress = [
    [
          "<input type='checkbox' onchange='showDelete()' id='chkSelect1'><label for='chkSelect1'></label>",
          "Title1",
          "Desc1",
          "2011/07/25",
          "<div class='dropdown options' style='display:none;'><i class='fa fa-wrench' data-toggle='dropdown' aria-hidden='true'></i><ul class='dropdown-menu dropdown-table' id='dropdown1'><li><a href='#' data-toggle='modal' data-target='#modalEdit' onclick='EditTask(this)'>Edit</a></li><li><a href='#' onclick='MarkAsDone(this)'>Mark as Done</a></li><li><a href='#' onclick='DeleteFromInProgressAndAll(this)'>Delete</a></li><li><a href='#' onclick='ArchiveFromInProgressAndAll(this)'>Archive</a></li></ul></div>"
    ]
]

var archived = []
var completed = []

function getAllTasks() {
    sidebarClear();
    updateColor('blue');
    $("a[onclick='getAllTasks()']").addClass("rgba-grey-light st-blue");
    $('#titleBar').html('All Tasks');
    tableToggle('Table_AllTasks', 'Table_Completed', 'Table_inProgress', 'Table_Archived');
}

function getArchived() {
    sidebarClear();
    updateColor('orange');
    $("a[onclick='getArchived()']").addClass("rgba-grey-light st-orange");
    $('#titleBar').html('Archived');
    tableToggle('Table_Archived', 'Table_Completed', 'Table_inProgress', 'Table_AllTasks');
}

function getCompleted() {
    sidebarClear();
    updateColor('green');
    $("a[onclick='getCompleted()']").addClass("rgba-grey-light st-green");
    $('#titleBar').html('Completed');
    tableToggle('Table_Completed', 'Table_Archived', 'Table_inProgress', 'Table_AllTasks');
}

function getInProgress() {
    sidebarClear();
    updateColor('red');
    $("a[onclick='getInProgress()']").addClass("rgba-grey-light st-red");
    $('#titleBar').html('In Progress');
    tableToggle('Table_inProgress', 'Table_Archived', 'Table_Completed', 'Table_AllTasks');
}

$(document).ready(function () {

    var test = [
        "Title1",
        "Desc1",
        "2011/07/25"
    ]

    showDelete();
    tasks_num = 0;
    allTasksTable = $('#Table_AllTasks').DataTable({
        columnDefs: [
            {
                targets: [0, 1, 2],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ],
        'aoColumnDefs': [{
            'bSortable': false,
            'aTargets': [-1, -5] /* 1st one, start by the right */
        },
        { "sClass": "dpass", "aTargets": [2] }, // description
        { "sClass": "tableTitle", "aTargets": [1] }, // title
        { "sClass": "tableDate", "aTargets": [3] } // date
        ],
        "aaSorting": [[3, "desc"]], // Sort by third column descending (Due Date)
        //"ajax": 'table.json',
        data: allTasks,
        select: true
    });
    inProgressTable = $('#Table_inProgress').DataTable({
        columnDefs: [
            {
                targets: [0, 1, 2],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ],
        'aoColumnDefs': [{
            'bSortable': false,
            'aTargets': [-1, -5] /* 1st one, start by the right */
        },
            { "sClass": "dpass", "aTargets": [2] }, // description
            { "sClass": "tableTitle", "aTargets": [1] }, // title
            { "sClass": "tableDate", "aTargets": [3] } // date
        ],
        "aaSorting": [[3, "desc"]], // Sort by third column descending (Due Date)
        data: inProgress,
        select: true
    });

    $('#Table_Completed').DataTable({
        columnDefs: [
            {
                targets: [0, 1, 2],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ],
        'aoColumnDefs': [{
            'bSortable': false,
            'aTargets': [-1, -5] /* 1st one, start by the right */
        },
                { "sClass": "dpass", "aTargets": [2] }, // description
                { "sClass": "tableTitle", "aTargets": [1] }, // title
                { "sClass": "tableDate", "aTargets": [3] } // date
        ],
        "aaSorting": [[3, "desc"]], // Sort by third column descending (Due Date)
        data: completed,
        select: true
    });

    $('#Table_Archived').DataTable({
        columnDefs: [
            {
                targets: [0, 1, 2],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ],
        'aoColumnDefs': [{
            'bSortable': false,
            'aTargets': [-1, -5] /* 1st one, start by the right */
        },
                { "sClass": "dpass", "aTargets": [2] }, // description
                { "sClass": "tableTitle", "aTargets": [1] }, // title
                { "sClass": "tableDate", "aTargets": [3] } // date
        ],
        "aaSorting": [[3, "desc"]], // Sort by third column descending (Due Date)
        data: archived,
        select: true
    });

    $('#Table_inProgress').parents('div.dataTables_wrapper').first().hide();
    $('#Table_Completed').parents('div.dataTables_wrapper').first().hide();
    $('#Table_Archived').parents('div.dataTables_wrapper').first().hide();

    checkBoxHandler('chk_SelectAll_AllTasks');
    checkBoxHandler('chk_SelectAll_inProgress');
    checkBoxHandler('chk_SelectAll_Completed');
    checkBoxHandler('chk_SelectAll_Archived');

    //setInterval(optionsRenew, 1000);
    //for (var i = 0; i < test.length; i++) {
        //AddNewRow("test", "test2", "fadsf", '#Table_AllTasks');
    //}
});

function optionsRenew(){
    $('#Table_AllTasks tbody tr').addClass('optionsRow');

    refreshToolTip();
    refreshCount();

    $('.optionsRow').mouseenter(function () {
        $(this).children().find('div').attr('style', 'display:block;');
    }).mouseleave(function () {
        $(this).children().find('div').attr('style', 'display:none;');
    });
}

function checkBoxHandler(idParam) {
    
    $("#" + idParam).click(function () {
        var id = $("#" + idParam).closest("table").attr("id");
        var table = $('#' + id).DataTable();
        $(':checkbox', table.rows().nodes()).prop('checked', this.checked);

    });
}

//Add in inProgress and All Tasks
function AddNewTask() {
    if ($('#taskTitle').val() == '') {
        $('#taskTitle').addClass('invalid');
        toastr.error('You can not add an empty task');
        return;
    }
    else if ($('#datePicker').val() == '') {
        $('#datePicker').addClass('invalid');
        toastr.error('Date is required');
        return;
    }
    else {
        var title = $('#taskTitle').val();
        var description = $('#description').val();
        var date = $('#datePicker').val();

        AddNewRow(title, description, date, '#Table_inProgress');
        AddNewRow(title, description, date, '#Table_AllTasks');

        // remove active classes and invalid check
        $('#taskTitle').removeClass('invalid');
        $('#taskTitle').removeClass('valid');
        $('#datePicker').removeClass('invalid');
        $('#datePicker').removeClass('valid');
        $('#addTaskForm .active').removeClass('active');

        // clear textboxes
        $('#taskTitle').val('');
        $('#description').val('');
        $('#datePicker').val('');

        refreshCount();
        $('#modalAdd').modal('toggle');
        toastr.success('New task added');
        refreshToolTip();
    }
}

function refreshToolTip() {

    refreshToolTipSpecificTable('Table_AllTasks');
    refreshToolTipSpecificTable('Table_inProgress');
    refreshToolTipSpecificTable('Table_Completed');
    refreshToolTipSpecificTable('Table_Archived');
}

function refreshToolTipSpecificTable(tableParam) {
    $('#' + tableParam + ' tbody tr').each(function () {
        var table = $("#" + tableParam).dataTable();
        var sDescription = table.fnGetData(this, 2);
       
        if (sDescription == "") {
            sDescription = "No description here";
        }
        this.setAttribute('title', sDescription);
    });

    /* Init DataTables */
    var oTable = $('#' + tableParam).dataTable();

    /* Apply the tooltips */
    oTable.$('tr').tooltip({
        "delay": 0,
        "track": true,
        "fade": 250,
    });
}

//Add Row Functions
function AddNewRow(TitleParam, DescriptionParam, DueDateParam, TableParam) {
    var chkSpan = document.createElement("SPAN");
    chkSpan.setAttribute('onmousehover', 'alert("test")');
    var chkSelect = document.createElement("INPUT");
    chkSelect.setAttribute("type", "checkbox");
    chkSelect.setAttribute("onchange", "showDelete()");
    chkSelect.setAttribute("id", "chkSelect" + tasks_num);
    var chkLabel = document.createElement("LABEL");
    chkLabel.setAttribute("for", "chkSelect" + tasks_num);
    var container = document.createElement("DIV");
    var options = document.createElement("DIV");
    options.setAttribute("class", "dropdown options");
    var icon = document.createElement("I");
    icon.setAttribute("class", "fa fa-wrench");
    icon.setAttribute("data-toggle", "dropdown");
    icon.setAttribute("aria-hidden", "true");
    var list = document.createElement("UL");
    list.setAttribute("class", "dropdown-menu dropdown-table");
    list.setAttribute("id", "dropdown1");
    var liEdit = document.createElement("LI");
    var ed = document.createElement("A");
    ed.setAttribute("href", "#");
    ed.setAttribute("data-toggle","modal");
    ed.setAttribute("data-target","#modalEdit");
    ed.innerText = "Edit";
    ed.setAttribute("onclick", "EditTask(this)");
    liEdit.appendChild(ed);
    var liDone = document.createElement("LI");
    var ld = document.createElement("A");
    ld.setAttribute("href", "#");
    ld.innerText = "Mark as Done";
    ld.setAttribute("onclick", "MarkAsDone(this)");
    liDone.appendChild(ld);
    var liDelete = document.createElement("LI");
    var ldel = document.createElement("A");
    ldel.setAttribute("href", "#");
    ldel.innerText = "Delete";
    ldel.setAttribute("onclick", "DeleteFromInProgressAndAll(this)");
    liDelete.appendChild(ldel);
    var liArchive = document.createElement("LI");
    var liAr = document.createElement("A");
    liAr.setAttribute("href", "#");
    liAr.innerText = "Archive";
    liAr.setAttribute("onclick", "ArchiveFromInProgressAndAll(this)");

    liArchive.appendChild(liAr);

    list.appendChild(liEdit);
    list.appendChild(liDone);
    list.appendChild(liDelete);
    list.appendChild(liArchive);

    options.appendChild(icon);
    options.appendChild(list);
    options.setAttribute("style", "display:none;");
    container.appendChild(options);

    tasks_num++;

    chkSpan.appendChild(chkSelect);
    chkSpan.appendChild(chkLabel);

    var table = $(TableParam).DataTable();

    table.row.add([chkSpan.innerHTML, TitleParam, DescriptionParam, DueDateParam, container.innerHTML]).draw(false).nodes()
    .to$()
    .addClass('optionsRow');

    $('.optionsRow').mouseenter(function () {
        $(this).children().find('div').attr('style', 'display:block;');
    }).mouseleave(function () {
        $(this).children().find('div').attr('style', 'display:none;');
    });

    // handling options when loading data
}

function AddNewCompletedRow(TitleParam, DescriptionParam, DueDateParam, TableParam) {
    var chkSpan = document.createElement("SPAN");
    chkSpan.setAttribute('onmousehover', 'alert("test")');
    var chkSelect = document.createElement("INPUT");
    chkSelect.setAttribute("type", "checkbox");
    chkSelect.setAttribute("onchange", "showDelete()");
    chkSelect.setAttribute("id", "chkSelect" + tasks_num);
    var chkLabel = document.createElement("LABEL");
    chkLabel.setAttribute("for", "chkSelect" + tasks_num);
    var container = document.createElement("DIV");
    var options = document.createElement("DIV");
    options.setAttribute("class", "dropdown options");
    var icon = document.createElement("I");
    icon.setAttribute("class", "fa fa-wrench");
    icon.setAttribute("data-toggle", "dropdown");
    icon.setAttribute("aria-hidden", "true");
    var list = document.createElement("UL");
    list.setAttribute("class", "dropdown-menu dropdown-table");
    list.setAttribute("id", "dropdown1");
    var liDelete = document.createElement("LI");
    var ldel = document.createElement("A");
    ldel.setAttribute("href", "#");
    ldel.innerText = "Delete";
    ldel.setAttribute("onclick", "DeleteFromCompletedAndAll(this)");
    liDelete.appendChild(ldel);
    var liArchive = document.createElement("LI");
    var liAr = document.createElement("A");
    liAr.setAttribute("href", "#");
    liAr.innerText = "Archive";
    liAr.setAttribute("onclick", "ArchiveFromCompletedAndAll(this)");

    liArchive.appendChild(liAr);

    list.appendChild(liDelete);
    list.appendChild(liArchive);

    options.appendChild(icon);
    options.appendChild(list);
    options.setAttribute("style", "display:none;");
    container.appendChild(options);

    tasks_num++;

    chkSpan.appendChild(chkSelect);
    chkSpan.appendChild(chkLabel);

    var table = $(TableParam).DataTable();

    if (TableParam == '#Table_Completed')
    {
        table.row.add([chkSpan.innerHTML, TitleParam, DescriptionParam, DueDateParam, container.innerHTML]).draw(false).nodes()
    .to$()
    .addClass('completedTask optionsRow');
    } else {
        table.row.add([chkSpan.innerHTML, TitleParam, DescriptionParam, DueDateParam, container.innerHTML]).draw(false).nodes()
    .to$()
    .addClass('strikeout completedTask optionsRow');
    }

    $('.optionsRow').mouseenter(function () {
        $(this).children().find('div').attr('style', 'display:block;');
    }).mouseleave(function () {
        $(this).children().find('div').attr('style', 'display:none;');
    });
}

function AddNewArchivedRow(TitleParam, DescriptionParam, DueDateParam, TableParam) {
    var chkSpan = document.createElement("SPAN");
    chkSpan.setAttribute('onmousehover', 'alert("test")');
    var chkSelect = document.createElement("INPUT");
    chkSelect.setAttribute("type", "checkbox");
    chkSelect.setAttribute("onchange", "showDelete()");
    chkSelect.setAttribute("id", "chkSelect" + tasks_num);
    var chkLabel = document.createElement("LABEL");
    chkLabel.setAttribute("for", "chkSelect" + tasks_num);

    var container = document.createElement("DIV");
    var options = document.createElement("DIV");
    options.setAttribute("class", "dropdown options");
    var icon = document.createElement("I");
    icon.setAttribute("class", "fa fa-wrench");
    icon.setAttribute("data-toggle", "dropdown");
    icon.setAttribute("aria-hidden", "true");
    var list = document.createElement("UL");
    list.setAttribute("class", "dropdown-menu dropdown-table");
    list.setAttribute("id", "dropdown1");

    var liDelete = document.createElement("LI");
    var ldel = document.createElement("A");
    ldel.setAttribute("href", "#");
    ldel.innerText = "Delete";
    ldel.setAttribute("onclick", "DeleteFromArchived(this)");
    liDelete.appendChild(ldel);


    list.appendChild(liDelete);

    options.appendChild(icon);
    options.appendChild(list);
    options.setAttribute("style", "display:none;");
    container.appendChild(options);

    tasks_num++;

    chkSpan.appendChild(chkSelect);
    chkSpan.appendChild(chkLabel);

    var table = $(TableParam).DataTable();

    table.row.add([chkSpan.innerHTML, TitleParam, DescriptionParam, DueDateParam, container.innerHTML]).draw(false).nodes()
    .to$()
    .addClass('archivedTask optionsRow');

    $('.optionsRow').mouseenter(function () {
        $(this).children().find('div').attr('style', 'display:block;');
    }).mouseleave(function () {
        $(this).children().find('div').attr('style', 'display:none;');
    });
}

function EditTask(element) {
    $(".ReadyForEdit").removeClass("ReadyForEdit");
    
    var rowIndex = $('#Table_AllTasks').DataTable().row($(element).parents('tr')).index();
    var rowIndex2 = $('#Table_inProgress').DataTable().row($(element).parents('tr')).index();

    $('#lblEditDesc').removeClass('active');
    $('#editDescIcon').removeClass('active');


    $('#Table_inProgress').DataTable().rows(rowIndex2)
    .nodes()
    .to$()
    .addClass('ReadyForEdit');

    $('#Table_AllTasks').DataTable().rows(rowIndex)
    .nodes()
    .to$()
    .addClass('ReadyForEdit');

    var title = $(element).closest('tr').find('.tableTitle').html();
    var description = $(element).closest('tr').find('.dpass').html();
    var date = $(element).closest('tr').find('.tableDate').html();

    $('#lblEditTitle').addClass('active');
    $('#editTitleIcon').addClass('active');
    $('#EditdatePicker').addClass('active');

    if (description != "") {
        $('#lblEditDesc').addClass('active');
        $('#editDescIcon').addClass('active');
    }

    $('#edittaskTitle').val(title);
    $('#editdescription').val(description);
    $('#EditdatePicker').val(date);
}

//Mark As Done function
function MarkAsDone(element) {
    var title = $(element).closest('tr').find('.tableTitle').html();
    var description = $(element).closest('tr').find('.dpass').html();
    var date = $(element).closest('tr').find('.tableDate').html();

    DeleteFromInProgressAndAll2(element);
    AddNewCompletedRow(title, description, date, '#Table_Completed');
    AddNewCompletedRow(title, description, date, '#Table_AllTasks');
    refreshCount();
}

//Detete Functions
function DeleteFromInProgressAndAll(element) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
    $('#Table_AllTasks').DataTable().row($(element).parents('tr')).remove().draw(false);
    $('#Table_inProgress').DataTable().row($(element).parents('tr')).remove().draw(false);
    refreshCount();
    showDelete();
}
    });
}

function DeleteFromCompletedAndAll(element) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
    $('#Table_AllTasks').DataTable().row($(element).parents('tr')).remove().draw(false);
    $('#Table_Completed').DataTable().row($(element).parents('tr')).remove().draw(false);
    showDelete();
    refreshCount();
}
    });
}

function DeleteFromArchived(element) {
    bootbox.confirm("Are you sure?", function (result) {
        if (result) {
    $('#Table_Archived').DataTable().row($(element).parents('tr')).remove().draw(false);
    showDelete();
    refreshCount();
}
    });
}

//Archive Functions
function ArchiveFromInProgressAndAll(element) {
    var title = $(element).closest('tr').find('.tableTitle').html();
    var description = $(element).closest('tr').find('.dpass').html();
    var date = $(element).closest('tr').find('.tableDate').html();
    DeleteFromInProgressAndAll2(element);
    AddNewArchivedRow(title, description, date, '#Table_Archived');
    refreshCount();
}

function ArchiveFromCompletedAndAll(element) {
    var title = $(element).closest('tr').find('.tableTitle').html();
    var description = $(element).closest('tr').find('.dpass').html();
    var date = $(element).closest('tr').find('.tableDate').html();
    DeleteFromCompletedAndAll2(element)
    AddNewArchivedRow(title, description, date, '#Table_Archived');
    refreshCount();
}

function showDelete() {
    var n = $("tbody input:checked").length;
    if (n > 0) {
        $('#deleteFloat').show();
        $('#addFloat').hide();
        
    } else {
        $('#deleteFloat').hide();
        $('#addFloat').show();
    }

    if (n == 1) {
        $('#deleteCounter').text("Delete selected Task");
    } else {
        $('#deleteCounter').text("Delete selected Task");
        $('#deleteCounter').text("Delete all selected tasks (" + n + ")");
    }
}

function deleteChecked() {
    $("tbody input:checked").each(function () {
        if ($(this).closest("tr").hasClass('archivedTask')) {
            DeleteFromArchived2(this);
        } else if ($(this).closest("tr").hasClass('completedTask')) {
            DeleteFromCompletedAndAll2(this);
        } else {
            DeleteFromInProgressAndAll2(this);
        }
    });

    $("#chk_SelectAll_AllTasks").removeAttr("checked");
    $("#chk_SelectAll_inProgress").removeAttr("checked");
    $("#chk_SelectAll_Archived").removeAttr("checked");
    $("#chk_SelectAll_Completed").removeAttr("checked");
    $('#modalDelete').modal('toggle');
}

function DoneEditing() {
    if ($('#edittaskTitle').val() == '') {
        $('#edittaskTitle').addClass('invalid');
        toastr.error('Invalid Edit');
        return;
    }
    else if ($('#EditdatePicker').val() == '') {
        $('#EditdatePicker').addClass('invalid');
        toastr.error('Date Required');
        return;
    }
    else {
        $('#Table_inProgress').DataTable().row($('.ReadyForEdit')).remove().draw(false);
        $('#Table_AllTasks').DataTable().row($('.ReadyForEdit')).remove().draw(false);

        var title = $('#edittaskTitle').val();
        var description = $('#editdescription').val();
        var date = $('#EditdatePicker').val();

        AddNewRow(title, description, date, '#Table_inProgress');
        AddNewRow(title, description, date, '#Table_AllTasks');

        // remove active classes and invalid check
        $('#edittaskTitle').removeClass('invalid');
        $('#edittaskTitle').removeClass('valid');
        $('#EditdatePicker').removeClass('invalid');
        $('#EditdatePicker').removeClass('valid');
        $('#addTaskForm .active').removeClass('active');

        // clear textboxes
        $('#edittaskTitle').val('');    
        $('#editdescription').val('');
        $('#EditdatePicker').val('');

        refreshCount();
        $('#modalEdit').modal('toggle');
        toastr.success('Edit Successful');
        refreshToolTip();

    }
}

function DeleteFromInProgressAndAll2(element) {
    $('#Table_AllTasks').DataTable().row($(element).parents('tr')).remove().draw(false);
    $('#Table_inProgress').DataTable().row($(element).parents('tr')).remove().draw(false);
    refreshCount();
    showDelete();
}

function DeleteFromCompletedAndAll2(element) {
    $('#Table_AllTasks').DataTable().row($(element).parents('tr')).remove().draw(false);
    $('#Table_Completed').DataTable().row($(element).parents('tr')).remove().draw(false);
    showDelete();
    refreshCount();
}

function DeleteFromArchived2(element) {
    $('#Table_Archived').DataTable().row($(element).parents('tr')).remove().draw(false);
    showDelete();
    refreshCount();
}
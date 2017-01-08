// clear the design of the selected table in the sidebar
function sidebarClear() {
    $(".rgba-grey-light").removeClass("rgba-grey-light");
    $(".st-blue").removeClass("st-blue");
    $(".st-orange").removeClass("st-orange");
    $(".st-green").removeClass("st-green");
    $(".st-red").removeClass("st-red");
}

// refresh the count in the sidebar
function refreshCount() {
    // get count of all tables
    var countAllTasks = $('#Table_AllTasks').dataTable().fnGetData().length;
    var countInProgress = $('#Table_inProgress').dataTable().fnGetData().length;
    var countArchived = $('#Table_Archived').dataTable().fnGetData().length;
    var countCompleted = $('#Table_Completed').dataTable().fnGetData().length;

    $('#allTasksCount').html(countAllTasks);
    $('#inProgressCount').html(countInProgress);
    $('#archivedCount').html(countArchived);
    $('#completedCount').html(countCompleted);

    // refresh progressBar
    var count = 1;
    if (countAllTasks != 0) {
        count = (countAllTasks - countInProgress) / countAllTasks;
    }
    $('#progressBarSideBar').attr('style', 'width:' + count + '00%');

}

// switch between tables
function tableToggle(table1, table2, table3, table4) {
    $('#' + table1).parents('div.dataTables_wrapper').first().show();
    $('#' + table2).parents('div.dataTables_wrapper').first().hide();
    $('#' + table3).parents('div.dataTables_wrapper').first().hide();
    $('#' + table4).parents('div.dataTables_wrapper').first().hide();
}

function updateColor(color) {
    $('.navToolbar').removeClass('red orange green blue');
    switch (color) {
        case 'red':
            $('.navToolbar').addClass("red");
            break;
        case 'green':
            $('.navToolbar').addClass("green");
            break;
        case 'blue':
            $('.navToolbar').addClass("blue");
            break;
        case 'orange':
            $('.navToolbar').addClass("orange");
            break;
        default:
    }
}

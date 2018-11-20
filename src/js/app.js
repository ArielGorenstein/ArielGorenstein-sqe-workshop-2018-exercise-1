import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        try{
            let parsedCode = parseCode(codeToParse);
            $('#realTable').show();
            dismentleTable();
            showTable(parsedCode);
        }catch (e) {
            $('#codePlaceholder').val(e);
        }
    });
});

const dismentleTable = () => {
    let table = document.getElementById('realTable');
    for (let i = table.rows.length - 1; i >= 1; i--){
        table.deleteRow(i);
    }
};

const showTable = list => {
    for(let i = 0 ; i < list.length; i++){
        displayRow(list, i);
    }
};

const displayRow = (list, i) =>{
    let table = document.getElementById('realTable');
    let row = table.insertRow(i + 1);

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    displayCell(cell1, list[i].line);
    displayCell(cell2, list[i].type);
    displayCell(cell3, list[i].name);
    displayCell(cell4, list[i].condition);
    displayCell(cell5, list[i].value);
};

const displayCell = (cell, content) => cell.innerHTML = content == null ? '' : content;

var dbname = "DELIVERY-DB";
var relation = "SHIPMENT-TABLE";
var token = "90934940|-31949248969266955|90959432";
var url = "http://api.login2explore.com:5577/";
var jpdbIML = "api/iml";
var jpdbIRL = "api/irl";

$(document).ready(function () {
    $('#shipNum').focus();
    $("#desc, #src, #des, #shipDate, #expDelDate").prop("disabled", true);
    $("#save, #change, #reset").prop("disabled", true);
});

function validateForm() {
    var shipNum = $("#shipNum").val();
    var desc = $("#desc").val();
    var src = $("#src").val();
    var des = $("#des").val();
    var shipDate = $("#shipDate").val();
    var expDelDate = $("#expDelDate").val();

    if (!shipNum || !desc || !src || !des || !shipDate || !expDelDate) {
        alert("All fields are required.");
        return "";
    }

    var jsonObj = {
        shipNum: shipNum,
        desc: desc,
        src: src,
        des: des,
        shipDate: shipDate,
        expDelDate: expDelDate
    };
    return JSON.stringify(jsonObj);
}
function createGET_BY_KEYRequest(token, dbName, relName, key) {
    return JSON.stringify({
        token: token,
        dbName: dbName,
        rel: relName,
        cmd: "GET_BY_KEY",
        jsonStr: { shipNum: key }
    });
}

function checkShipNum() {
    var shipNum = $("#shipNum").val().trim();
    if (shipNum === "") {
        alert("Shipment Number cannot be empty.");
        return;
    }

    var getReq = createGET_BY_KEYRequest(token, dbname, relation, shipNum);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getReq, url, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $("#desc, #src, #des, #shipDate, #expDelDate").prop("disabled", false);
        $("#desc").focus();
    } else if (resJsonObj.status === 200) {
        fillData(resJsonObj);
        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $("#shipNum").prop("disabled", true);
        $("#desc, #src, #des, #shipDate, #expDelDate").prop("disabled", false);
        $("#desc").focus();
    }
}

function fillData(resJsonObj) {
    saveRecNo(resJsonObj);
    var record = JSON.parse(resJsonObj.data).record;
    $("#shipNum").val(record.shipNum);
    $("#desc").val(record.desc);
    $("#src").val(record.src);
    $("#des").val(record.des);
    $("#shipDate").val(record.shipDate);
    $("#expDelDate").val(record.expDelDate);
}

function saveRecNo(resJsonObj) {
    var record = JSON.parse(resJsonObj.data);
    localStorage.setItem("recno", record.rec_no);
    console.log("Record number saved:", record.rec_no);
}

function saveForm() {
    var jsonObj = validateForm();
    if (!jsonObj) return;

    var putReq = createPUTRequest(token, jsonObj, dbname, relation);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putReq, url, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        alert("Error: " + resJsonObj.message);
    } else {
        alert("Data saved successfully!");
    }

    resetForm();
}

function changeForm() {
    $('#change').prop('disabled', true);
    var jsonObj = validateForm();
    if (!jsonObj) return;

    var updateReq = createUPDATERecordRequest(token, jsonObj, dbname, relation, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateReq, url, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        alert("Error: " + resJsonObj.message);
    } else {
        alert("Data updated successfully!");
    }

    resetForm();
}

function resetForm() {
    $("#shipNum").val("").prop("disabled", false);
    $("#desc, #src, #des, #shipDate, #expDelDate").val("").prop("disabled", true);
    $("#save, #change, #reset").prop("disabled", true);
    $("#shipNum").focus();
}
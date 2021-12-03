const ErrInvalidNameLength0 = "Name must not be empty."
const ErrInvalidNameLength255 = "Name must be at most 255 characters."
const ErrInvalidNameChar = "Name must contain only letters or spaces."
const UserInfoEndpoint = "https://api.genderize.io/?name="
const ErrFetchingInfo = "something went wrong :( "
const GenderInfo = "(name => gender) saved."
const invalidGenderInfo = "Invalid Gender."
const ErrNameNotFound = "Name Not Found."
const RestoreCache = "restore data from cache"
const RemoveCache = "remove data from cache"


window.localStorage.clear();

function submitRequest() {
    let radio = document.querySelector('input[type=radio][name=gender]:checked');
    if (radio)
        radio.checked = false;

    document.getElementById("savedName").style.visibility = "hidden";

    let name = validateUsername(document.forms["frm"]["fname"].value);

    if (!name)
        return false;

    restore = restoreFromCache(name);
    if (restore) {
        clearInfo();
        setSavedInfo(name, restore);
        document.getElementById("savedName").style.visibility = "visible";
    }

    const infoReq = new XMLHttpRequest();
    let url = UserInfoEndpoint + name;
    infoReq.open("GET", url);
    infoReq.send();

    infoReq.onreadystatechange = () => {
        if (!isSuccessful(infoReq.status)) {
            if (infoReq.status === 404) {
                notify(ErrNameNotFound);
                // return false;
            }
            notify(ErrFetchingInfo + infoReq.status)
        }
        let response = JSON.parse(infoReq.response);
        setInfo(response);
    }
}


/*
    call saveRequest when click on save.
    1. if radio button is checked: save radio button value for name input value(current value in form).
    2. else: save last resposne based on json object. 
*/
function saveRequest() {
    let gender = document.forms["frm"]["gender"].value;
    let myStorage = window.localStorage;

    // 1
    if (gender) {
        // console.log("saved.");
        let name = validateUsername(document.forms["frm"]["fname"].value);
        if (!name)
            return false;
        myStorage.setItem(name, gender);


    } else {
        // 2
        let nameT = document.getElementById("reqName").innerHTML;
        if (!validateUsername(nameT)) {
            return false;
        }
        let genderT = document.getElementById("gender").innerHTML;
        console.log(genderT);

        if (genderT != "male" && genderT != "female") {
            notify(invalidGenderInfo);
            return false;
        }
        myStorage.setItem(nameT, genderT);
    }
    notify(GenderInfo);
}



function validateUsername(name) {
    var regEx = /^[a-z][a-z\s]*$/;
    if (name == null || name == "") {
        notify(ErrInvalidNameLength0);
        return null;
    } else if (name.length > 255) {
        notify(ErrInvalidNameLength255);
        return null;


    } else if (!name.match(regEx)) {
        notify(ErrInvalidNameChar);
        return null;

    } else {
        return name;
    }

}

function isSuccessful(status) {
    return status / 100 === 3 || status / 100 === 2;
}

function restoreFromCache(name) {
    let myStorage = window.localStorage;
    const record = myStorage.getItem(name)
    if (record != null) {
        notify(RestoreCache);
        return record;
    }

    return false;
}



function setInfo(info) {
    document.getElementById("reqName").innerHTML = info['name'];
    document.getElementById("gender").innerHTML = info['gender'];
    document.getElementById("prob").innerHTML = info['probability'];
}


function setSavedInfo(name, gender) {
    document.getElementById("SavedreqName").innerHTML = name;
    document.getElementById("Savedgender").innerHTML = gender;
    // document.getElementById("Savedprob").innerHTML = "Probability: " + info['probability'];
}

function clearInfo() {
    document.getElementById("reqName").innerHTML = "Requested name: ";
    document.getElementById("gender").innerHTML = "Gender: ";
    document.getElementById("prob").innerHTML = "Probability: ";
}


function notify(message) {
    document.getElementById("notifier").style.height = "5%";
    document.getElementById("notifyType").innerHTML = message;

    setTimeout(function() {
        document.getElementById("notifier").style.height = "0";
    }, 5000);
}

function compare(a, b) {
    return a[Updated].localeCompare(b[Updated])
}


function clearStoredName() {
    let myStorage = window.localStorage;
    let name = validateUsername(document.forms["frm"]["fname"].value);
    if (!name)
        return false;
    notify(RemoveCache)
    myStorage.removeItem(name);
}


function notify(message) {
    document.getElementById("notifier").style.height = "5%";
    document.getElementById("notifyType").innerHTML = message;

    setTimeout(function() {
        document.getElementById("notifier").style.height = "0";
    }, 5000);
}

// used for remove cache in refresh
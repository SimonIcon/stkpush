// getting html inputs and document
const submitButton = document.querySelector('.button')
const phone = document.getElementById('phone')
const amount = document.getElementById('amount')

// listening submit button
submitButton.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = {
        phone: phone.value,
        amount: amount.value
    }
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/')
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onload = function () {
        if (xhr.responseText === "success") {
            alert("email sent")
            phone.value === "",
                amount.value === ""
        } else {
            alert("something went wrong")
        }
    }
    xhr.send(JSON.stringify(formData))
})
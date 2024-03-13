import {useEffect, useState} from "react";

const myObjects = [
    {
        "id": "75986ff6-14d1-47c0-ac33-3caed6b0c5c8",
        "fullName": "Khulakpam abdul sukur",
        "batch": "Batch2",
        "email": "mkamirsidik@gmail.com",
        "rollNo": "25",
        "contact": "0987654321",
        "gender": "M",
        "userName": "amirgengiz",
        "password": "12345"
    },
    {
        "id": "b7e2f248-4ae7-4aa3-8bd5-1e755fa299ab",
        "fullName": "Khulakpam",
        "batch": "Batch2",
        "email": "mkamiik@gmail.com",
        "rollNo": "25",
        "contact": "0987654391",
        "gender": "M",
        "userName": "amirgengiz",
        "password": "12345"
    },
    {
        "id": "5dbe74ef-8a32-4839-b4f9-a65a4866f897",
        "fullName": "Ahmed",
        "batch": "Batch2",
        "email": "mkamirsidik@il.com",
        "rollNo": "25",
        "contact": "0987654321",
        "gender": "M",
        "userName": "amirgengiz",
        "password": "12345"
    }
];
useEffect(() => {
    fetch("api/addusers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(myObjects)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}, []);

const [data, setData] = useState('');

//change to text the response
useEffect(() => {
    fetch('/api/data')
        .then(response => response.text())
        .then(data => setData(data));
}, []);


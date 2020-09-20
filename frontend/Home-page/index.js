function fetchURL(url, method = 'GET', body = null) {
        return fetch(url, {
                method: method,
                body: JSON.stringify(body),
                headers: {
                        'Content-type': 'application/json'
                }
        })
                .then(response => response.json())
                .then(b => console.log(b))
}

// fetchURL('https://jsonplaceholder.typicode.com/users', 'POST', {
//         name: 'Evhen',
//         age: 30,
//         job: 'ingeneer'
// })

console.log('test test')
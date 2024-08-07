const button = document.querySelector('button');

button.addEventListener('click', async () => {
    try {
        const res = await fetch('http://localhost:5000/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    { id: 1, quantity: 3 },
                    { id: 2, quantity: 1 }
                ]
            })
        })
        if (res.ok) {
            const url = await res.json()
            window.location = url.url
            //console.log(url)
        }
        else{
            res.json({"message":"Failed to get url"})
        }
    } catch (error) {
        console.log(error)
    }

})
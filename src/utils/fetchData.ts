import axios from 'axios'

async function fetchData(url: string, params: object = {}) {

    return await axios.get(url, params)

}

export default fetchData
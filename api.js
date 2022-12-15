import fetch from 'node-fetch';
import User from './models/User.js';

const apiLink = process.env.API_LINK;
async function getUsers() {
    const user = await fetch(apiLink);
    const response = await user.json();
    for (let i = 0; i < response.data.length; i++) {
        const user = new User({
            id: response.data[i]['id'],
            name: response.data[i]['name'],
            email: response.data[i]['email'],
            gender: response.data[i]['gender'],
            status: response.data[i]['status'],
        });
        user.save();
    }
}
export default getUsers;
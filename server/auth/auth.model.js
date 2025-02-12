import { readFile, writeFile } from 'fs/promises';


export async function validateUser(username, password) {
    let users = await readFile('./data/users.json', 'utf-8');
    users = JSON.parse(users);
    let user = users.find(user => user.username === username && user.password === password);
    return user;
}

export async function registerUser(username, password) {
    let users = await readFile('./data/users.json', 'utf-8');
    users = JSON.parse(users);
    

    if (users.find(user => user.username === username))
        return false;

    users.push({ username, password });
    await writeFile('./data/users.json', JSON.stringify(users));
    let user = { username, tansactionID: 1, "categories": [{ "catName": "default", "items ": [] }], "children": [] };
    writeFile(`./data/users/${username}.json`, JSON.stringify(user));

    return true;
}

const fetch = require("node-fetch");

const requestToken = credentials =>
    fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(res => res.json())
        .catch(error => {
            throw new Error(JSON.stringify(error))
        });

const requestUserInfo = token =>
    fetch(`https://api.github.com/user?access_token=${token}`)
        .then(res => res.json())
        .catch(error => {
            throw new Error(JSON.stringify(error))
        });

const authorizeWithGithub = async (code, client_id, client_secret) => {
    const { access_token } = await requestToken({ client_id, client_secret, code });
    const user = await requestUserInfo(access_token);
    return { ...user, access_token };
};

module.exports = authorizeWithGithub;

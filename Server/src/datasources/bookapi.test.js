const bookAPI = require('./bookapi');

API = new bookAPI();
x = API.baseURL;
test('TEST1', () => {
    expect(x).toMatch('https://api.itbook.store/1.0/')
})

//test('TEST2', () => {
//    return API.get('https://api.itbook.store/1.0//book/9781617294136').then(data => expect(data.title).toMatch('Securing DevOps'));
//})




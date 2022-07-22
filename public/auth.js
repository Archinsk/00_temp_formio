let s1 = "s31RNDipSufqHSMxzKqujzch5/DHVoLi5GskPhgE1AiVZ13AybQ68CvgbyPsl3/x";
let s2 = "Mi7+M9Fu0aacFg+MhS/oNXnZoApqQCR51ChgZPZTshEzVy66TVwOhqMusmopXgUy";
let s3 = null;
let s4 = new Date();

axios.defaults.baseURL = window.location.protocol + '//' + privateCircuitHost + ":" + privateCircuitPort;

let instance = axios.create({
    headers: {
        get: {
            'Content-Type': 'application/json'
        }
    }
})

async function getAuth() {
    if (s1 && s2) {
        if (!s3) await getTokenRequest();
        let currentDate = new Date();
        if ((currentDate.getTime() - s4.getTime()) > 240000) {
            const waitMe = await getTokenRequest();
            return JSON.parse(s3).token;
        } else return JSON.parse(s3).token;
    } else {
        return JSON.parse(s3).token;
    }
}

async function getTokenRequest() {
    const result = await instance.get("/o/template/auth/getToken?s1=" + s1 + "&s2=" + s2);
    if (result.data.hasOwnProperty('error')) {
        console.error("Error while getting auth token");
    } else {
        s3 = atob(result.data.token);
        s4 = new Date();
    }
    if (s3) {
        try {
            instance.defaults.headers.common = {'Authorization': `Bearer ` + JSON.parse(s3).token}
        } catch (e) {
            console.error("Catch error while parsing data");
        }
    }
    return s3;
}

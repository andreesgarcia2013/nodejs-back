const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_ROUTE;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/login`,
            `${api}/register`,
        ]
    })
}

async function isRevoked(req, token){
    if(!token.payload.isAdmin) {
       return true;
    }
}

module.exports = authJwt
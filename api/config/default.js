require('dotenv').config();

module.exports = {
    'host': 'localhost',
    'port': process.env.PORT,
    'public': '../public/',
    'paginate': {
        'default': 20,
        'max': 100000
    },
    'mongodb': process.env.DB,
    'authentication': {
        'entity': 'user',
        'service': 'users',
        'secret': process.env.SECRET,
        'authStrategies': [
            'jwt',
            'local'
        ],
        'jwtOptions': {
            'header': {
                'typ': 'access'
            },
            'audience': process.env.ORIGINS.split(', ')[0],
            'issuer': 'feathers',
            'algorithm': 'HS256',
            'expiresIn': '3d'
        },
        'local': {
            'usernameField': 'email',
            'passwordField': 'password'
        },
        'oauth': {
            'redirect': '/',
            'google': {
                'key': '<google oauth key>',
                'secret': '<google oauth secret>',
                'scope': [
                    'email',
                    'profile',
                    'openid'
                ]
            },
            'facebook': {
                'key': '<facebook oauth key>',
                'secret': '<facebook oauth secret>'
            }
        }
    }
};
